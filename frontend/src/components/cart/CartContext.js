'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

const LOCAL_STORAGE_KEY = 'cart';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const saveCartToLocalStorage = (cart) => {
    try {
      if (
        Array.isArray(cart) &&
        cart.every(
          (item) =>
            typeof item === 'object' &&
            item.id &&
            item.quantity >= 0 &&
            (!item.selectedVariant || item.selectedVariant.variantId) // variantId only if there's a selectedVariant
        )
      ) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
      } else {
        console.error('Invalid cart data', cart);
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
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
              (!item.selectedVariant || item.selectedVariant.variantId) // variantId only if there's a selectedVariant
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
            (!item.selectedVariant || item.selectedVariant.variantId) // variantId only if there's a selectedVariant
        )
      ) {
        console.error('Invalid cart data detected, clearing localStorage');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to parse cart data from localStorage', error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
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
          return prevCart; // Return the cart unchanged
        }
        updatedCart = prevCart.map((item) =>
          item.uniqueId === uniqueId ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > 80) {
          // If the initial quantity exceeds the limit, show an error or handle it as needed
          console.warn('Cannot add more than 80 units of this product.');
          return prevCart; // Return the cart unchanged
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

      saveCartToLocalStorage(updatedCart);
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
