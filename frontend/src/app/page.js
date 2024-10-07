import React from 'react';
import MainContent from '@/components/Main.js';
import '@/styles/HomePage.scss';

export default function HomePage() {
  return (
    <div className="home-container">
      <h2>Découvrez nos produits à base de volailles</h2>
      <MainContent />
    </div>
  );
}
