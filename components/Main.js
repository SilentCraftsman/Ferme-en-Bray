// components/Main.js

"use client";

import React, { useState } from "react";
import ProductCard from "./ProductCard";
import Modal from "./Modal";
import { useCart } from "./cart/CartContext";
import "../styles/MainContent.scss";

// Produits pour les spécialités
const specialtyProducts = [
  {
    //Prix pour 800gr - Prix déjà converti
    id: 1,
    image: "./images/main-images/image-1.jpg",
    title: "Roulade de poulet - 18.20, € le kg",
    description:
      "Poulet, épaule de porc, boudin blanc, lait, pain, oignon, sel et poivre.",
    price: "14.56 €",
  },
  {
    //Prix pour 600gr - Prix déjà converti
    id: 2,
    image: "./images/main-images/image-2.jpg",
    title: "Roulade de pintade - 23.40, € le kilo",
    description:
      "Pintade, porc échine, boudin blanc, lait, pain, oignon, sel et poivre.",
    price: "14.04 €",
  },
  {
    //Prix pour 130gr - Prix déjà converti
    id: 3,
    image: "./images/main-images/image-3.jpg",
    title: "Boudin blanc de volaille - 15.90 €, le kg",
    description: "Lait, filet de poulet, farine, beurre, oeufs, sel et épices.",
    price: " 2.07 €",
  },
  {
    //Prix pour 125gr - Prix déjà converti
    id: 4,
    image: "./images/main-images/image-4.jpg",
    title: "Quenelles de volaille - 16.80 €, le kg",
    description: "Lait, filets de poulet, farine, beurre, oeufs, sel et épices",
    price: "2.10 €",
  },
  {
    //Prix pour 75gr - Prix déjà converti
    id: 5,
    image: "./images/main-images/image-1.jpg",
    title: "Croquettes de poulet - 19.80 €, le kg",
    description:
      "Filets et cuisses de poulet, lait, fromages, pain, sel, épices. ",
    price: "1.49 €",
  },
  {
    //Prix pour la pièce de 150gr - Prix déjà converti
    id: 6,
    image: "./images/main-images/image-2.jpg",
    title: "Bouchée de volaille - vendu par pièce de 150 gr",
    description:
      "Filet de poulet, crème fraîche, boudin blanc, quenelle, champignons.",
    price: "2.80 €",
  },
  {
    //Prix pour la pièce de 250gr - Prix déjà converti
    id: 7,
    image: "./images/main-images/image-2.jpg",
    title: "Terrine de volaille à la coupe - 17.20 €, le kg",
    description:
      "Poulet (viande et abats), gorge de porc, vin blanc (sulfites), oignons, champignons, oeufs, pulpe d'ail, fécule de pomme de terre, poivre et sucre.",
    price: "4.30 €",
  },
];

