// components/ProductCard.js
"use client";

import React, { useContext } from "react";
import { CartContext } from "./cart/CartContext"; // Assurez-vous que le chemin est correct
import "../styles/ProductCard.css";

const ProductCard = ({ image, title, description, price, onAddToCart }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-container">
      <img src={image} alt={title} />
      <h4>{title}</h4>
      <p>{description}</p>
      <p>{price}</p>
      <button
        onClick={() => {
          addToCart({ image, title, description, price });
          onAddToCart();
        }}
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;
