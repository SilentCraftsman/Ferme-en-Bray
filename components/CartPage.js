"use client";

import React from "react";
import { useCart } from "./cart/CartContext";
import { FaShoppingCart } from "react-icons/fa"; // Importer l'icône de panier
import styles from "../styles/CartPage.module.css";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();

  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, quantity);
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
              <li key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className={styles.productDetails}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className={styles.priceQuantity}>
                    <span>Prix: {item.price}</span>
                    <div className={styles.quantityButtons}>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className={styles.removeProduct}
                    onClick={() => handleQuantityChange(item.id, 0)}
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
