import Stripe from 'stripe';
import dotenv from 'dotenv';
import { STRIPE_SECRET_KEY } from './config.js';

dotenv.config();

export const stripe = new Stripe(STRIPE_SECRET_KEY);

// Stripe fee percentage (2.9% + 0.30 EUR)
export const stripeFeePercentage = Number(process.env.STRIPE_FEE_PERCENTAGE);
export const fixedStripeFeeInCent = Number(
  process.env.FIXED_STRIPE_FEE_IN_CENT
);

export const adminFeePercentage = Number(process.env.ADMIN_FEE_PERCENTAGE);

// check constants validity
if (
  !stripeFeePercentage ||
  stripeFeePercentage < 0 ||
  stripeFeePercentage > 1
) {
  throw new Error('Invalid stripeFeePercentage');
}
if (!adminFeePercentage || adminFeePercentage < 0 || adminFeePercentage > 1) {
  throw new Error('Invalid adminFeePercentage');
}
if (
  !fixedStripeFeeInCent ||
  fixedStripeFeeInCent % 1 !== 0 ||
  fixedStripeFeeInCent < 0 ||
  fixedStripeFeeInCent > 100
) {
  throw new Error('Invalid fixedStripeFeeInCent');
}
