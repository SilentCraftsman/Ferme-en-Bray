// Ajoutez cette directive en haut du fichier pour indiquer que ce fichier est un composant côté client
"use client";

import React, { createContext, useState, useContext } from "react";

// Créez un contexte pour le panier
const CartContext = createContext();

// Créez un fournisseur pour le contexte
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const productInCart = prevCart.find((item) => item.id === product.id);

      if (productInCart) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotal = () => {
    return cart
      .reduce(
        (total, item) =>
          total +
          item.quantity *
            parseFloat(item.price.replace("€", "").replace(",", ".")),
        0
      )
      .toFixed(2);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook pour utiliser le contexte du panier
export const useCart = () => useContext(CartContext);
