import React, { useEffect } from "react";
import { clearCart } from "../utils/utility";
import { useRouter } from "next/router";
import styles from "../styles/success.module.scss"; // Assurez-vous que le chemin est correct

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    console.log("useEffect triggered with session_id:", session_id); // Ajouté pour vérifier le déclenchement de useEffect

    if (session_id) {
      checkPaymentStatusAndSendEmail(session_id);
    } else {
      console.log("Session ID is not available yet.");
    }

    clearCart();

    const timer = setTimeout(() => {
      router.push("/");
    }, 10000); // Réduit le temps d'attente à 10 secondes pour les tests

    return () => clearTimeout(timer);
  }, [session_id, router]);

  const checkPaymentStatusAndSendEmail = async (sessionId) => {
    console.log("Function is called with sessionId:", sessionId); // Ajouté pour vérifier si la fonction est appelée

    try {
      const url = `${
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"
      }/api/stripe/success?session_id=${sessionId}`;
      console.log("API URL:", url); // Ajouté pour vérifier l'URL construite

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      console.log("Payment status checked:", data);
    } catch (error) {
      console.error("Erreur lors de la vérification du paiement:", error);
    }
  };

  return (
    <div className={styles.page}>
      {/* Utilisation de la classe 'page' */}
      <h1 className={styles.title}>
        {/* Utilisation de la classe 'title' */}
        Merci pour votre commande ! Vous recevrez bientôt une confirmation par
        email.
      </h1>
    </div>
  );
};

export default SuccessPage;