// Produits pour volailles élevées en plein air
const outdoorPoultryProducts = [
  /*Prêtes à cuire*/
  {
    // Moyen 2kg, petit 1.5kg - Prix déjà converti
    //
    id: 8,
    image: "./images/main-images/image-2.jpg",
    title: 'Poulet - "cou nu, roux, blanc" - 9.10 €, le kg',
    description:
      "Poulet est vendu en 2 types : - Soit en poulet petit qui lui fera un prix de 13.65 euros. - Soit en poulet moyen qui lui fera un prix de 18.20 euros.",
    price: "9.10 €",
  },
  {
    // Poids => 1.7kg - Prix déjà converti
    id: 9,
    image: "./images/main-images/image-3.jpg",
    title: "Pintade - 10.30 €, le kg",
    description: "Pintade de 1.7 kg !",
    price: "17.51 €",
  },
  {
    // Poids => 2.2kg - Prix déjà converti
    id: 10,
    image: "./images/main-images/image-1.jpg",
    title: "Canette / Canard Barbarie - 9.80 €, le kg",
    description: "Canard de 2.2 kg pour 21.56 €",
    price: "21.56 €",
  },
  /*Découpes fraîches*/
  {
    // Poids => 300 gr - Prix déjà converti
    id: 11,
    image: "./images/main-images/image-2.jpg",
    title: "Cuisses de poulet - 11.00 €, le kg",
    description: "Cuisses de poulet de 300 grammes !",
    price: "3.30 €",
  },
  {
    // Poids => 250 gr - Prix déjà converti
    id: 12,
    image: "./images/main-images/image-3.jpg",
    title: "Filets de poulet - 18.00 €, le kg",
    description: "Filets de poulet de 250 grammes.",
    price: "4.50 €",
  },
  {
    // Poids => 800 gr - Prix déjà converti
    id: 13,
    image: "./images/main-images/image-1.jpg",
    title: "Ailerons de poulet - 7.30 €, le kg",
    description: "Ailerons de poulet de 800 grammes",
    price: "5.84 €",
  },
  /*Autres produits :*/
  {
    // Poids => 10 kg - Prix déjà converti
    id: 14,
    image: "./images/main-images/image-1.jpg",
    title: "Dinde (blanche entière ou découpée) - 8.10 €, le kg",
    description:
      "Dinde (blanche entière ou découpée) vendu en format de 10 kg.",
    price: "81.00 €",
  },
];

// Produits pour les fêtes de fin d'année
const holidayProducts = [
  {
    // Poids => 2.8 kg - Prix déjà converti
    id: 15,
    image: "./images/main-images/image-1.jpg",
    title: "Poulet de Noël (finission aliment + lait) - 11.80 €, le kg",
    description: "Poulet de Noël de 2.8 kg",
    price: "33.04 €",
  },
  {
    // Poids => 2.2 kg - Prix déjà converti
    id: 16,
    image: "./images/main-images/image-3.jpg",
    title: 'Poularde "Cou nu" (finission aliment + lait) - 11.00 €, le kg',
    description: 'Poularde "Cou nu" de 2.2 kg.',
    price: "24.20 €",
  },
  {
    // Poids => 3.5 kg - Prix déjà converti
    id: 17,
    image: "./images/main-images/image-4.jpg",
    title: 'Chapon "roux" - 13.50 € le kg',
    description: "Chapon roux de 3.5 kg.",
    price: "47.25 €",
  },
  {
    // Poids => 5 kg - Prix déjà converti
    id: 18,
    image: "./images/main-images/image-1.jpg",
    title: 'Dinde "Bronzée d\'Amérique" ou "noir" - 12.40 € le kg',
    description: 'Dinde "Bronzée d\'Amérique" de 5 kg.',
    price: "62 €",
  },
  {
    // Poids => 2.2 kg - Prix déjà converti
    id: 19,
    image: "./images/main-images/image-2.jpg",
    title: "Canette de Barbarie - 9.80 € le kg",
    description: "Canette de Barbarie de 2.2 kg.",
    price: "21.56 €",
  },
];

const MainContent = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      {/* Section pour les spécialités */}
      <section>
        <div className="title-main-content">
          <h3>Les spécialités</h3>
        </div>
        <div className="product-grid">
          {specialtyProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onShowDetails={handleShowDetails}
            />
          ))}
        </div>
      </section>

      {/* Section pour volailles élevées en plein air */}
      <section>
        <div className="title-main-content-air">
          <h3>Volailles élevées en plein air</h3>
        </div>
        <div className="product-grid-air">
          {outdoorPoultryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onShowDetails={handleShowDetails}
            />
          ))}
        </div>
      </section>

      {/* Section pour les fêtes de fin d'année */}
      <section>
        <div className="title-main-content-holiday">
          <h3>Pour les fêtes de fin d'année</h3>
        </div>
        <div className="product-grid-holiday">
          {holidayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onShowDetails={handleShowDetails}
            />
          ))}
        </div>
      </section>

      {/* Modal pour afficher les détails du produit */}
      {selectedProduct && (
        <Modal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MainContent;
