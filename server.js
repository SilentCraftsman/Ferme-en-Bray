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
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Route pour créer une session de paiement
app.post("/api/stripe/create-checkout-session", async (req, res) => {
  const { items, pickupDay, pickupTime } = req.body;

  const producerAccountId = process.env.PRODUCER_ACCOUNT_ID;
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

  if (!Array.isArray(items) || items.length === 0) {
    console.error("Invalid items data:", items);
    return res.status(400).send("Bad Request: Invalid items data");
  }

  try {
    const lineItems = items.map((item) => {
      // Trouver la variante sélectionnée
      const selectedVariant = item.selectedVariant;
      let updatedTitle = item.title;

      if (selectedVariant) {
        // Modifier le titre du produit en fonction de la variante sélectionnée
        updatedTitle = updatedTitle.replace(
          /(\d+(\.\d+)?kg)/,
          selectedVariant.weight
        );
      }

      // Convert price from string to integer (cents) for Stripe
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
      metadata: {
        items: JSON.stringify(items),
        pickupDay,
        pickupTime,
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
      const items = JSON.parse(session.metadata.items);

      // Gérer les articles et leurs variantes
      const itemsHtml = items
        .map((item) => {
          // Vérifier si l'article a une variante sélectionnée
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
