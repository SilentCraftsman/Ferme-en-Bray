import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@/styles/cancel.module.scss';
import { cancelSession } from '@/services/api.service.js'; // Importation des styles

const CancelPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { session_id } = router.query;

      if (session_id) {
        try {
          await cancelSession(session_id);
          setMessage(
            'Votre paiement a été annulé. Nous sommes désolés pour le désagrément.'
          );
        } catch (error) {
          console.error('Error fetching session:', error);
          setMessage('Impossible de récupérer les détails de la session.');
        } finally {
          setLoading(false);
        }
      } else {
        setMessage('Votre paiement a été annulé.');
        setLoading(false);
      }
    };

    fetchSession();

    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router.query.session_id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Annulation du Paiement</h1>
      <p className={styles.message}>{message}</p>
      <p className={styles.message}>
        Il est possible que votre paiement ait été annulé en raison d'un
        problème avec les informations de paiement ou une expiration de session.
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

export default CancelPage;
