'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaShoppingCart,
} from 'react-icons/fa';
import { useCart } from './cart/CartContext.js';
import '@/styles/Header.scss';

export default function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0); // Assure le bon comptage des items
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <Link href="/" className="header-title">
        <h1>La volaille en Bray</h1>
      </Link>
      <nav>
        <button onClick={toggleMenu} className="nav-button">
          <svg
            className="icon"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
        <ul className={`nav-list ${isOpen ? 'open' : ''}`}>
          <li>
            <Link className="test" href="/" passHref>
              <FaHome /> Accueil
            </Link>
          </li>
          <li>
            <Link href="/about" passHref>
              <FaInfoCircle /> À propos
            </Link>
          </li>
          <li>
            <Link href="/contact" passHref>
              <FaEnvelope /> Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/cart" className="cart-link" passHref>
              <div className="cart-icon-container">
                <FaShoppingCart />
                {itemCount > 0 && (
                  <span className="cart-item-count">{itemCount}</span>
                )}
              </div>
              Panier
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
