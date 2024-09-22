import express from 'express';
import {
  createCheckoutSession,
  handlePaymentSuccess,
} from '../controllers/paymentController.js';
import { healthRoute, testRoute } from '../controllers/orderController.js';

const router = express.Router();

// To handle async errors in route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  '/stripe/create-checkout-session',
  asyncHandler(createCheckoutSession)
);
router.get('/stripe/success', asyncHandler(handlePaymentSuccess));
router.get('/test', asyncHandler(testRoute));
router.get('/health', asyncHandler(healthRoute));

export default router;
