import products from '@/config/products.json';

const { specialtyProducts, outdoorPoultryProducts, holidayProducts } = products;

const DOMAIN = process.env.FRONTEND_BASE_URL;

function generateSiteMap() {
  // Static URLs
  const staticUrls = `
    <url>
      <loc>https://lavolailleenbray.com/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>1.00</priority>
    </url>
    <url>
      <loc>https://lavolailleenbray.com/a-propos</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.60</priority>
    </url>
    <url>
      <loc>https://lavolailleenbray.com/contact</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.50</priority>
    </url>
    <url>
      <loc>https://lavolailleenbray.com/panier</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.30</priority>
    </url>
    <url>
      <loc>https://lavolailleenbray.com/mentions-legales</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.30</priority>
    </url>
    <url>
      <loc>https://lavolailleenbray.com/politique-confidentialite</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.30</priority>
    </url>
    <url>
      <loc>https://lavolailleenbray.com/cgu</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.30</priority>
    </url>
    <url>
      <loc>https://lavolailleenbray.com/cgv</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.30</priority>
    </url>
  `;

  // Product URLs
  const allProducts = [
    ...specialtyProducts,
    ...outdoorPoultryProducts,
    ...holidayProducts,
  ];

  const productUrls = allProducts
    .map((product) => {
      return `
      <url>
        <loc>${DOMAIN}/produits/${product.subroute}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
    })
    .join('');

  // Combine static and product URLs
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls}
      ${productUrls}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap();

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}
