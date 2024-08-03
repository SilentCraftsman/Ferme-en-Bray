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

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      {/* Section pour les spécialités */}
      <section id="specialties">
        <h2>Spécialités</h2>
        <div className="products-grid">
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
      <section id="outdoor-poultry">
        <h2>Produits de plein air</h2>
        <div className="products-container">
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
      <section id="holiday-products">
        <h2>Produits de fête</h2>
        <div className="products-container">
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
