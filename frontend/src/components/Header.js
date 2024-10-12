'use client';

import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

import Link from 'next/link';
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaShoppingCart,
} from 'react-icons/fa';
import { useCart } from './cart/CartContext.js';
import '@/styles/Header.scss';

const NavItem = ({ href, icon: Icon, children, onClick }) => (
  <li>
    <Link href={href} passHref onClick={onClick}>
      <Icon /> {children}
    </Link>
  </li>
);

const NavList = ({ itemCount, toggleMenu }) => (
  <ul className={`nav-list`}>
    <NavItem href="/" icon={FaHome} onClick={toggleMenu}>
      Accueil
    </NavItem>
    <NavItem href="/a-propos" icon={FaInfoCircle} onClick={toggleMenu}>
      À propos
    </NavItem>
    <NavItem href="/contact" icon={FaEnvelope} onClick={toggleMenu}>
      Contact
    </NavItem>
    <li className="nav-item">
      <Link href="/panier" className="cart-link" passHref onClick={toggleMenu}>
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
);

export default function Header() {
  const { cart } = useCart();
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="header-container">
      <div className="header">
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
          <NavList itemCount={itemCount} toggleMenu={toggleMenu} />
          <li className="lonely-cart">
            <Link
              href="/panier"
              className="cart-link"
              passHref
              onClick={toggleMenu}
            >
              <div className="cart-icon-container">
                <FaShoppingCart />
                {itemCount > 0 && (
                  <span className="cart-item-count">{itemCount}</span>
                )}
              </div>
            </Link>
          </li>
        </nav>
      </div>
      <div className="drawer-container">
        <Drawer
          open={isOpen}
          onClose={closeMenu}
          direction="right"
          className="drawer"
        >
          <NavList itemCount={itemCount} toggleMenu={closeMenu} />
        </Drawer>
      </div>
    </header>
  );
}
