'use client';
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard.js';
import Modal from './Modal.js';
import { useCart } from './cart/CartContext.js';
import '@/styles/MainContent.scss';
import { FaArrowUp } from 'react-icons/fa';
import RMCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import products from '@/config/products.json';
import { useSearchParams } from 'next/navigation';

const Carousel = RMCarousel.default ? RMCarousel.default : RMCarousel;
const { specialtyProducts, outdoorPoultryProducts, holidayProducts } = products;
const responsives = {
  large: {
    breakpoint: {
      max: 2000,
      min: 1500,
    },
    items: 5,
    partialVisibilityGutter: 40,
  },
  desktop: {
    breakpoint: {
      max: 1500,
      min: 1250,
    },
    items: 4,
    partialVisibilityGutter: 40,
  },
  tablet: {
    breakpoint: {
      max: 1250,
      min: 464,
    },
    items: 3,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: {
      max: 1000,
      min: 735,
    },
    items: 2,
    partialVisibilityGutter: 30,
  },
  mobile2: {
    breakpoint: {
      max: 735,
      min: 465,
    },
    items: 2,
    partialVisibilityGutter: 10,
  },
  mobileSmaller: {
    breakpoint: {
      max: 465,
      min: 0,
    },
    items: 1,
    partialVisibilityGutter: 30,
  },
};

const hrefByCategory = {
  specialtyProducts: '#specialties',
  outdoorPoultryProducts: '#outdoor-poultry',
  holidayProducts: '#holiday-products',
};

const MainContent = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [savedScrollPositionOrElement, setSavedScrollPositionOrElement] =
    useState(0);
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const productId = searchParams.get('productId');

  useEffect(() => {
    if (categoryId && productId) {
      const categoryHref = hrefByCategory[categoryId];
      if (categoryHref) {
        const element = document.querySelector(categoryHref);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 1000);

          if (products[categoryId]) {
            const product = products[categoryId].find(
              (p) => String(p.id) === String(productId)
            );
            if (product) {
              handleShowDetails(product, element);
            }
          }
        }
      }
    }
  }, [categoryId, productId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product, quantity) => {
    if (typeof addToCart === 'function') {
      addToCart(product, quantity);
    } else {
      console.error("addToCart n'est pas une fonction");
    }
  };

  const handleShowDetails = (product, element = null) => {
    setSavedScrollPositionOrElement(element ? element : window.scrollY);
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    if (savedScrollPositionOrElement) {
      if (typeof savedScrollPositionOrElement === 'number') {
        window.scrollTo({
          top: savedScrollPositionOrElement,
          behavior: 'smooth',
        });
      } else {
        savedScrollPositionOrElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <main className="main-section-wrapper">
      <section
        id="specialties"
        className="main-section"
        aria-labelledby="specialties-heading"
      >
        <h3 id="specialties-heading">Nos spécialités</h3>
        <div className="product-grid">
          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlaySpeed={3000}
            centerMode={true}
            className="custom-carousel"
            containerClass="container-with-dots"
            dotListClass=""
            draggable
            focusOnSelect={false}
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={responsives}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
            infinite
          >
            {specialtyProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onShowDetails={handleShowDetails}
              />
            ))}
          </Carousel>
        </div>
      </section>

      <section
        id="outdoor-poultry"
        className="main-section"
        aria-labelledby="outdoor-poultry-heading"
      >
        <h3 id="outdoor-poultry-heading">Nos produits de plein air</h3>
        <div className="product-grid">
          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlaySpeed={3000}
            centerMode={true}
            className="custom-carousel"
            containerClass="container-with-dots"
            dotListClass=""
            draggable
            focusOnSelect={false}
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={responsives}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
            infinite
          >
            {outdoorPoultryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onShowDetails={handleShowDetails}
              />
            ))}
          </Carousel>
        </div>
      </section>

      <section
        id="holiday-products"
        className="main-section"
        aria-labelledby="holiday-products-heading"
      >
        <h3 id="holiday-products-heading">Nos produits de fête</h3>
        <p className="holiday-products-text">
          Veuillez noter que les produits de cette section sont disponibles
          uniquement sur commande.
        </p>
        <div className="product-grid">
          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlaySpeed={3000}
            centerMode={true}
            className="custom-carousel"
            containerClass="container-with-dots"
            dotListClass=""
            draggable
            focusOnSelect={false}
            itemClass=""
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={responsives}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
            infinite
          >
            {holidayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onShowDetails={handleShowDetails}
              />
            ))}
          </Carousel>
        </div>
      </section>

      {selectedProduct && (
        <Modal
          show={!!selectedProduct}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}

      <div className="scroll-container">
        <button
          className={`scroll-to-top ${showScrollToTop ? 'visible' : ''}`}
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      </div>
    </main>
  );
};

export default MainContent;
