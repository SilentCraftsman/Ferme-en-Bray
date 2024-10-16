import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Importation dynamique pour éviter les charges inutiles lors du rendu initial
const CartPage = dynamic(() => import('@/components/cart/CartPage.js'), {
  loading: () => <LoadingSpinner />, // Utilisation du composant de chargement pour améliorer l'expérience utilisateur
});

export const metadata = {
  title: 'Mon Panier - La volaille en Bray',
  description:
    'Consultez et gérez les articles dans votre panier chez La volaille en Bray.',
  alternates: {
    canonical: `${process.env.FRONTEND_BASE_URL}/panier`,
  },
};

export default function Cart() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CartPage />
    </Suspense>
  );
}
