'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/components/cart/CartContext.js';
import '@/styles/Product.scss';

const MAX_QUANTITY = 80;

const Product = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : null
  );
  const [error, setError] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const { addToCart, cart } = useCart();

  const handleAddToCart = () => {
    const existingCartItem = cart.find(
      (item) => item.uniqueId === product.uniqueId
    );
    const totalQuantity = existingCartItem
      ? existingCartItem.quantity + quantity
      : quantity;

    if (totalQuantity > MAX_QUANTITY) {
      setError(`La quantité maximale pour cet article est ${MAX_QUANTITY}.`);
    } else if (quantity <= 0) {
      setError('Impossible d’ajouter 0 quantité au panier.');
    } else {
      setError('');
      addToCart({ ...product, selectedVariant }, quantity);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10);

    if (value === '' || parsedValue > 0) {
      if (parsedValue > MAX_QUANTITY) {
        setQuantity(MAX_QUANTITY);
        setError(`La quantité maximale pour cet article est ${MAX_QUANTITY}.`);
      } else {
        setQuantity(parsedValue || '');
        setError('');
      }
    } else {
      setError('Quantité invalide.');
    }
  };

  const sanitizedTitle = product.title || 'Produit';
  const sanitizedImage = product.image || '/default-image.jpg';
  const sanitizedIngredients =
    product.ingredients || 'Aucun ingrédient spécifié.';

  return (
    <div className="product-overlay">
      <div className="product-content" onClick={(e) => e.stopPropagation()}>
        <div className="product-content-image">
          <div
            className={`product-image-wrapper ${isZoomed ? 'zoomed' : ''}`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              loading="lazy"
              src={sanitizedImage}
              alt={`Image de ${sanitizedTitle}`}
              className="product-image"
            />
          </div>
        </div>
        <div className="product-content-info">
          <h2>{sanitizedTitle}</h2>
          <div className="product-content-info-text">
            <p className="product-description">{product.description}</p>
            <p className="description-title">Ingrédients :</p>
            <p className="description-ingredients">{sanitizedIngredients}</p>
          </div>

          {product.variants && (
            <div>
              <label>
                Type :
                <select
                  value={selectedVariant ? selectedVariant.type : ''}
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
                <strong>Prix :</strong>{' '}
                {selectedVariant ? selectedVariant.price : product.price}
              </p>
            </div>
          )}

          <label>
            Quantité :
            <input
              type="number"
              value={quantity}
              min="1"
              max={MAX_QUANTITY}
              onChange={handleQuantityChange}
            />
          </label>
          {error && <p className="error-message">{error}</p>}

          <div className="product-buttons">
            <button onClick={handleAddToCart}>Ajouter au panier</button>
          </div>

          {product.preparationTips && (
            <div className="product-preparation-tips">
              <h3>Conseils de préparation :</h3>
              <p>{product.preparationTips}</p>
            </div>
          )}

          {product.nutritionalInfo && (
            <div className="product-nutritional-info">
              <h3>Informations nutritionnelles :</h3>
              <p>{product.nutritionalInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
