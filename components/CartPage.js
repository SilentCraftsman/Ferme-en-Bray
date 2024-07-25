"use client";

import React from "react";
import { useCart } from "./cart/CartContext";
import "../styles/CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  return (
    <div className="cart-container">
      <h2>Votre Panier</h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <img src={item.image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.price}</p>
                <button onClick={() => removeFromCart(item.id)}>Retirer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
