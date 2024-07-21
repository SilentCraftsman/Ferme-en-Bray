import React from "react";
import ProductCard from "./ProductCard";
import "../styles/MainContent.css";

const products = [
  {
    image: "./images/main-images/image-1.jpg",
    title: "Poulet Fermier",
    description: "Un poulet fermier élevé en plein air, tendre et savoureux.",
    price: "15,99 €",
  },
  {
    image: "./images/main-images/image-2.jpg",
    title: "Dinde Bio",
    description:
      "Dinde biologique nourrie avec des aliments naturels, parfaite pour les repas de fête.",
    price: "24,99 €",
  },
  {
    image: "./images/main-images/image-3.jpg",
    title: "Canard Confit",
    description: "Canard confit préparé selon la tradition, riche en saveurs.",
    price: "19,99 €",
  },
  {
    image: "./images/main-images/image-4.jpg",
    title: "Oie Rôtie",
    description:
      "Oie rôtie à la perfection, idéale pour les grandes occasions.",
    price: "29,99 €",
  },
];

const MainContent = () => {
  return (
    <section>
      <div className="title-main-content">
        <h3>Voici nos différents produits :</h3>
      </div>
      <div className="product-grid">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            image={product.image}
            title={product.title}
            description={product.description}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};

export default MainContent;
