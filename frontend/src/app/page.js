import React from 'react';
import MainContent from '@/components/Main.js';
import '@/styles/HomePage.scss';

export default function HomePage() {
  return (
    <div className="home-container">
      <h1>Bienvenue sur notre site</h1>
      <p>Découvrez nos produits à base de volailles.</p>
      <MainContent />
    </div>
  );
}
