"use client";

import React, { useState } from "react";
import "../styles/Modal.css";
import { useCart } from "./cart/CartContext";

const Modal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <img src={product.image} alt={product.title} />
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <p className="price">Prix : {product.price}</p>
        <div className="quantity-selector">
          <label htmlFor="quantity">Quantité :</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

export default Modal;
