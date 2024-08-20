// Importation des modules nécessaires
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const port = process.env.PORT || 3001;

// Connexion à MongoDB
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
    console.error("Error connecting to MongoDB", error);
  }
})();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Route pour créer une session de paiement
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  const { items, pickupDay, pickupTime } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    console.error("Invalid items data:", items);
    return res.status(400).send("Bad Request: Invalid items data");
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
      metadata: {
        order_id: orderId.toString(),
        pickupDay, // Ajout de pickupDay aux métadonnées
        pickupTime, // Ajout de pickupTime aux métadonnées
      },
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

      // Construction du message avec les informations récupérées depuis les métadonnées
      const msg = {
        to: process.env.PRODUCER_EMAIL,
        from: process.env.EMAIL_USER,
        subject: "Confirmation de votre commande",
        text: `Nouvelle commande ! Le retrait de la commande est prévu pour ${session.metadata.pickupDay} à ${session.metadata.pickupTime}.`,
        html: `
          <strong>Nouvelle commande !</strong><br>
          Le retrait de la commande est prévu pour ${session.metadata.pickupDay} à ${session.metadata.pickupTime}.<br><br>
          <table border="1" cellpadding="5" cellspacing="0">
            <thead>
              <tr>
                <th>Description</th>
                <th>Prix à l'unité du produit</th>
                <th>Quantité</th>
                <th>Variante</th>
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
    } else {
      console.log("Payment not completed. Email not sent.");
    }

    res.redirect("/success");
  } catch (err) {
    console.error("Error retrieving session or sending email:", err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
