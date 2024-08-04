// Modal.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useCart } from "./cart/CartContext";
import "../styles/Modal.scss";

const Modal = ({ show, onClose, product }) => {
  const modalRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  // Fermer la modale en appuyant sur la touche "Échap"
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button className="modal-close-button" onClick={onClose}>
          ×
        </button>
        <h2>{product.title}</h2>
        <img src={product.image} alt={product.title} className="modal-image" />
        <p className="description-title">Ingrédient :</p>
        <p>{product.description}</p>
        <p>
          <strong>Prix :</strong> {product.price}
        </p>
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
    </div>,
    document.body
  );
};

export default Modal;
