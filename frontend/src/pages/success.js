import React, { useEffect, useState } from 'react';
import { clearCart } from '@/utils/utility.js';
import { useRouter } from 'next/router';
import styles from '@/styles/success.module.scss';
import { checkPaymentStatus } from '@/services/api.service.js';
import notify from '@/utils/notify.utils.js';

const checkPaymentStatusAndSendEmail = async (
  sessionId,
  router,
  setLoading
) => {
  try {
    const data = await checkPaymentStatus(sessionId);
    console.debug('Payment status checked:', data);
    setLoading(false);
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    notify.error(
      'Erreur lors de la vérification du paiement. Vous allez être redirigé.'
    );
    setTimeout(() => {
      router.push('/');
    }, 5000);
  }
};

const SuccessPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { session_id } = router.query;

    if (session_id) {
      checkPaymentStatusAndSendEmail(session_id, router, setLoading);
      clearCart();
    }
  }, [router]);

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>
          Vérification du statut de votre paiement...
        </h1>
      </div>
    );
  }
  // TODO - add btn to return to home page
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Merci pour votre commande ! Vous recevrez bientôt une confirmation par
        email.
      </h1>
    </div>
  );
};

export default SuccessPage;
