'use client';

import React, { useState } from 'react';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, MenuButton, MenuItem, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaShoppingCart,
  FaStore,
} from 'react-icons/fa';
import { useCart } from './cart/CartContext.js';
import '@/styles/Header.scss';
import products from '@/config/products.json';

const categoryTitleById = {
  specialtyProducts: 'Nos spécialités',
  outdoorPoultryProducts: 'Nos produits de plein air',
  holidayProducts: 'Nos produits de fête',
};

const NavItem = ({ href, icon: Icon, children, onClick }) => (
  <li>
    <Link href={href} passHref onClick={onClick} className="nav-link">
      <Icon /> {children}
    </Link>
  </li>
);

const NavList = ({ itemCount, toggleMenu, isDrawer }) => (
  <ul className={`nav-list`}>
    <NavItem href="/" icon={FaHome} onClick={toggleMenu}>
      Accueil
    </NavItem>
    <Menu
      align={isDrawer ? 'end' : 'start'}
      menuButton={
        <MenuButton className={'menu-btn'}>
          <NavItem href="" icon={FaStore}>
            Produits
          </NavItem>
        </MenuButton>
      }
    >
      {Object.keys(products).map((category) => (
        <SubMenu key={category} label={categoryTitleById[category]}>
          {products[category].map((product) => (
            <Link
              className="product-link"
              key={product.id}
              href={`/?categoryId=${category}&productId=${product.id}`}
              passHref
              onClick={toggleMenu}
            >
              <MenuItem>{product.title}</MenuItem>
            </Link>
          ))}
        </SubMenu>
      ))}
    </Menu>
    <NavItem href="/a-propos" icon={FaInfoCircle} onClick={toggleMenu}>
      À propos
    </NavItem>
    <NavItem href="/contact" icon={FaEnvelope} onClick={toggleMenu}>
      Contact
    </NavItem>
    <li className="nav-item">
      <Link
        href="/panier"
        className="cart-link nav-link"
        passHref
        onClick={toggleMenu}
      >
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
      {/*<h1 style={{ position: 'absolute', zIndex: -1 }}>La volaille en Bray</h1>*/}
      <div className="header">
        <Link href="/" className="header-title">
          <Image
            height={100}
            width={100}
            src="/images/logo_la_volaille_en_bray-transformed.jpeg"
            alt="Logo la volaille en Bray"
          />
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
            <Link href="/panier" className="cart-link nav-link" passHref>
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
          <NavList isDrawer itemCount={itemCount} toggleMenu={closeMenu} />
        </Drawer>
      </div>
    </header>
  );
}
