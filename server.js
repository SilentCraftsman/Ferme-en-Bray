import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import fs from "fs";
import next from "next";
import { createInvoice, sendInvoiceEmail } from "./invoiceGenerator.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
const port = process.env.PORT || 3001;

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);
let ordersCollection;

(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("shop");
    ordersCollection = db.collection("orders");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
})();

const corsOptions = {
  origin: "*", // Ajustez cette valeur selon votre besoin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Endpoint de test pour Stripe
app.get("/api/stripe/test", async (req, res) => {
  try {
    const testCustomer = await stripe.customers.create({
      description: "Test Customer",
    });
    console.log("Stripe test customer created:", testCustomer);
    res.json({ message: "Stripe test successful", customer: testCustomer });
  } catch (err) {
    console.error("Error with Stripe test:", err.message);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

// Endpoint de création de session Stripe
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  console.log("Received POST request to /api/stripe/create-checkout-session");
  console.log("Request body:", req.body);

  const {
    items,
    pickupDay,
    pickupTime,
    customerName,
    customerEmail,
    customerAddress,
  } = req.body;

  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    !customerName ||
    !customerEmail
  ) {
    console.error("Invalid request data:", req.body);
    return res.status(400).send("Bad Request: Invalid request data");
  }

  try {
    const lineItems = items.map((item) => {
      const selectedVariant = item.selectedVariant;
      let updatedTitle = item.title;

      if (selectedVariant) {
        updatedTitle = updatedTitle.replace(
          /(\d+(\.\d+)?kg)/,
          selectedVariant.weight
        );
      }

      const unitAmount = Math.round(
        parseFloat(
          selectedVariant
            ? selectedVariant.price
            : item.price.replace("€", "").replace(",", ".")
        ) * 100
      );

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: updatedTitle,
            images: [item.image],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    console.log("Line items:", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      customer_email: customerEmail,
    });

    console.log("Stripe Checkout session created:", session);

    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err.message);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

// Endpoint pour gérer la réussite du paiement
app.get("/api/stripe/success", async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).send("Bad Request: session_id is required");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log("Retrieved Stripe session:", session);

    if (session.payment_status === "paid") {
      const order = await ordersCollection.findOne({
        _id: new ObjectId(session.metadata.order_id),
      });

      if (!order) {
        console.error("Order not found");
        return res.status(404).send("Order not found");
      }

      const customerName = session.customer_details.name || order.customerName;
      const customerEmail =
        session.customer_details.email || order.customerEmail;
      const customerAddress = order.customerAddress;

      const itemsHtml = order.items
        .map((item) => {
          const variantInfo = item.selectedVariant
            ? `${item.selectedVariant.type} - ${item.selectedVariant.weight}`
            : "Sans variante";
          return `
          <tr>
            <td>${item.title || "Sans description"}</td>
            <td>${parseFloat(item.price).toFixed(2)} €</td>
            <td>${item.quantity}</td>
            <td>${variantInfo}</td>
          </tr>`;
        })
        .join("");

      const totalHtml = `
        <tr>
          <td colspan="4"><strong>Total</strong></td>
          <td><strong>${(session.amount_total / 100).toFixed(2)} €</strong></td>
        </tr>`;

      const msg = {
        to: process.env.PRODUCER_EMAIL,
        from: process.env.EMAIL_USER,
        subject: "Confirmation de votre commande",
        text: `Le client de la commande : ${customerName}. 
               Le retrait de la commande par le client est prévu pour ${session.metadata.pickupDay} à ${session.metadata.pickupTime}.`,
        html: `
          <strong>Le nom et prénom qui figure sur la carte bancaire qui a payé la commande : ${customerName}</strong><br>
          Le retrait de la commande par le client est prévu pour ${session.metadata.pickupDay} à ${session.metadata.pickupTime}.<br><br>
          <strong>Email du client :</strong> ${customerEmail}<br>
          <strong>Adresse du client :</strong> ${customerAddress}<br><br>
          <table border="1" cellpadding="5" cellspacing="0">
            <thead>
              <tr>
                <th>Description</th>
                <th>Prix unitaire du produit</th>
                <th>Quantité</th>
                <th>Variante en terme de poids du produit</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              ${totalHtml}
            </tbody>
          </table>`,
      };

      await sgMail.send(msg);
      console.log("Confirmation email sent successfully.");

      const invoicePath = path.join(
        __dirname,
        `factures/facture-${session.metadata.order_id}.pdf`
      );

      createInvoice(order, invoicePath);

      setTimeout(() => {
        if (fs.existsSync(invoicePath)) {
          sendInvoiceEmail(customerEmail, invoicePath);
        } else {
          console.error("Invoice file was not created.");
          res
            .status(500)
            .send("Internal Server Error: Invoice file not created.");
        }
      }, 1000);
    } else {
      console.log("Payment not completed. Email not sent.");
      res.status(400).send("Payment not completed.");
    }
  } catch (err) {
    console.error("Error retrieving session or sending email:", err.message);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

// Route pour tester le serveur
app.get("/api/test-endpoint", (req, res) => {
  res.json({ message: "Test endpoint working!" });
});

// Gestion des requêtes Next.js après les routes API
app.all("*", (req, res) => handle(req, res));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
