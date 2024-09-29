import dotenv from 'dotenv';
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    ENCRYPT_KEY: process.env.ENCRYPT_KEY,
    AUTH_KEY: process.env.AUTH_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    NEXT_PUBLIC_FORMSPREE_URL: process.env.NEXT_PUBLIC_FORMSPREE_URL,
  },
};

export default nextConfig;
