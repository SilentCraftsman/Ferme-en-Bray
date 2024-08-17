import React, { useEffect } from "react";
import { clearCart } from "../utils/utility";
import Link from "next/link";

const SuccessPage = () => {
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div>
      <h1>Merci pour votre achat !</h1>
      <p>Votre panier a été vidé avec succès.</p>
      {/* Lien pour revenir à l'accueil */}
      <Link href="/">Retour à l'accueil</Link>
    </div>
  );
};

export default SuccessPage;
