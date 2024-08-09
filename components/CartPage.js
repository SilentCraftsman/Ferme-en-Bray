"use client";

import React, { useState } from "react";
import { useCart } from "./cart/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import styles from "../styles/CartPage.module.scss";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderAmount, setOrderAmount] = useState(null);

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

  const createOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/paypal/create-order",
        {
          items: cart.map((item) => ({
            title: item.title,
            price: parseFloat(
              item.selectedVariant
                ? item.selectedVariant.price.replace("€", "").replace(",", ".")
                : item.price.replace("€", "").replace(",", ".")
            ),
            quantity: item.quantity,
          })),
          currency: "EUR",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.orderID;
    } catch (err) {
      setError("Erreur lors de la création de la commande.");
      console.error(err);
      return null;
    }
  };

  const handleApprove = async (data) => {
    try {
      const { orderID } = data;
      const response = await axios.post(
        "http://localhost:3001/api/paypal/capture-payment",
        { orderID },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Paiement capturé avec succès :", response.data);
      setOrderAmount(getTotal());
      alert("Paiement réussi, merci pour votre achat !");
    } catch (err) {
      setError("Erreur lors de la capture du paiement.");
      console.error(err);
    }
  };

  const handleQuantityChange = (uniqueId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(uniqueId); // Supprime l'article du panier
    } else {
      updateQuantity(uniqueId, newQuantity); // Met à jour la quantité de l'article
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
                            item.selectedVariant
                              ? item.selectedVariant.price
                                  .replace("€", "")
                                  .replace(",", ".")
                              : item.price.replace("€", "").replace(",", ".")
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

          <button onClick={openModal} className={styles.checkoutButton}>
            Payer ma commande
          </button>

          {isModalOpen && (
            <div className={styles.modalOverlay} onClick={handleOverlayClick}>
              <div className={styles.modalContent}>
                <button onClick={closeModal} className={styles.closeButton}>
                  X
                </button>
                <PayPalScriptProvider
                  options={{
                    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                    currency: "EUR",
                  }}
                >
                  <PayPalButtons
                    style={{
                      layout: "vertical",
                    }}
                    createOrder={createOrder}
                    onApprove={handleApprove}
                    onError={(err) => {
                      setError("Erreur lors du paiement.");
                      console.error(err);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}
          {orderAmount && (
            <div className={styles.orderAmount}>
              Montant de la commande : {orderAmount} €
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
