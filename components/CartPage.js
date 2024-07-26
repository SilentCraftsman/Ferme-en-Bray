"use client";

import React from "react";
import { useCart } from "./cart/CartContext";
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
      <h2>Mon Panier</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <img src={item.image} alt={item.title} />
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>
                Prix: {item.price} x
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity - 1)
                  }
                >
                  -
                </button>
                {item.quantity}
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </p>
              <button onClick={() => handleQuantityChange(item.id, 0)}>
                Supprimer tout le produit
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h3 className={styles.total}>Total: {getTotal()} €</h3>
    </div>
  );
};

export default CartPage;
