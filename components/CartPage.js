"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "./cart/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import styles from "../styles/CartPage.module.scss";

const MAX_QUANTITY = 80;

// Fonction pour valider l'email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const CartPage = () => {
  const { cart, updateQuantity, getTotal } = useCart();
  const [error, setError] = useState(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [pickupDay, setPickupDay] = useState("vendredi");
  const [pickupTime, setPickupTime] = useState("17:30");
  const [dateError, setDateError] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    if (window.Stripe) {
      setStripeLoaded(true);
    } else {
      console.error("Stripe.js has not loaded.");
    }
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > MAX_QUANTITY) {
      setError(`La quantité maximale pour cet article est ${MAX_QUANTITY}.`);
      newQuantity = MAX_QUANTITY;
    } else if (newQuantity <= 0) {
      newQuantity = 0; // Cela supprimera l'article si la quantité est 0
    } else {
      setError("");
    }
    updateQuantity(id, newQuantity);
  };

  const getUpdatedTitle = (item) => {
    if (item.selectedVariant) {
      return item.title.replace(/(\d+(\.\d+)?kg)/, item.selectedVariant.weight);
    }
    return item.title;
  };

  const calculateTotalPrice = (item) => {
    let unitPrice = 0;

    if (item.selectedVariant) {
      const pricePerUnit = parseFloat(
        item.selectedVariant.price.replace("€", "").replace(",", ".")
      );
      unitPrice = pricePerUnit;
    } else {
      unitPrice = parseFloat(item.price.replace("€", "").replace(",", "."));
    }

    return (unitPrice * item.quantity).toFixed(2);
  };

  const getUnitPrice = (item) => {
    let unitPrice = 0;

    if (item.selectedVariant) {
      unitPrice = parseFloat(
        item.selectedVariant.price.replace("€", "").replace(",", ".")
      );
    } else {
      unitPrice = parseFloat(item.price.replace("€", "").replace(",", "."));
    }

    return unitPrice.toFixed(2);
  };

  const validateDateTime = () => {
    const validDays = ["vendredi", "samedi"];
    const validHours = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00"];

    if (!validDays.includes(pickupDay)) {
      setDateError("La date doit être un vendredi ou un samedi.");
      return false;
    }

    if (!validHours.includes(pickupTime)) {
      setDateError("L'heure doit être entre 17h30 et 20h00.");
      return false;
    }

    setDateError("");
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    let errorMessage = "";

    switch (true) {
      case !customerName:
        errorMessage = "Veuillez entrer un nom complet.";
        isValid = false;
        break;
      case !customerAddress:
        errorMessage = "Veuillez entrer une adresse.";
        isValid = false;
        break;
      case !customerEmail:
        errorMessage = "Veuillez entrer une adresse email.";
        isValid = false;
        break;
      case !validateEmail(customerEmail):
        errorMessage = "Veuillez entrer une adresse email valide.";
        isValid = false;
        break;
      case !validateDateTime():
        isValid = false;
        break;
      default:
        errorMessage = "";
        break;
    }

    setError(errorMessage);
    return isValid;
  };

  const createPayment = async () => {
    if (!stripeLoaded) {
      setError("Stripe.js has not loaded.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "https://site-de-volaille-0f64d822f48c.herokuapp.com/api/stripe/create-checkout-session",
        {
          items: cart.map((item) => ({
            title: getUpdatedTitle(item),
            image: item.image,
            price: getUnitPrice(item),
            quantity: item.quantity,
            selectedVariant: item.selectedVariant,
          })),
          pickupDay,
          pickupTime,
          customerName,
          customerEmail,
          customerAddress,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Checkout session created:", response.data);

      const { id } = response.data;
      const stripe = window.Stripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      console.log(
        "Stripe API Key:",
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
      console.error("Error in createPayment:", err);
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
                  <h3>{getUpdatedTitle(item)}</h3>
                  <p>{item.description || "Description non disponible"}</p>
                  <div className={styles.priceQuantity}>
                    {item.selectedVariant && (
                      <span>
                        {item.selectedVariant.type} -{" "}
                        {item.selectedVariant.weight}
                      </span>
                    )}
                    <div className={styles.priceInfo}>
                      <span>Prix unitaire: {getUnitPrice(item)} €</span>
                      <span>
                        Total pour cet article: {calculateTotalPrice(item)} €
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
          <div className={styles.datePickerContainer}>
            <h3 className={styles.underlineTitle}>
              Précisez le jour et l'heure de retrait :
            </h3>
            <select
              className={styles.dateSelect}
              value={pickupDay}
              onChange={(e) => setPickupDay(e.target.value)}
            >
              <option value="vendredi">Vendredi</option>
              <option value="samedi">Samedi</option>
            </select>
            <select
              className={styles.dateSelect}
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            >
              <option value="17:30">17:30</option>
              <option value="18:00">18:00</option>
              <option value="18:30">18:30</option>
              <option value="19:00">19:00</option>
              <option value="19:30">19:30</option>
              <option value="20:00">20:00</option>
            </select>
            {dateError && (
              <div className={styles.errorMessage}>{dateError}</div>
            )}
          </div>
          <div className={styles.customerInfo}>
            <h3>Renseignements nécessaires pour la commande :</h3>
            <input
              type="text"
              placeholder="Nom complet"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Adresse"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
            <input
              type="email"
              placeholder="Adresse email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            {error && (
              <div
                className={styles.errorMessage}
                style={{ marginTop: "1rem" }}
              >
                {error}
              </div>
            )}
          </div>
          <button className={styles.paymentButton} onClick={createPayment}>
            Procéder au paiement
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
