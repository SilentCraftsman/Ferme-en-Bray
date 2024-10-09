import products from '@/config/products.json';
import Product from '@/components/Product.js';

export const dynamic = 'force-dynamic'; // optional if you want dynamic behavior

const getProductById = (id) => {
  const allProducts = [
    ...products.specialtyProducts,
    ...products.outdoorPoultryProducts,
    ...products.holidayProducts,
  ];
  return allProducts.find((product) => product.subroute.toString() === id);
};

export async function generateMetadata({ params }, parent) {
  const { id } = params;
  const product = getProductById(id);

  if (!product) {
    return {};
  }

  return {
    title: `Acheter ${product.title} - Vente en ligne de volaille de qualité`,
    description: `Découvrez notre ${product.title}, ${product.description}. Parfait pour vos repas gourmands. Commandez maintenant en ligne !`,
    alternates: {
      canonical: `${process.env.FRONTEND_BASE_URL}/produits/${product.subroute}`,
    },
  };
}

const getPriceValidUntil = () => {
  const currentDate = new Date();
  const expiryDate = new Date(currentDate.setMonth(currentDate.getMonth() + 3)); // 3 months from now
  return expiryDate.toISOString().split('T')[0]; // format YYYY-MM-DD
};

const ProduitPage = ({ params }) => {
  const { id } = params;
  const product = getProductById(id);

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  const aggregateRating = product.aggregateRating || {};
  const reviews = product.reviews || [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.title,
            image: `${process.env.FRONTEND_BASE_URL}${product.image}`,
            description: product.description,
            sku: product.id,
            brand: {
              name: 'La volaille en Bray',
              url: process.env.FRONTEND_BASE_URL,
            },
            offers: {
              '@type': 'Offer',
              url: `${process.env.FRONTEND_BASE_URL}/produits/${product.subroute}`,
              priceCurrency: 'EUR',
              price: product.priceForRichSnippet,
              itemCondition: 'https://schema.org/NewCondition',
              availability: 'https://schema.org/InStock',
              hasMerchantReturnPolicy: false,
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                  '@type': 'MonetaryAmount',
                  value: '0',
                  currency: 'EUR',
                },
                deliveryTime: {
                  '@type': 'ShippingDeliveryTime',
                  businessDays: '0-1',
                },
              },
              priceValidUntil: getPriceValidUntil(),
            },
            ...(aggregateRating.ratingValue && aggregateRating.reviewCount
              ? {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: aggregateRating.ratingValue || '0',
                    reviewCount: aggregateRating.reviewCount || '0',
                  },
                }
              : {}),
            review: reviews.map((review) => ({
              '@type': 'Review',
              author: {
                '@type': 'Person',
                name: review.author,
              },
              reviewRating: {
                '@type': 'Rating',
                ratingValue: review.rating,
                bestRating: '5',
              },
              datePublished: review.date,
              reviewBody: review.content,
            })),
          }),
        }}
      />
      <Product product={product} />
    </>
  );
};

export default ProduitPage;
