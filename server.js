import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint de création de session Stripe
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  console.log("Received POST request to /api/stripe/create-checkout-session");
  console.log("Request body:", req.body);

  const { items, customerEmail } = req.body;

  if (!Array.isArray(items) || items.length === 0 || !customerEmail) {
    return res.status(400).send("Bad Request: Invalid request data");
  }

  try {
    // Création des lignes de produit pour Stripe Checkout
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: Math.round(parseFloat(item.price) * 100),
      },
      quantity: item.quantity,
    }));

    // Création de la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      customer_email: customerEmail,
    });

    console.log("Stripe Checkout session created:", session);

    // Réponse avec l'ID de la session
    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err.message);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

// Route pour tester le serveur
app.get("/api/test-endpoint", (req, res) => {
  res.json({ message: "Test endpoint working!" });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
