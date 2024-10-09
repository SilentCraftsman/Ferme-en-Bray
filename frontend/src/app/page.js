import React from 'react';
import MainContent from '@/components/Main.js';
import '@/styles/HomePage.scss';

export default function HomePage() {
  return (
    <div className="home-container">
      <h2>Vente de Volailles Fermières à Ferrières-en-Bray</h2>
      <p>
        Bienvenue à La Volaille en Bray ! Nous proposons des volailles locales
        de qualité supérieure, directement de notre ferme située à
        Ferrières-en-Bray. Nos volailles sont élevées en plein air et nourries
        avec soin pour vous offrir des produits frais et savoureux.
      </p>
      <h3>Nos Produits</h3>
      <p>
        Découvrez notre sélection de poulets, dindes, canards et autres
        volailles, parfaites pour vos repas en famille ou vos occasions
        spéciales.
      </p>
      <MainContent />
    </div>
  );
}
