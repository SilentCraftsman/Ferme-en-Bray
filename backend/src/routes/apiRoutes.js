import express from 'express';
import {
  createCheckoutSession,
  handlePaymentSuccess,
} from '../controllers/paymentController.js';
import {
  cancelOrder,
  successResponse,
  testRoute,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/stripe/create-checkout-session', createCheckoutSession);
router.get('/stripe/success', handlePaymentSuccess);
router.get('/cancel', cancelOrder);
router.get('/success', successResponse);
router.get('/test', testRoute);

export default router;
