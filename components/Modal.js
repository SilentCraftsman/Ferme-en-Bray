"use client";

import React, { useState } from "react";
import { useCart } from "./cart/CartContext";
import "../styles/Modal.scss";

const Modal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log(
      "Ajout du produit à partir de la modale:",
      product,
      "Quantité:",
      quantity
    ); // Ajout du log
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{product.title}</h2>
        <img src={product.image} alt={product.title} className="modal-image" />
        <p>{product.description}</p>
        <p>{product.price}</p>
        <label>
          Quantité:
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          />
        </label>
        <div className="modal-buttons">
          <button onClick={handleAddToCart}>Ajouter au panier</button>
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
