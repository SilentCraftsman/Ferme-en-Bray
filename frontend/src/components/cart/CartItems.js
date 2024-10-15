'use client';
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import styles from '../../styles/CartPage.module.scss';
import Image from 'next/image';

const CartItems = ({
  cart,
  handleQuantityChange,
  getUpdatedTitle,
  getUnitPrice,
  calculateTotalPrice,
  getTotal,
  setShowCustomerFormPage,
}) => {
  return (
    <>
      {cart.length === 0 ? (
        <div className={styles.emptyCartMessage}>
          <FaShoppingCart size={50} />
          <p>Votre panier est vide.</p>
        </div>
      ) : (
        <>
          <div className={styles.cartHeader}>
            <h2>Mon Panier</h2>
            <p>Vos produits seront à venir récupérer sur place.</p>
          </div>
          <div className={styles.cartItemContainer}>
            <ul>
              {cart.map((item) => (
                <li key={item.uniqueId}>
                  <Image
                    width={230}
                    height={166}
                    objectFit={'cover'}
                    loading="lazy"
                    src={item.image}
                    alt={item.title}
                    className={styles.productImage}
                  />
                  <div className={styles.productDetails}>
                    <div className={styles.productDetailsContent}>
                      <h3>{getUpdatedTitle(item)}</h3>{' '}
                      <span>Prix unitaire: {getUnitPrice(item)} €</span>
                    </div>
                    <div className={styles.productDetailsPrice}>
                      <div className={styles.priceInfo}>
                        <span>{calculateTotalPrice(item)} €</span>
                      </div>
                      <div className={styles.priceQuantity}>
                        {item.selectedVariant && (
                          <span>
                            {item.selectedVariant.type} -{' '}
                            {item.selectedVariant.weight}
                          </span>
                        )}
                        <div className={styles.quantityButtons}>
                          <button
                            className={styles.decrement}
                            onClick={() =>
                              handleQuantityChange(
                                item.uniqueId,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </button>
                          <span className="item-quantity">{item.quantity}</span>
                          <button
                            className={styles.increment}
                            onClick={() =>
                              handleQuantityChange(
                                item.uniqueId,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          className={styles.removeProduct}
                          onClick={() => handleQuantityChange(item.uniqueId, 0)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.cartTotalContainer}>
              <h3 className={styles.total}>Total: {getTotal()} €</h3>
              <button
                className={styles.proceedButton}
                onClick={() => setShowCustomerFormPage(true)}
              >
                Procéder à la commande
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CartItems;
