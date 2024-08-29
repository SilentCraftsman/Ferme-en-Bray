// app/api/stripe/create-checkout-session.js
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialisation de Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Extraction des données JSON de la requête
    const { items } = await request.json();

    // Validation des données reçues
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Création d'une session de checkout avec Stripe
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
      success_url: `${process.env.BASE_URL}/success`, // URL de succès
      cancel_url: `${process.env.BASE_URL}/cancel`, // URL d'annulation
    });

    // Réponse avec l'ID de la session
    return NextResponse.json({ id: session.id });
  } catch (error) {
    // Gestion des erreurs
    console.error("Error creating checkout session:", error.message);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
