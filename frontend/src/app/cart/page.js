import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Importation dynamique pour éviter les charges inutiles lors du rendu initial
const CartPage = dynamic(() => import('@/components/CartPage.js'), {
  loading: () => <p>Chargement...</p>, // Composant de chargement pour améliorer l'expérience utilisateur
});

export const metadata = {
  title: 'Mon Panier - La volaille en Bray',
  description:
    'Consultez et gérez les articles dans votre panier chez La volaille en Bray.',
};

export default function Cart() {
  return (
    <Suspense fallback={<div>Chargement du panier...</div>}>
      <CartPage />
    </Suspense>
  );
}
