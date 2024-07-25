"use client";

import React from "react";
import { useCart } from "./cart/CartContext";
import styles from "../styles/CartPage.module.css";

const CartPage = () => {
  const { cart, removeFromCart, getTotal } = useCart();

  return (
    <div className={styles["cart-container"]}>
      {" "}
      {/* Correction ici */}
      <h2>Mon Panier</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <img src={item.image} alt={item.title} />
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>
                Prix: {item.price} x {item.quantity}
              </p>
            </div>
            <button onClick={() => removeFromCart(item.id)}>Retirer</button>
          </li>
        ))}
      </ul>
      <h3 className={styles.total}>Total: {getTotal()} €</h3>
    </div>
  );
};

export default CartPage;
