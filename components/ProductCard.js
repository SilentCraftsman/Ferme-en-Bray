import React, { useState } from "react";
import "../styles/ProductCard.scss";

const ProductCard = ({ product, onAddToCart, onShowDetails }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : null
  );
  const [error, setError] = useState("");

  const handleAddToCart = () => {
    if (quantity <= 0) {
      setError("Impossible d’ajouter 0 quantité au panier.");
    } else {
      setError("");
      onAddToCart({ ...product, selectedVariant }, quantity);
    }
  };

  // Fonction pour gérer les changements dans le champ de saisie de la quantité
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Vérifie si la valeur est un nombre valide et non négatif
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue) && numberValue >= 1) {
      setQuantity(numberValue);
    } else if (value === "") {
      setQuantity(""); // Permet au champ de rester vide
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
        {selectedVariant && (
          <div className="overlay">
            <span className="plus-icon">+</span>
          </div>
        )}
      </div>
      <h4>{product.title}</h4>
      <p className="description-title">Description :</p>
      <p>{product.description}</p>
      <p className="price">
        Prix : {selectedVariant ? selectedVariant.price : product.price}
      </p>
      {product.variants && (
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
      )}
      <label>
        Quantité :
        <input
          type="number"
          value={quantity}
          min="1"
          onChange={handleQuantityChange}
        />
      </label>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleAddToCart}>Ajouter au panier</button>
      {onShowDetails && (
        <button onClick={() => onShowDetails(product)}>Voir les détails</button>
      )}
    </div>
  );
};

export default ProductCard;
