'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

const LOCAL_STORAGE_KEY = 'cart';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const saveCartToLocalStorage = (cart, notifyMsg = null) => {
    try {
      if (
        Array.isArray(cart) &&
        cart.every(
          (item) =>
            typeof item === 'object' &&
            item.id &&
            item.quantity >= 0 &&
            (!item.selectedVariant || item.selectedVariant.variantId)
        )
      ) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
        if (notifyMsg && typeof notifyMsg === 'string') {
          toast.success(notifyMsg);
        }
      } else {
        console.error('Invalid cart data', cart);
        toast.error('Données du panier invalides.');
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
      toast.error("Échec de l'enregistrement du panier.");
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (
          Array.isArray(parsedCart) &&
          parsedCart.every(
            (item) =>
              typeof item === 'object' &&
              item.id &&
              item.quantity >= 0 &&
              (!item.selectedVariant || item.selectedVariant.variantId)
          )
        ) {
          return parsedCart;
        } else {
          console.error('Invalid cart data in localStorage', parsedCart);
          toast.warn('Données du panier invalides dans le stockage local.');
          return [];
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
      toast.error('Échec du chargement du panier depuis le stockage local.');
      return [];
    }
  };

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      if (
        !Array.isArray(parsedCart) ||
        !parsedCart.every(
          (item) =>
            typeof item === 'object' &&
            item.id &&
            item.quantity >= 0 &&
            (!item.selectedVariant || item.selectedVariant.variantId)
        )
      ) {
        console.error('Invalid cart data detected, clearing localStorage');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        toast.warn('Données du panier invalides, réinitialisation du panier.');
      }
    } catch (error) {
      console.error('Failed to parse cart data from localStorage', error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast.error("Erreur lors de l'analyse des données du panier.");
    }
  }, []);

  useEffect(() => {
    const loadedCart = loadCartFromLocalStorage();
    setCart(loadedCart);
  }, []);

  const addToCart = (product, quantity) => {
    // Generate a uniqueId based on whether the product has a selected variant
    const uniqueId = product.selectedVariant
      ? `${product.id}-${product.selectedVariant.variantId}`
      : product.id;

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.uniqueId === uniqueId
      );

      let updatedCart;

      if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;
        if (newQuantity > 80) {
          // If adding this quantity exceeds the limit, show an error or handle it as needed
          console.warn('Cannot add more than 80 units of this product.');
          toast.warn("Impossible d'ajouter plus de 80 unités de ce produit.");
          return prevCart;
        }
        updatedCart = prevCart.map((item) =>
          item.uniqueId === uniqueId ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > 80) {
          // If the initial quantity exceeds the limit, show an error or handle it as needed
          console.warn('Cannot add more than 80 units of this product.');
          toast.warn("Impossible d'ajouter plus de 80 unités de ce produit.");
          return prevCart;
        }
        updatedCart = [
          ...prevCart,
          {
            ...product,
            quantity,
            uniqueId,
            selectedVariant: product.selectedVariant,
          },
        ];
      }

      saveCartToLocalStorage(updatedCart, 'Produit ajouté au panier.');
      return updatedCart;
    });
  };

  const removeFromCart = (uniqueId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.uniqueId !== uniqueId);
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (uniqueId, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.uniqueId === uniqueId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0);
      saveCartToLocalStorage(updatedCart);
      return updatedCart;
    });
  };

  const getTotal = () => {
    return cart
      .reduce(
        (acc, item) =>
          acc +
          parseFloat(
            item.selectedVariant
              ? item.selectedVariant.price.replace('€', '').replace(',', '.')
              : item.price.replace('€', '').replace(',', '.')
          ) *
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
