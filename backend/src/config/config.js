import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const API_BASE_URL = process.env.API_BASE_URL || '';
export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;
export const AUTH_KEY = process.env.AUTH_KEY;
export const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const PORT = process.env.PORT || 3001;
export const CORS_ORIGINS = process.env.CORS_ORIGINS.split(',');
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const PRODUCER_ACCOUNT_ID = process.env.PRODUCER_ACCOUNT_ID;
export const PRODUCER_EMAIL = process.env.PRODUCER_EMAIL;
export const EMAIL_USER = process.env.EMAIL_USER;
export const MONGODB_URI = process.env.MONGODB_URI;
export const PRODUCER_TAX_ID = process.env.PRODUCER_TAX_ID;
export const PRODUCER_NAME = process.env.PRODUCER_NAME;
export const PRODUCER_ADDRESS = process.env.PRODUCER_ADDRESS;
export const LOG_DIR = process.env.LOG_DIR;
export const FACTURES_DIR = process.env.FACTURES_DIR;

if (!FRONTEND_BASE_URL) {
  throw new Error(
    'FRONTEND_BASE_URL environment variable is not set. Please set it to your frontend URL.'
  );
}
if (!AUTH_KEY) {
  throw new Error(
    'AUTH_KEY environment variable is not set. Please set it to your desired authentication key.'
  );
}
if (!ENCRYPT_KEY) {
  throw new Error(
    'ENCRYPT_KEY environment variable is not set. Please set it to your desired encryption key.'
  );
}
if (!SENDGRID_API_KEY) {
  throw new Error(
    'SENDGRID_API_KEY environment variable is not set. Please set it to your SendGrid API key.'
  );
}
if (!PORT) {
  throw new Error(
    'PORT environment variable is not set. Please set it to your desired port number.'
  );
}
if (!CORS_ORIGINS || CORS_ORIGINS.length === 0) {
  throw new Error(
    'CORS_ORIGINS environment variable is not set or empty, it should be a comma-separated list of allowed origins, e.g. CORS_ORIGINS=http://localhost:3000,http://example.com'
  );
}
if (!STRIPE_SECRET_KEY) {
  throw new Error(
    'STRIPE_SECRET KEY environment variable is not set. Please set it to your Stripe secret key.'
  );
}
if (!PRODUCER_ACCOUNT_ID) {
  throw new Error(
    'PRODUCER_ACCOUNT_ID environment variable is not set. Please set it to your Stripe producer account ID.'
  );
}
if (!PRODUCER_EMAIL) {
  throw new Error(
    'PRODUCER_EMAIL environment variable is not set. Please set it to your producer email.'
  );
}
if (!EMAIL_USER) {
  throw new Error(
    'EMAIL_USER environment variable is not set. Please set it to your email user.'
  );
}
if (!MONGODB_URI) {
  throw new Error(
    'MONGODB_URI environment variable is not set. Please set it to your MongoDB URI.'
  );
}
if (!PRODUCER_TAX_ID) {
  throw new Error(
    'PRODUCER_TAX_ID environment variable is not set. Please set it to your producer tax ID.'
  );
}
if (!PRODUCER_NAME) {
  throw new Error(
    'PRODUCER_NAME environment variable is not set. Please set it to your producer name.'
  );
}
if (!PRODUCER_ADDRESS) {
  throw new Error(
    'PRODUCER_ADDRESS environment variable is not set. Please set it to your producer address.'
  );
}

if (!LOG_DIR) {
  throw new Error(
    'LOG_DIR environment variable is not set. Please set it to your log directory.'
  );
}

if (!FACTURES_DIR) {
  throw new Error(
    'FACTURES_DIR environment variable is not set. Please set it to your factures directory.'
  );
}
