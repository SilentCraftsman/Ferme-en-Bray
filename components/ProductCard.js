"use client";

import React from "react";
import { useCart } from "./cart/CartContext";
import "../styles/ProductCard.scss";
import { FaPlusCircle } from "react-icons/fa";

const ProductCard = ({ product, onShowDetails }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log("Ajout du produit au panier:", product);
    addToCart(product, 1); // Ajouter une quantité de 1
  };

  return (
    <div className="product-card">
      <div
        className="product-image-container"
        onClick={() => onShowDetails(product)}
      >
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
        <div className="overlay">
          <FaPlusCircle className="plus-icon" />
        </div>
      </div>
      <h4>{product.title}</h4>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <button onClick={handleAddToCart}>Ajouter au panier</button>
    </div>
  );
};

export default ProductCard;
