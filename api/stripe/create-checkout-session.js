import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { items } = req.body;

      // Créez une session de paiement Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.title,
            },
            unit_amount: Math.round(item.price * 100), // Convertir en centimes
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      console.error("Error creating checkout session:", err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
