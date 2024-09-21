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

// To handle async errors in route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  '/stripe/create-checkout-session',
  asyncHandler(createCheckoutSession)
);
router.get('/stripe/success', asyncHandler(handlePaymentSuccess));
router.get('/cancel', asyncHandler(cancelOrder));
router.get('/success', asyncHandler(successResponse));
router.get('/test', asyncHandler(testRoute));

export default router;
