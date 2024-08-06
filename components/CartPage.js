"use client";

import React from "react";
import { useCart } from "./cart/CartContext";
import { FaShoppingCart } from "react-icons/fa"; // Importer l'icône de panier
import styles from "../styles/CartPage.module.scss";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  const handleQuantityChange = (uniqueId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(uniqueId);
    } else {
      updateQuantity(uniqueId, quantity);
    }
  };

  return (
    <div className={styles.cartContainer}>
      {cart.length === 0 ? (
        <div className={styles.emptyCartMessage}>
          <FaShoppingCart size={50} />
          <p>Votre panier est vide.</p>
        </div>
      ) : (
        <>
          <h2>Mon Panier</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.uniqueId}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className={styles.priceQuantity}>
                    <span>
                      {item.selectedVariant && (
                        <>
                          {item.selectedVariant.type} -{" "}
                          {item.selectedVariant.weight}
                        </>
                      )}
                    </span>
                    <div className={styles.priceInfo}>
                      <span>
                        Prix:{" "}
                        {item.selectedVariant
                          ? item.selectedVariant.price
                          : item.price}{" "}
                        €
                      </span>
                      <span>
                        Total pour cet article:{" "}
                        {(
                          parseFloat(
                            item.selectedVariant
                              ? item.selectedVariant.price
                                  .replace("€", "")
                                  .replace(",", ".")
                              : item.price.replace("€", "").replace(",", ".")
                          ) * item.quantity
                        ).toFixed(2)}{" "}
                        €
                      </span>
                    </div>
                  </div>
                  <div className={styles.quantityButtons}>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.uniqueId, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.uniqueId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.removeProduct}
                    onClick={() => handleQuantityChange(item.uniqueId, 0)}
                  >
                    Supprimer tout le produit
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h3 className={styles.total}>Total: {getTotal()} €</h3>
        </>
      )}
    </div>
  );
};

export default CartPage;
