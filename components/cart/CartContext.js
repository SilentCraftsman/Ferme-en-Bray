"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Récupère le panier depuis localStorage au chargement
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    // Sauvegarde le panier dans localStorage chaque fois qu'il change
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
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

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) =>
        total + parseFloat(item.price.replace(" €", "")) * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
