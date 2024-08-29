// /pages/api/stripe/create-checkout-session.js
import Stripe from "stripe";

// Initialisation de Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15", // Assurez-vous d'utiliser la version correcte de l'API Stripe
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Extraction des données JSON de la requête
      const { items } = req.body;

      // Validation des données reçues
      if (!items || items.length === 0) {
        return res.status(400).json({ error: "No items provided" });
      }

      // Création d'une session de checkout avec Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: "eur", // Devise
            product_data: {
              name: item.title, // Nom du produit
            },
            unit_amount: Math.round(item.price * 100), // Montant en centimes
          },
          quantity: item.quantity, // Quantité
        })),
        mode: "payment",
        success_url: `${process.env.BASE_URL}/success`, // URL de succès
        cancel_url: `${process.env.BASE_URL}/cancel`, // URL d'annulation
      });

      // Réponse avec l'ID de la session
      return res.status(200).json({ id: session.id });
    } catch (error) {
      // Gestion des erreurs
      console.error("Error creating checkout session:", error.message);
      console.error("Error stack:", error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Méthode non autorisée
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
