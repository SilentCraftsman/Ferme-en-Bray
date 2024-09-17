// cart/page.js

/*Ajouter du design à cette page*/

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Importation dynamique pour éviter les charges inutiles lors du rendu initial
const CartPage = dynamic(() => import('@/components/CartPage.js'), {
  loading: () => <p>Chargement...</p>, // Composant de chargement pour améliorer l'expérience utilisateur
});

export default function Cart() {
  return (
    <Suspense fallback={<div>Chargement du panier...</div>}>
      <CartPage />
    </Suspense>
  );
}
