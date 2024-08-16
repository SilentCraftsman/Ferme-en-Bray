import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { session_id } = router.query;

      if (session_id) {
        try {
          const response = await fetch(`/api/stripe/session/${session_id}`);
          const data = await response.json();
          setSession(data);
        } catch (error) {
          console.error("Error fetching session:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router.query]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Merci pour votre achat !</h1>
      <p>Votre paiement a été réussi. Voici les détails de votre commande :</p>
      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      ) : (
        <p>Impossible de récupérer les détails de la session.</p>
      )}
    </div>
  );
};

export default SuccessPage;
