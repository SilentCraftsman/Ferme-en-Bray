'use client';

import { CartProvider } from '@/components/cart/CartContext.js';
import Header from '@/components/Header.js';
import Footer from '@/components/Footer.js';
import '@/styles/globals.scss';

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Balises globales pour toutes les pages */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <title>La volaille en Bray</title>
        <meta
          name="description"
          content="Découvrez nos produits à base de volailles."
        />
      </head>
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
