"use client";

import React, { createContext, useState } from "react";

// Créer le contexte
export const CartContext = createContext();

// Créer le provider pour gérer l'état du panier
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, cartCount: cart.length }}
    >
      {children}
    </CartContext.Provider>
  );
};
