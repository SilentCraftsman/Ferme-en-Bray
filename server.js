import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { check, validationResult } from "express-validator";

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
/*app.use(cors({
  origin: 'https://your-domain.com', // Remplace par ton domaine
  optionsSuccessStatus: 200
})); Pour plus tard*/
app.use(cors());
app.use(bodyParser.json({ limit: "10kb" })); // Limite la taille du payload
app.use(helmet()); // Sécurise les en-têtes HTTP

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minute
  max: 10, // Limite chaque IP à 10 requêtes par fenêtre
});
app.use(limiter);

// Route pour créer une commande PayPal avec validation des entrées
app.post(
  "/api/paypal/create-order",
  [
    check("items").isArray().withMessage("Items must be an array"),
    check("items.*.title").isString().withMessage("Title must be a string"),
    check("items.*.price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    check("items.*.quantity")
      .isInt({ gt: 0 })
      .withMessage("Quantity must be a positive integer"),
  ],
  async (req, res) => {
    // Validation des données
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
            currency_code: "EUR",
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
  }
);

// Route pour capturer le paiement PayPal
app.post(
  "/api/paypal/capture-payment",
  [check("orderID").isString().withMessage("Order ID must be a string")],
  async (req, res) => {
    // Validation des données
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderID } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
      const capture = await client.execute(request);
      res.status(200).json(capture.result);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
