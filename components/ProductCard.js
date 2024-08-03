import React, { useState } from "react";
import "../styles/ProductCard.scss";

const ProductCard = ({ product, onAddToCart, onShowDetails }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : null
  );

  const handleAddToCart = () => {
    // Passe le produit avec la variante sélectionnée
    onAddToCart({ ...product, selectedVariant }, quantity);
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
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
        />
      </label>
      <button onClick={handleAddToCart}>Ajouter au panier</button>
      {onShowDetails && (
        <button onClick={() => onShowDetails(product)}>Voir les détails</button>
      )}
    </div>
  );
};

export default ProductCard;
