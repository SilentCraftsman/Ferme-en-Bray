import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

// Configurer l'API PayPal
const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route pour créer une commande PayPal
app.post("/api/paypal/create-order", async (req, res) => {
  console.log("Received create-order request with items:", req.body.items);

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  const totalValue = req.body.items
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  console.log("Total order value:", totalValue);

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "EUR", // Assurez-vous que cela correspond à la devise de votre panier
          value: totalValue,
        },
      },
    ],
  });

  try {
    const order = await client.execute(request);
    console.log("Order created successfully:", order.result);
    res.status(200).json({ orderID: order.result.id });
  } catch (err) {
    console.error("Error creating order:", err.message);
    res.status(500).send(err.message);
  }
});

// Route pour capturer le paiement PayPal
app.post("/api/paypal/capture-payment", async (req, res) => {
  const { orderID } = req.body;
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    res.status(200).json(capture.result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
