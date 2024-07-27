// app/api/contact/route.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validation des données
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "Tous les champs sont requis." }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Configuration du transporteur
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Options de l'email
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Nouveau message de contact",
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "Votre message a été envoyé avec succès." }),
      { headers: { "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);

    return new Response(
      JSON.stringify({
        message: "Une erreur s'est produite lors de l'envoi de votre message.",
      }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}
