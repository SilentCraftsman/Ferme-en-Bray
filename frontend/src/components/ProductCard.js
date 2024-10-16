import React, { useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import '@/styles/ProductCard.scss';
import { useCart } from './cart/CartContext.js';
import Link from 'next/link'; // Assurez-vous d'importer useCart

const MAX_QUANTITY = 80;

const ProductCard = ({ product, onShowDetails }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants[0] : null
  );
  const [error, setError] = useState('');
  const { cart, addToCart } = useCart(); // Utilisez le hook useCart

  const handleAddToCart = () => {
    const existingCartItem = cart.find(
      (item) => item.uniqueId === product.uniqueId
    );
    const totalQuantity = existingCartItem
      ? existingCartItem.quantity + quantity
      : quantity;

    if (quantity <= 0) {
      setError('Impossible d’ajouter 0 quantité au panier.');
    } else if (totalQuantity > MAX_QUANTITY) {
      setError(`La quantité maximale pour cet article est ${MAX_QUANTITY}.`);
    } else {
      setError('');
      addToCart({ ...product, selectedVariant }, quantity);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    const numberValue = parseInt(value, 10);

    if (
      !isNaN(numberValue) &&
      numberValue >= 1 &&
      numberValue <= MAX_QUANTITY
    ) {
      setQuantity(numberValue);
      setError(''); // Clear error message if quantity is valid
    } else if (numberValue > MAX_QUANTITY) {
      setQuantity(MAX_QUANTITY);
      setError(`La quantité maximale pour cet article est ${MAX_QUANTITY}.`);
    } else if (value === '') {
      setQuantity(''); // Permet au champ de rester vide
      setError('');
    } else {
      setError('Quantité invalide.');
    }
  };

  const titleSplit = product.title.split('-');

  return (
    <div className="product-card-wrapper">
      <div className="product-card">
        <div
          className="product-image-container"
          onClick={() => onShowDetails(product)}
        >
          <Image
            fill
            src={product.image}
            alt={product.title || 'Image du produit'}
            className="product-image"
            priority
            sizes={'245px'}
          />
          {/*{selectedVariant && (*/}
          {/*  <div className="overlay">*/}
          {/*    <span className="plus-icon">+</span>*/}
          {/*  </div>*/}
          {/*)}*/}
        </div>
        <div className="card-header">
          {titleSplit.map((title, index) => (
            <h4 key={index}>{title}</h4>
          ))}
          <p className="price">
            {selectedVariant ? selectedVariant.price : product.price}
          </p>
        </div>
        {/* <div className="card-info">
      <p className="description-title">Description :</p>
      <p>{product.description}</p>
      </div> */}
        {/* {product.variants && (
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
      </label> */}
        <div className="card-action">
          {error && <p className="error-message">{error}</p>}
          <div className="button-info-container">
            <button className="button-market" onClick={handleAddToCart}>
              Ajouter au panier
            </button>
          </div>

          {onShowDetails && (
            <div className="button-info-container">
              <button
                className="button-info"
                onClick={(event) => {
                  onShowDetails(product);
                }}
              >
                <Link
                  passHref
                  href={`/produits/${product.subroute}`} // important for seo
                  onClick={(event) => {
                    event.preventDefault(); // to open modal instead of following the href
                  }}
                >
                  Voir les détails
                </Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        variantId: PropTypes.string,
        type: PropTypes.string.isRequired,
        weight: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onShowDetails: PropTypes.func,
};

export default ProductCard;
