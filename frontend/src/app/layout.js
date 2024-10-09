import '@/styles/globals.scss';
import { CartProvider } from '@/components/cart/CartContext.js';
import Header from '@/components/Header.js';
import Footer from '@/components/Footer.js';
import React from 'react';

export const metadata = {
  title: 'La Volaille en Bray - Vente de Volailles Locales à Ferrières-en-Bray',
  description:
    'Achetez des volailles fraîches et locales directement de notre ferme à Ferrières-en-Bray. Découvrez nos volailles fermières élevées avec soin.',
  alternates: {
    canonical: `${process.env.FRONTEND_BASE_URL}`,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* SEO Essentials */}
        <meta name="author" content="La volaille en Bray" />
        <meta
          name="keywords"
          content="volaille, vente volaille, volaille fermière, volaille locale, Ferme en Bray, achat volaille, Ferrières-en-Bray"
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph & Twitter Cards */}
        <meta
          property="og:title"
          content="La Volaille en Bray - Ferme de Volailles à Ferrières-en-Bray"
        />
        <meta
          property="og:description"
          content="Découvrez des volailles fermières élevées dans le respect des traditions locales. Achetez directement à la ferme."
        />
        <meta
          property="og:image"
          content="/images/about-images/farm-image.jpg"
        />
        <meta property="og:url" content="https://lavolailleenbray.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="La volaille en Bray" />
        <meta
          name="twitter:description"
          content="Découvrez nos produits à base de volailles."
        />
        <meta
          name="twitter:image"
          content="/images/about-images/farm-image.jpg"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: 'La Volaille en Bray - Vente de Volailles Locales à Ferrières-en-Bray',
              description:
                'Achetez des volailles fraîches et locales directement de notre ferme à Ferrières-en-Bray. Découvrez nos volailles fermières élevées avec soin.',
              image: `${process.env.FRONTEND_BASE_URL}/images/about-images/farm-image.jpg`,
              url: process.env.FRONTEND_BASE_URL,
              telephone: '+33609505778',
              priceRange: '$$',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '24 Route de Beauvais',
                addressLocality: 'Ferrières-en-Bray',
                postalCode: '76220',
                addressCountry: 'FR',
              },
            }),
          }}
        />

        {/* Favicon */}
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
