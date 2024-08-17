import React, { useEffect } from "react";
import { clearCart } from "../utils/utility";
import { useRouter } from "next/router";
import styles from "../styles/success.module.scss"; // Importation des styles

const SuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    clearCart();

    const timer = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Merci pour votre achat !</h1>
      <p className={styles.message}>
        Votre paiement a été réussi avec succès. Nous vous remercions pour votre
        confiance.
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
