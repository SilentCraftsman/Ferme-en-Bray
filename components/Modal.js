"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useCart } from "./cart/CartContext";
import "../styles/Modal.scss";

const Modal = ({ show, onClose, product }) => {
  const modalRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : null
  );
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity <= 0) {
      setError("Impossible d’ajouter 0 quantité au panier.");
    } else {
      setError("");
      addToCart({ ...product, selectedVariant }, quantity);
      onClose();
    }
  };

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

  // Function to handle quantity change
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10);

    // Update quantity only if it is a valid number and >= 1
    if (value === "" || parsedValue > 0) {
      setQuantity(parsedValue || "");
      if (parsedValue <= 0) {
        setError("Impossible d’ajouter 0 quantité au panier.");
      } else {
        setError("");
      }
    }
  };

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

        <p className="description-title">Description :</p>
        <p>{product.ingredients}</p>

        {product.variants && (
          <div>
            <label>
              Type :
              <select
                value={selectedVariant ? selectedVariant.type : ""}
                onChange={(e) =>
                  setSelectedVariant(
                    product.variants.find((v) => v.type === e.target.value)
                  )
                }
              >
                {product.variants.map((variant) => (
                  <option key={variant.variantId} value={variant.type}>
                    {variant.type} - {variant.weight}
                  </option>
                ))}
              </select>
            </label>

            <p>
              <strong>Prix :</strong>{" "}
              {selectedVariant ? selectedVariant.price : product.price}
            </p>
          </div>
        )}

        <label>
          Quantité:
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={handleQuantityChange}
          />
        </label>
        {error && <p className="error-message">{error}</p>}

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
