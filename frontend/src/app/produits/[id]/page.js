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
  };
}

const ProduitPage = ({ params }) => {
  const { id } = params;
  const product = getProductById(id);

  if (!product) {
    return <div>Produit non trouvé</div>;
  }

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
              url: `${process.env.FRONTEND_BASE_URL}/produit/${product.subroute}`,
              priceCurrency: 'EUR',
              price: product.priceForRichSnippet,
              itemCondition: 'https://schema.org/NewCondition',
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />
      <Product product={product} />
    </>
  );
};

export default ProduitPage;
