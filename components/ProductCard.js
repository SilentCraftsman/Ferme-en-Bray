// components/ProductCard.js

"use client";

import React from "react";
import { useCart } from "./cart/CartContext";
import "../styles/ProductCard.css";

const ProductCard = ({ product, onAddToCart, onShowDetails }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log("Ajout du produit au panier:", product);
    addToCart(product, 1); // Ajouter une quantité de 1
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h4>{product.title}</h4>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <button onClick={handleAddToCart}>Ajouter au panier</button>
      <button onClick={() => onShowDetails(product)}>Détails</button>
    </div>
  );
};

export default ProductCard;
