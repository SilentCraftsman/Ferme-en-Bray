'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from './cart/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import styles from '../styles/CartPage.module.scss';
import { createCheckoutSession } from '@/services/api.service.js';

const MAX_QUANTITY = 80;

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const CartPage = () => {
  const { cart, updateQuantity, getTotal } = useCart();
  const [error, setError] = useState(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [pickupDay, setPickupDay] = useState('vendredi');
  const [pickupTime, setPickupTime] = useState('17:30');
  const [dateError, setDateError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  useEffect(() => {
    if (window.Stripe) {
      setStripeLoaded(true);
    } else {
      console.error('Stripe.js has not loaded.');
    }
  }, []);

  useEffect(() => {
    const emailValid = validateEmail(customerEmail);
    setIsEmailValid(emailValid);
    setAllFieldsFilled(
      customerName.trim() !== '' &&
        emailValid &&
        customerAddress.trim() !== '' &&
        validateDateTime()
    );
  }, [customerName, customerEmail, customerAddress, pickupDay, pickupTime]);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > MAX_QUANTITY) {
      setError(`La quantité maximale pour cet article est ${MAX_QUANTITY}.`);
      newQuantity = MAX_QUANTITY;
    } else if (newQuantity <= 0) {
      newQuantity = 0; // Cela supprimera l'article si la quantité est 0
    } else {
      setError('');
    }
    updateQuantity(id, newQuantity);
  };

  const getUpdatedTitle = (item) => {
    if (item.selectedVariant) {
      // Met à jour le titre du produit en fonction de la variante sélectionnée
      return item.title.replace(/(\d+(\.\d+)?kg)/, item.selectedVariant.weight);
    }
    return item.title;
  };

  const calculateTotalPrice = (item) => {
    let unitPrice = 0;

    if (item.selectedVariant) {
      // Produit avec variantes
      const pricePerUnit = parseFloat(
        item.selectedVariant.price.replace('€', '').replace(',', '.')
      );
      unitPrice = pricePerUnit;
    } else {
      // Produit sans variantes
      unitPrice = parseFloat(item.price.replace('€', '').replace(',', '.'));
    }

    return (unitPrice * item.quantity).toFixed(2);
  };

  const getUnitPrice = (item) => {
    let unitPrice = 0;

    if (item.selectedVariant) {
      // Produit avec variantes
      unitPrice = parseFloat(
        item.selectedVariant.price.replace('€', '').replace(',', '.')
      );
    } else {
      // Produit sans variantes
      unitPrice = parseFloat(item.price.replace('€', '').replace(',', '.'));
    }

    return unitPrice.toFixed(2);
  };

  const validateDateTime = () => {
    const validDays = ['vendredi', 'samedi'];
    const validHours = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];
    if (!validDays.includes(pickupDay)) {
      setDateError('La date doit être un vendredi ou un samedi.');
      return false;
    }
    if (!validHours.includes(pickupTime)) {
      setDateError("L'heure doit être entre 17h30 et 20h00.");
      return false;
    }
    setDateError('');
    return true;
  };

  const createPayment = async () => {
    if (!stripeLoaded) {
      setError('Stripe.js has not loaded.');
      return;
    }
    if (!validateDateTime()) {
      return;
    }
    if (!validateEmail(customerEmail)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    if (!allFieldsFilled) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    try {
      const data = await createCheckoutSession(
        cart,
        pickupDay,
        pickupTime,
        customerEmail,
        customerName,
        customerAddress,
        getTotal
      );
      const { id } = data;
      const stripe = window.Stripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      if (!stripe) {
        throw new Error('Stripe.js has not loaded.');
      }
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Erreur lors de la création de la commande.');
      console.error('Error in createPayment:', err);
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
          <div className={styles.cartItemContainer}>
            <ul>
              {cart.map((item) => (
                <li key={item.uniqueId}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.productImage}
                  />
                  <div className={styles.productDetails}>
                    <div className={styles.productDetailsContent}>
                      <h3>{getUpdatedTitle(item)}</h3>{' '}
                      <span>Prix unitaire: {getUnitPrice(item)} €</span>
                    </div>

                    {/* Affiche le titre mis à jour */}
                    {/* <p>{item.description || 'Description non disponible'}</p> */}
                    <div className={styles.productDetailsPrice}>
                      <div className={styles.priceQuantity}>
                        {item.selectedVariant && (
                          <span>
                            {item.selectedVariant.type} -{' '}
                            {item.selectedVariant.weight}
                          </span>
                        )}
                        <div className={styles.quantityButtons}>
                          <button
                            className={styles.decrement}
                            onClick={() =>
                              handleQuantityChange(
                                item.uniqueId,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </button>
                          <span className="item-quantity">{item.quantity}</span>
                          <button
                            className={styles.increment}
                            onClick={() =>
                              handleQuantityChange(
                                item.uniqueId,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className={styles.priceInfo}>
                          <span>Total: {calculateTotalPrice(item)} €</span>
                        </div>
                      </div>
                      <button
                        className={styles.removeProduct}
                        onClick={() => handleQuantityChange(item.uniqueId, 0)}
                      >
                        Supprimer tout le produit
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className={styles.total}>Total: {getTotal()} €</h3>
          </div>
          <div className={styles.actionContainer}>
            <div className={styles.datePickerContainer}>
              <h3 className="dateTitle">Jour et l'heure de retrait :</h3>
              <select
                value={pickupDay}
                onChange={(e) => setPickupDay(e.target.value)}
              >
                <option value="vendredi">Vendredi</option>
                <option value="samedi">Samedi</option>
              </select>
              <select
                className="dateSelect"
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
              <h3>Informations du client</h3>
              <div className={styles.firstInfo}>
                <div className={styles.firstInfoName}>
                  <span>Nom</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className={styles.firstInfoEmail}>
                  <span>email</span>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.InfoText}>
                <span>Adresse</span>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={createPayment}
              disabled={!allFieldsFilled}
              title={
                !allFieldsFilled
                  ? 'Veuillez remplir tous les champs.'
                  : !isEmailValid
                    ? 'Veuillez entrer une adresse email valide.'
                    : ''
              }
            >
              Payer avec Stripe
            </button>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </>
      )}
    </div>
  );
};

export default CartPage;
