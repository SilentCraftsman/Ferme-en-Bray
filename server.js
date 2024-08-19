import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import sgMail from "@sendgrid/mail";
import bodyParser from "body-parser";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
const corsOptions = {
  origin: "http://localhost:3000", // Autoriser seulement les requêtes venant de cette origine
  methods: ["GET", "POST"], // Autoriser ces méthodes HTTP
  allowedHeaders: ["Content-Type", "Authorization"], // Autoriser ces en-têtes
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Route pour créer une session de paiement
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  const { items, pickupDay, pickupTime } = req.body;
  const producerAccountId = process.env.PRODUCER_ACCOUNT_ID;
  const baseUrl = process.env.BASE_URL;

  // Vérification de la configuration de l'URL de base
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
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convertir en centimes
      },
      quantity: item.quantity,
    }));

    const totalAmount = lineItems.reduce(
      (sum, item) => sum + item.price_data.unit_amount * item.quantity,
      0
    );
    const applicationFeeAmount = Math.round(totalAmount * 0.05);

    // Création de la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: producerAccountId,
        },
      },
    });

    // Répondre avec l'ID de la session
    res.json({ id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

// Route pour vérifier le statut de paiement et envoyer l'email si le paiement est réussi
app.get("/api/stripe/success", async (req, res) => {
  const { session_id } = req.query;
  console.log("Received session_id:", session_id);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Retrieved session:", session);

    if (session.payment_status === "paid") {
      const itemsHtml = (session.display_items || [])
        .map(
          (item) => `
                <tr>
                    <td>${item.custom.name || "Sans description"}</td>
                    <td>${item.amount_total / 100} €</td>
                    <td>${item.quantity}</td>
                </tr>`
        )
        .join("");

      const totalHtml = `
                <tr>
                    <td colspan="2"><strong>Total</strong></td>
                    <td><strong>${session.amount_total / 100} €</strong></td>
                </tr>`;

      const msg = {
        to: process.env.PRODUCER_EMAIL,
        from: process.env.EMAIL_USER,
        subject: "Confirmation de votre commande",
        text: `Merci pour votre commande. Votre retrait est prévu pour ${session.metadata.pickupDay} à ${session.metadata.pickupTime}.`,
        html: `
                    <strong>Merci pour votre commande</strong><br>
                    Votre retrait est prévu pour ${session.metadata.pickupDay} à ${session.metadata.pickupTime}.<br><br>
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Prix</th>
                                <th>Quantité</th>
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
  console.log(`Server is running on port ${port}`);
});
