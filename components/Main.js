// components/Main.js

"use client";

import React, { useState } from "react";
import ProductCard from "./ProductCard";
import Modal from "./Modal";
import { useCart } from "./cart/CartContext";
import "../styles/MainContent.css";

const products = [
  {
    id: 1,
    image: "./images/main-images/image-1.jpg",
    title: "Poulet Fermier",
    description: "Un poulet fermier élevé en plein air, tendre et savoureux.",
    price: "10 €",
  },
  {
    id: 2,
    image: "./images/main-images/image-2.jpg",
    title: "Dinde Bio",
    description:
      "Dinde biologique nourrie avec des aliments naturels, parfaite pour les repas de fête.",
    price: "20 €",
  },
  {
    id: 3,
    image: "./images/main-images/image-3.jpg",
    title: "Canard Confit",
    description: "Canard confit préparé selon la tradition, riche en saveurs.",
    price: "20 €",
  },
  {
    id: 4,
    image: "./images/main-images/image-4.jpg",
    title: "Oie Rôtie",
    description:
      "Oie rôtie à la perfection, idéale pour les grandes occasions.",
    price: "50 €",
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
    <section>
      <div className="title-main-content">
        <h3>Voici nos différents produits :</h3>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onShowDetails={handleShowDetails}
          />
        ))}
      </div>

      {selectedProduct && (
        <Modal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default MainContent;
