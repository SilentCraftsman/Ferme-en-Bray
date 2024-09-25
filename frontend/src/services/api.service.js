import axios from 'axios';
import CryptoJS from 'crypto-js';
import {
  API_BASE_PATH,
  AUTH_KEY,
  ENCRYPT_KEY,
} from '@/config/common.config.js';

const apiClient = axios.create({
  baseURL: API_BASE_PATH,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  config.headers['Authorization'] = CryptoJS.AES.encrypt(
    AUTH_KEY,
    ENCRYPT_KEY
  ).toString();
  return config;
});

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
    const response = await apiClient.post('/stripe/create-checkout-session', {
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
    });
    return response.data;
  } catch (error) {
    console.error(`Error in createCheckoutSession: ${error}`);
    throw error;
  }
};

export const cancelSession = async (sessionId) => {
  try {
    const response = await apiClient.get('/stripe/cancel', {
      params: { session_id: sessionId },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in cancelSession: ${error}`);
    throw error;
  }
};

export const checkPaymentStatus = async (sessionId) => {
  try {
    const response = await apiClient.get('/stripe/success', {
      params: { session_id: sessionId },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in checkPaymentStatus: ${error}`);
    throw error;
  }
};
