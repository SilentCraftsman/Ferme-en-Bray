"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "./cart/CartContext";
import "../styles/Modal.scss";

const Modal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const modalRef = useRef(null);

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

  useEffect(() => {
    document.body.classList.add("modal-open");

    const adjustModalPosition = () => {
      if (modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect();
        const offset = (window.innerHeight - rect.height) / 2;
        window.scrollTo({
          top: rect.top + window.pageYOffset - offset,
          behavior: "smooth",
        });
      }
    };

    adjustModalPosition();

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  if (!product) {
    return null; // Pas de produit à afficher
  }

  return (
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
    </div>
  );
};

export default Modal;
