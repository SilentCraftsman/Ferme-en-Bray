"use client";

import React from "react";
import "../styles/ProductCard.css";

const ProductCard = ({ product, onAddToCart, onShowDetails }) => {
  return (
    <div className="product-card" onClick={() => onShowDetails(product)}>
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p className="price">{product.price}</p>
      <button
        className="add-to-cart-button"
        onClick={(e) => {
          e.stopPropagation(); // Empêche le clic sur le bouton d'ouvrir la modale
          onAddToCart(product);
        }}
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;
