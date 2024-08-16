"use client";

import { CartProvider } from "../components/cart/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <script src="https://js.stripe.com/v3/" async></script>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
