'use client';

import React from 'react';
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

  return (
    <header className="header">
      <Link href="/" className="header-title">
        <h1>La volaille en Bray</h1>
      </Link>
      <nav>
        <ul className="nav-list">
          <li>
            <Link href="/" passHref>
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
