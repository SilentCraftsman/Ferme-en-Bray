import React, { useEffect, useState } from 'react';
import { clearCart } from '@/utils/utility.js';
import { useRouter } from 'next/router';
import styles from '@/styles/success.module.scss';
import { checkPaymentStatus } from '@/services/api.service.js';
import classNames from 'classnames';

const checkPaymentStatusAndSendEmail = async (
  sessionId,
  router,
  setLoading,
  setError
) => {
  try {
    const data = await checkPaymentStatus(sessionId);
    console.debug('Payment status checked:', data);
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    setError(error);
  } finally {
    setLoading(false);
  }
};

const SuccessPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { session_id } = router.query;

    if (session_id) {
      checkPaymentStatusAndSendEmail(session_id, router, setLoading, setError);
      clearCart();
    }
  }, [router]);

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={classNames(styles.title, styles.titleLoading)}>
          Vérification du statut de votre paiement...
        </h1>
      </div>
    );
  }
  if (error) {
    return (
      <div className={styles.page}>
        <h1 className={classNames(styles.title, styles.titleError)}>
          Erreur lors de la vérification du paiement.
        </h1>
        <p>
          <a href="/" className={styles.link}>
            Retour à l'accueil
          </a>
        </p>
      </div>
    );
  }
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Merci pour votre commande ! Vous recevrez bientôt une confirmation par
        email.
      </h1>
      <p>
        <a href="/" className={styles.link}>
          Retour à l'accueil
        </a>
      </p>
    </div>
  );
};

export default SuccessPage;
