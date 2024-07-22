// components/CartPage.js
"use client";

import React, { useContext } from "react";
import { CartContext } from "./cart/CartContext"; // Assurez-vous que le chemin est correct
import "../styles/CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Votre Panier</h1>
      <ul className="cart-items">
        {cart.map((item, index) => (
          <li key={index} className="cart-item">
            <img src={item.image} alt={item.title} />
            <div className="cart-item-info">
              <h4 className="cart-item-title">{item.title}</h4>
              <p className="cart-item-description">{item.description}</p>
              <p className="cart-item-price">{item.price}</p>
            </div>
            <button
              className="remove-button"
              onClick={() => removeFromCart(index)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartPage;
