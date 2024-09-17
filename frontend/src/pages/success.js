import React, { useEffect } from 'react';
import { clearCart } from '@/utils/utility.js';
import { useRouter } from 'next/router';
import styles from '@/styles/success.module.scss';
import { checkPaymentStatus } from '@/services/api.service.js'; // Assurez-vous que le chemin est correct

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    console.log('useEffect triggered with session_id:', session_id); // Ajouté pour vérifier le déclenchement de useEffect

    if (session_id) {
      checkPaymentStatusAndSendEmail(session_id);
    } else {
      console.log('Session ID is not available yet.');
    }

    clearCart();

    const timer = setTimeout(() => {
      router.push('/');
    }, 10000); // Réduit le temps d'attente à 10 secondes pour les tests

    return () => clearTimeout(timer);
  }, [session_id, router]);

  const checkPaymentStatusAndSendEmail = async (sessionId) => {
    console.log('Function is called with sessionId:', sessionId); // Ajouté pour vérifier si la fonction est appelée

    try {
      const data = await checkPaymentStatus(sessionId);
      console.log('Payment status checked:', data);
    } catch (error) {
      console.error('Erreur lors de la vérification du paiement:', error);
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
