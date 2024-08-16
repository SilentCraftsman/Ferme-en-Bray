"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "./cart/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import styles from "../styles/CartPage.module.scss";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    if (window.Stripe) {
      setStripeLoaded(true);
    } else {
      console.error("Stripe.js has not loaded.");
    }
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity);
  };

  const createPayment = async () => {
    if (!stripeLoaded) {
      setError("Stripe.js has not loaded.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/stripe/create-checkout-session",
        {
          items: cart.map((item) => ({
            title: item.title,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { id } = response.data;
      const stripe = window.Stripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );

      if (!stripe) {
        throw new Error("Stripe.js has not loaded.");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Erreur lors de la création de la commande.");
      console.error(err);
    }
  };

  return (
    <div className={styles.cartContainer}>
      {cart.length === 0 ? (
        <div className={styles.emptyCartMessage}>
          <FaShoppingCart size={50} />
          <p>Votre panier est vide.</p>
        </div>
      ) : (
        <>
          <h2>Mon Panier</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.uniqueId}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.productImage}
                />
                <div className={styles.productDetails}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className={styles.priceQuantity}>
                    <span>
                      {item.selectedVariant && (
                        <>
                          {item.selectedVariant.type} -{" "}
                          {item.selectedVariant.weight}
                        </>
                      )}
                    </span>
                    <div className={styles.priceInfo}>
                      <span>
                        Prix:{" "}
                        {item.selectedVariant
                          ? item.selectedVariant.price
                          : item.price}{" "}
                        €
                      </span>
                      <span>
                        Total pour cet article:{" "}
                        {(
                          parseFloat(
                            item.price.replace("€", "").replace(",", ".")
                          ) * item.quantity
                        ).toFixed(2)}{" "}
                        €
                      </span>
                    </div>
                  </div>
                  <div className={styles.quantityButtons}>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.uniqueId, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.uniqueId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.removeProduct}
                    onClick={() => handleQuantityChange(item.uniqueId, 0)}
                  >
                    Supprimer tout le produit
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h3 className={styles.total}>Total: {getTotal()} €</h3>
          <div>
            <button onClick={createPayment}>Payer avec Stripe</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
