import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useCart } from './cart/CartContext.js';
import '@/styles/Modal.scss';

const MAX_QUANTITY = 80;

const Modal = ({ show, onClose, product }) => {
  const modalRef = useRef(null);
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
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!show) return null;

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

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="modal-content-image">
          <div
            className={`modal-image-wrapper ${isZoomed ? 'zoomed' : ''}`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={sanitizedImage}
              alt={sanitizedTitle}
              className="modal-image"
            />
          </div>
        </div>
        <div className="modal-content-info">
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
          <h2>{sanitizedTitle}</h2>
          <div className="modal-content-info-text">
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
            Quantité:
            <input
              type="number"
              value={quantity}
              min="1"
              max={MAX_QUANTITY}
              onChange={handleQuantityChange}
            />
          </label>
          {error && <p className="error-message">{error}</p>}

          <div className="modal-buttons">
            <button onClick={handleAddToCart}>Ajouter au panier</button>
            <button onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
    ingredients: PropTypes.string,
  }).isRequired,
};

export default Modal;
