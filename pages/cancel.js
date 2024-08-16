import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CancelPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { session_id } = router.query;

      if (session_id) {
        try {
          // Vous pouvez ajouter une logique pour récupérer les détails de la session si nécessaire
          const response = await fetch(`/api/stripe/session/${session_id}`);
          const data = await response.json();
          // Traitez les données ici si nécessaire
          setMessage("Votre paiement a été annulé. Vous pouvez réessayer.");
        } catch (error) {
          console.error("Error fetching session:", error);
          setMessage("Impossible de récupérer les détails de la session.");
        } finally {
          setLoading(false);
        }
      } else {
        setMessage("Votre paiement a été annulé.");
        setLoading(false);
      }
    };

    fetchSession();
  }, [router.query]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Annulation du Paiement</h1>
      <p>{message}</p>
      <p>
        Vous pouvez revenir au <a href="/cart">panier</a> pour réessayer le
        paiement.
      </p>
    </div>
  );
};

export default CancelPage;
