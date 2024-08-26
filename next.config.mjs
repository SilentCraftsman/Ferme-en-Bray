import dotenv from "dotenv";
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  },
  output: "export", // Pour l'exportation statique
  // Assure-toi que le paramètre output est correctement configuré
};

export default nextConfig;
