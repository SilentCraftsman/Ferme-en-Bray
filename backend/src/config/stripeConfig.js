import Stripe from 'stripe';
import dotenv from 'dotenv';
import { STRIPE_SECRET_KEY } from './config.js';

dotenv.config();

export const stripe = new Stripe(STRIPE_SECRET_KEY);
