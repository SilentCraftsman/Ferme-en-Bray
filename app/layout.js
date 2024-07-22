// app/layout.js
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../components/cart/CartContext"; // Importer le CartProvider
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          {" "}
          {/* Entourer les composants avec le CartProvider */}
          <div className="page-container">
            <Header />
            <main className="content-wrap">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
