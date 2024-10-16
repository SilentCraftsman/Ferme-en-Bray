'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

const LOCAL_STORAGE_KEY = 'cart';
const CART_EXPIRATION_KEY = 'cart_expiration'; // Key for the expiration timestamp
const EXPIRATION_TIME = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
const ERROR_CART =
  'Une erreur est survenue lors la mise à jour du panier, si le problème persiste contactez nous via les coordonnées dans la page de contact.';

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
        const expirationTimestamp = Date.now() + EXPIRATION_TIME;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
        localStorage.setItem(CART_EXPIRATION_KEY, expirationTimestamp); // Save expiration timestamp

        if (notifyMsg && typeof notifyMsg === 'string') {
          toast.success(notifyMsg);
        }
      } else {
        console.error('Invalid cart data', cart);
        toast.error(ERROR_CART);
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
      toast.error(ERROR_CART);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const expirationTimestamp = localStorage.getItem(CART_EXPIRATION_KEY);
      if (!expirationTimestamp || Date.now() > parseInt(expirationTimestamp)) {
        // If the cart has expired, clear it
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(CART_EXPIRATION_KEY);
        console.log('Votre panier a expiré après 48 heures.');
        return [];
      }

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
          return [];
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
      return [];
    }
  };

  useEffect(() => {
    const loadedCart = loadCartFromLocalStorage();
    setCart(loadedCart);
  }, []);

  const addToCart = (product, quantity) => {
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
          console.warn('Cannot add more than 80 units of this product.');
          toast.warn("Impossible d'ajouter plus de 80 unités de ce produit.");
          return prevCart;
        }
        updatedCart = prevCart.map((item) =>
          item.uniqueId === uniqueId ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > 80) {
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
