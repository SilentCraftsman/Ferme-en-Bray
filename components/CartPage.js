"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "./cart/CartContext";
import { FaShoppingCart } from "react-icons/fa";
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
      console.log("Stripe.js is working !");
    } else {
      console.error("Stripe.js has not loaded.");
    }
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > MAX_QUANTITY) {
      setError(`La quantité maximale pour cet article est ${MAX_QUANTITY}.`);
      newQuantity = MAX_QUANTITY;
    } else if (newQuantity < 0) {
      setError("La quantité ne peut pas être négative.");
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
      console.log("Creating payment session...");

      const response = await fetch(
        "https://ferme-en-bray.vercel.app/api/stripe/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
          }),
        }
      );

      if (response.status === 405) {
        throw new Error(
          "Erreur HTTP 405: Méthode non autorisée. Vérifiez l'endpoint et les méthodes acceptées."
        );
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Checkout session created:", data);

      const { id } = data;
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
      console.error("Error in createPayment:", err);
      setError(`Erreur lors de la création du paiement: ${err.message}`);
    }
  };

  return (
    <div className={styles.cartPage}>
      {cart.length === 0 ? (
        <div className={styles.emptyCartMessage}>
          <FaShoppingCart size={50} />
          <p>Votre panier est vide.</p>
        </div>
      ) : (
        <div>
          <h1>Panier</h1>
          {cart.map((item) => (
            <div key={item.uniqueId} className={styles.cartItem}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.productImage}
              />
              <h2>{getUpdatedTitle(item)}</h2>
              <p>
                Quantité:
                <input
                  type="number"
                  min="0"
                  max={MAX_QUANTITY}
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.uniqueId,
                      parseInt(e.target.value)
                    )
                  }
                />
              </p>
              <p>Prix unitaire: {getUnitPrice(item)}€</p>
              <p>Total: {calculateTotalPrice(item)}€</p>
              <button onClick={() => handleQuantityChange(item.uniqueId, 0)}>
                Supprimer
              </button>
            </div>
          ))}
          <div className={styles.cartTotal}>
            <h3>Total: {getTotal()}€</h3>
          </div>
          <div className={styles.cartForm}>
            <h3>Informations de Livraison</h3>
            <label>
              Nom complet:
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </label>
            <label>
              Adresse:
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </label>
            <label>
              Jour de retrait:
              <select
                value={pickupDay}
                onChange={(e) => setPickupDay(e.target.value)}
              >
                <option value="vendredi">Vendredi</option>
                <option value="samedi">Samedi</option>
              </select>
            </label>
            <label>
              Heure de retrait:
              <select
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
            </label>
            {dateError && <div className={styles.error}>{dateError}</div>}
            {error && <div className={styles.error}>{error}</div>}
            <button onClick={createPayment}>Procéder au paiement</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
