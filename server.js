import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Stripe from "stripe";

dotenv.config(); // Charger les variables d'environnement

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Clé secrète Stripe
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "10kb" }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 10, // Limite chaque IP à 10 requêtes par fenêtre
});
app.use(limiter);

// Route pour créer une session de paiement Stripe
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  const { items } = req.body;
  const producerAccountId = process.env.PRODUCER_ACCOUNT_ID; // ID du compte du producteur

  // Vérifie si BASE_URL est défini correctement
  const baseUrl = process.env.BASE_URL;
  if (
    !baseUrl ||
    (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://"))
  ) {
    console.error("BASE_URL is not defined correctly in .env");
    return res
      .status(500)
      .send("Internal Server Error: BASE_URL not set correctly");
  }

  // Validation des données entrantes
  if (!Array.isArray(items) || items.length === 0) {
    console.error("Invalid items data:", items);
    return res.status(400).send("Bad Request: Invalid items data");
  }

  try {
    // Calcul des détails des lignes de produits et de la commission
    const lineItems = items.map((item) => {
      // Convertir le total en nombre de centimes
      const totalAmount =
        parseFloat(item.price.replace("€", "").replace(",", ".")) * 100;
      const unitAmount = Math.round(totalAmount / item.quantity); // Calculer le prix unitaire

      if (isNaN(unitAmount) || unitAmount <= 0) {
        throw new Error(`Invalid price for item ${item.title}: ${item.price}`);
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.title,
            images: [item.image],
          },
          unit_amount: unitAmount, // Prix unitaire en centimes
        },
        quantity: item.quantity, // Quantité
      };
    });

    // Calculer le montant total sans commission
    const totalAmount = lineItems.reduce((sum, item) => {
      return sum + item.price_data.unit_amount * item.quantity;
    }, 0);

    // Calculer la commission pour l'admin (4%)
    const commissionAmount = Math.round(totalAmount * 0.04);

    // Créer une Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
      payment_intent_data: {
        application_fee_amount: commissionAmount,
        transfer_data: {
          destination: producerAccountId,
        },
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
