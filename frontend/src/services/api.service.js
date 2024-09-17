import axios from 'axios';
import { API_BASE_PATH } from '@/config/common.config.js';

export const createCheckoutSession = async (
  cart,
  pickupDay,
  pickupTime,
  customerEmail,
  customerName,
  customerAddress,
  getTotal
) => {
  try {
    const response = await axios.post(
      `${API_BASE_PATH}/stripe/create-checkout-session`,
      {
        items: cart.map((item) => ({
          title: item.title,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant,
        })),
        pickupDay,
        pickupTime,
        customerEmail,
        customerName,
        customerAddress,
        totalPrice: getTotal(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
};

export const cancelSession = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE_PATH}/stripe/cancel`, {
      params: { session_id: sessionId },
    });
    return response.data;
  } catch (error) {
    console.error('Error in cancelSession:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE_PATH}/stripe/success`, {
      params: { session_id: sessionId },
    });
    return response.data;
  } catch (error) {
    console.error('Error in checkPaymentStatus:', error);
    throw error;
  }
};
