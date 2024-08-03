"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

const LOCAL_STORAGE_KEY = "cart";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fonction pour sauvegarder le panier dans le localStorage
  const saveCartToLocalStorage = (cart) => {
    try {
      // Validation des données du panier avant sauvegarde
      if (
        Array.isArray(cart) &&
        cart.every(
          (item) => typeof item === "object" && item.id && item.quantity >= 0
        )
      ) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
      } else {
        console.error("Invalid cart data", cart);
      }
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  };

  // Fonction pour charger le panier depuis le localStorage
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (
          Array.isArray(parsedCart) &&
          parsedCart.every(
            (item) => typeof item === "object" && item.id && item.quantity >= 0
          )
        ) {
          return parsedCart;
        } else {
          console.error("Invalid cart data in localStorage", parsedCart);
          return [];
        }
      }
      return [];
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      return [];
    }
  };

  // Nettoyage du localStorage s'il contient des données invalides
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      if (
        !Array.isArray(parsedCart) ||
        !parsedCart.every(
          (item) => typeof item === "object" && item.id && item.quantity >= 0
        )
      ) {
        console.error("Invalid cart data detected, clearing localStorage");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to parse cart data from localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  // Charger le panier depuis le localStorage lors du chargement du composant
  useEffect(() => {
    const loadedCart = loadCartFromLocalStorage();
    setCart(loadedCart);
  }, []);

  // Met à jour le panier dans l'état et le localStorage
  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      let updatedCart;
      if (existingProduct) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity }];
      }
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  // Supprime un produit du panier et met à jour le localStorage
  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  // Met à jour la quantité d'un produit et supprime le produit si la quantité <= 0
  const updateQuantity = (id, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0); // Supprimer les produits avec quantité <= 0
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const getTotal = () => {
    return cart
      .reduce(
        (acc, item) =>
          acc +
          parseFloat(item.price.replace("€", "").replace(",", ".")) *
            item.quantity,
        0
      )
      .toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, getTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
