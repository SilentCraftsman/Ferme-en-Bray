"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
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

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10);

    // Validate quantity
    if (value === "" || parsedValue > 0) {
      setQuantity(parsedValue || "");
      if (parsedValue <= 0) {
        setError("Impossible d’ajouter 0 quantité au panier.");
      } else {
        setError("");
      }
    } else {
      setError("Quantité invalide.");
    }
  };

  // Sanitize and validate product data
  const sanitizedTitle = product.title || "Produit";
  const sanitizedImage = product.image || "/default-image.jpg";
  const sanitizedIngredients =
    product.ingredients || "Aucun ingrédient spécifié.";

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
        <h2>{sanitizedTitle}</h2>
        <img
          src={sanitizedImage}
          alt={sanitizedTitle}
          className="modal-image"
        />
        <p className="description-title">Description :</p>
        <p>{sanitizedIngredients}</p>

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

// Validation des props avec PropTypes
Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    title: PropTypes.string,
    image: PropTypes.string,
    ingredients: PropTypes.string,
    price: PropTypes.string.isRequired,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        variantId: PropTypes.string,
        type: PropTypes.string.isRequired,
        weight: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default Modal;
