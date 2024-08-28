// /pages/api/stripe/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
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
      return res
        .status(400)
        .json({ error: "Bad Request: Invalid request data" });
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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/cancel`,
        customer_email: customerEmail,
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
