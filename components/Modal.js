"use client";

import React, { useState } from "react";
import { useCart } from "./cart/CartContext";
import "../styles/Modal.css";

const Modal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log(
      "Ajout du produit à partir de la modale:",
      product,
      "Quantité:",
      quantity
    );
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{product.title}</h2>
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
        <button onClick={handleAddToCart}>Ajouter au panier</button>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default Modal;
