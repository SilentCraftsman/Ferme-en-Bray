'use client';
import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext.js';
import CartItems from './CartItems.js';
import CustomerForm from './CustomerForm.js';
import { createCheckoutSession } from '@/services/api.service.js';
import styles from '../../styles/CartPage.module.scss';
import classNames from 'classnames';

const MAX_QUANTITY = 80;

const CartPage = () => {
  const { cart, updateQuantity, getTotal } = useCart();
  const [error, setError] = useState(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [showCustomerFormPage, setShowCustomerFormPage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.Stripe) {
      setStripeLoaded(true);
    } else {
      console.error('Stripe.js has not loaded.');
    }
  }, []);

  useEffect(() => {
    if (showCustomerFormPage === false) {
      setError('');
    }
  }, [showCustomerFormPage]);

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
      return item.title.replace(/(\d+(\.\d+)?kg)/, item.selectedVariant.weight);
    }
    return item.title;
  };

  const calculateTotalPrice = (item) => {
    let unitPrice = 0;

    if (item.selectedVariant) {
      unitPrice = parseFloat(
        item.selectedVariant.price.replace('€', '').replace(',', '.')
      );
    } else {
      unitPrice = parseFloat(item.price.replace('€', '').replace(',', '.'));
    }

    return (unitPrice * item.quantity).toFixed(2);
  };

  const getUnitPrice = (item) => {
    let unitPrice = 0;

    if (item.selectedVariant) {
      unitPrice = parseFloat(
        item.selectedVariant.price.replace('€', '').replace(',', '.')
      );
    } else {
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

  const createPayment = async ({
    customerName,
    customerEmail,
    customerAddress,
    pickupDay,
    pickupTime,
  }) => {
    console.log({
      customerName,
      customerEmail,
      customerAddress,
      pickupDay,
      pickupTime,
    });
    if (!stripeLoaded) {
      setError('Stripe.js has not loaded.');
      return;
    }
    setError(null);
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cartContainer}>
      {loading && <div className={styles.loadingSpinner}></div>}
      {showCustomerFormPage ? (
        <CustomerForm
          createPayment={createPayment}
          setShowCustomerFormPage={setShowCustomerFormPage}
        />
      ) : (
        <CartItems
          cart={cart}
          handleQuantityChange={handleQuantityChange}
          getUpdatedTitle={getUpdatedTitle}
          getUnitPrice={getUnitPrice}
          calculateTotalPrice={calculateTotalPrice}
          getTotal={getTotal}
          setShowCustomerFormPage={setShowCustomerFormPage}
        />
      )}
      {error && showCustomerFormPage && (
        <div
          className={classNames(styles.errorMessage, styles.errorGlobalCart)}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default CartPage;
