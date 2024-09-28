import React from 'react';
import MainContent from '@/components/Main.js';
import '@/styles/HomePage.scss';

export default function HomePage() {
  return (
    <div className="home-container">
      <h1>Découvrez nos produits à base de volailles</h1>
      <MainContent />
    </div>
  );
}
