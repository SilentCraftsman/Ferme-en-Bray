import React, { useEffect } from "react";
import { clearCart } from "../utils/utility";
import { useRouter } from "next/router";
import styles from "../styles/success.module.scss";

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    const checkPaymentStatusAndSendEmail = async (sessionId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/stripe/success?session_id=${sessionId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("Payment status checked:", await response.json());
      } catch (error) {
        console.error("Erreur lors de la vérification du paiement:", error);
      }
    };

    if (session_id) {
      checkPaymentStatusAndSendEmail(session_id);
    }

    clearCart();

    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [session_id, router]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Merci pour votre achat !</h1>
      <p className={styles.message}>
        Votre paiement a été effectué avec succès. Nous vous remercions pour
        votre confiance.
      </p>
      <p className={styles.message}>
        Vous serez redirigé vers la page d'accueil dans 10 secondes.
      </p>
      <p>
        <a href="/" className={styles.link}>
          Retour à l'accueil
        </a>
      </p>
    </div>
  );
};

export default SuccessPage;
