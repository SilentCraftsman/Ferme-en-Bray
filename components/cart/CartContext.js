"use client";

import React, { createContext, useState, useContext } from "react";

// Création du contexte
const CartContext = createContext();

// Génère un identifiant unique pour chaque produit dans le panier
const generateUniqueId = () => Math.random().toString(36).substring(2, 9);

// Fournisseur du contexte
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity = 1) => {
    console.log("Avant ajout au panier:", cart);

    setCart((prevCart) => {
      // Trouver si le produit existe déjà dans le panier
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      let updatedCart;

      if (existingProductIndex !== -1) {
        // Si le produit existe, mettre à jour la quantité
        updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + quantity,
        };
      } else {
        // Ajouter le nouveau produit avec la quantité spécifiée
        const productWithId = {
          ...product,
          cartId: generateUniqueId(),
          quantity,
        };
        updatedCart = [...prevCart, productWithId];
      }

      console.log("Après ajout au panier:", updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prevCart) =>
      prevCart.filter((product) => product.cartId !== cartId)
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
