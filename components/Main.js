"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Modal from "./Modal";
import { useCart } from "./cart/CartContext";
import "../styles/MainContent.scss";

const MainContent = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [specialtyProducts, setSpecialtyProducts] = useState([]);
  const [outdoorPoultryProducts, setOutdoorPoultryProducts] = useState([]);
  const [holidayProducts, setHolidayProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Fonction pour charger les données depuis le fichier JSON
    const loadProducts = async () => {
      const response = await fetch("/products.json");
      const data = await response.json();

      setSpecialtyProducts(data.specialtyProducts);
      setOutdoorPoultryProducts(data.outdoorPoultryProducts);
      setHolidayProducts(data.holidayProducts);
    };

    loadProducts();
  }, []);

  // Fonction pour ajouter un produit au panier
  const handleAddToCart = (product, quantity) => {
    if (typeof addToCart === "function") {
      addToCart(product, quantity);
    } else {
      console.error("addToCart n'est pas une fonction");
    }
  };

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      {/* NavBar secondaire */}
      <nav className="secondary-nav">
        <ul>
          <li>
            <a href="#specialties">Nos spécialités</a>
          </li>
          <li>
            <a href="#outdoor-poultry">Nos produits de plein air</a>
          </li>
          <li>
            <a href="#holiday-products">Nos produits de fête</a>
          </li>
        </ul>
      </nav>

      {/* Section pour les spécialités */}
      <section id="specialties" className="main-section">
        <h2>Nos spécialités</h2>
        <div className="product-grid">
          {specialtyProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onShowDetails={handleShowDetails}
            />
          ))}
        </div>
      </section>

      {/* Section pour les produits de plein air */}
      <section id="outdoor-poultry" className="main-section">
        <h2>Nos produits de plein air</h2>
        <div className="product-grid">
          {outdoorPoultryProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onShowDetails={handleShowDetails}
            />
          ))}
        </div>
      </section>

      {/* Section pour les produits de fête */}
      <section id="holiday-products" className="main-section">
        <h2>Nos produits de fête</h2>
        <p className="holiday-products-text">
          Veuillez noter que les produits de cette section sont disponibles
          uniquement sur commande.
        </p>
        <div className="product-grid">
          {holidayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onShowDetails={handleShowDetails}
            />
          ))}
        </div>
      </section>

      {/* Modale pour afficher les détails du produit */}
      {selectedProduct && (
        <Modal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MainContent;
