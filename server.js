import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import fs from "fs";
import next from "next"; // Importation de Next.js pour gérer les routes
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
const client = new MongoClient(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let ordersCollection;

(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("shop");
    ordersCollection = db.collection("orders");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
})();

const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(bodyParser.json());

// Route pour créer une session de paiement
app.post("/api/stripe/create-checkout-session", async (req, res) => {
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

    const totalAmount = lineItems.reduce(
      (sum, item) => sum + item.price_data.unit_amount * item.quantity,
      0
    );
    const applicationFeeAmount = Math.round(totalAmount * 0.05);

    // Stockage des détails de la commande dans MongoDB
    const order = {
      items,
      pickupDay,
      pickupTime,
      customerName,
      customerEmail,
      customerAddress,
      createdAt: new Date(),
    };
    const result = await ordersCollection.insertOne(order);
    const orderId = result.insertedId;

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: process.env.PRODUCER_ACCOUNT_ID,
        },
      },
      customer_email: customerEmail,
      metadata: {
        order_id: orderId.toString(),
        pickupDay,
        pickupTime,
      },
      billing_address_collection: "required",
      customer_creation: "always",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

// Route pour vérifier le statut de paiement et envoyer l'email si le paiement est réussi
app.get("/api/stripe/success", async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).send("Bad Request: session_id is required");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Récupération des détails de la commande depuis MongoDB
      const order = await ordersCollection.findOne({
        _id: new ObjectId(session.metadata.order_id),
      });

      if (!order) {
        console.error("Order not found");
        return res.status(404).send("Order not found");
      }

      // Récupérer les informations du client depuis la session Stripe
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

      // Construction du message avec les informations récupérées depuis la session Stripe
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

      // Chemin relatif pour enregistrer la facture
      const invoicePath = path.join(
        __dirname,
        `factures/facture-${session.metadata.order_id}.pdf`
      );

      // Créez la facture
      createInvoice(order, invoicePath);

      // Attendez que le fichier soit complètement écrit
      setTimeout(() => {
        // Envoyez la facture par email
        if (fs.existsSync(invoicePath)) {
          sendInvoiceEmail(customerEmail, invoicePath);
        } else {
          console.error("Invoice file was not created.");
          res
            .status(500)
            .send("Internal Server Error: Invoice file not created.");
        }
      }, 1000); // Temporisation de 1 seconde pour s'assurer que le fichier est écrit
    } else {
      console.log("Payment not completed. Email not sent.");
      res.status(400).send("Payment not completed.");
    }
  } catch (err) {
    console.error("Error retrieving session or sending email:", err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

app.all("*", (req, res) => {
  return handle(req, res);
});

nextApp.prepare().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
