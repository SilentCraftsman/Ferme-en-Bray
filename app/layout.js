"use client";

import { CartProvider } from "../components/cart/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
