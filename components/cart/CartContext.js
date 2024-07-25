"use client";

import React, { createContext, useState, useContext } from "react";

// Création du contexte
const CartContext = createContext();

// Fournisseur du contexte
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((product) => product.id !== productId)
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCart = () => useContext(CartContext);
