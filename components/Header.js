"use client";

import React, { useContext } from "react";
import Link from "next/link";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaShoppingCart,
} from "react-icons/fa";
import { CartContext } from "./cart/CartContext"; // Assurez-vous que le chemin est correct
import "../styles/Header.css";

export default function Header() {
  const { cart } = useContext(CartContext);
  const itemCount = cart.length;

  return (
    <header className="header">
      <Link href="/" className="header-title">
        <h1>La ferme en Bray</h1>
      </Link>
      <nav>
        <ul className="nav-list">
          <li>
            <Link href="/">
              <FaHome /> Accueil
            </Link>
          </li>
          <li>
            <Link href="/about">
              <FaInfoCircle /> À propos
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <FaEnvelope /> Contact
            </Link>
          </li>
          <li>
            <Link href="/cart" className="cart-item">
              <FaShoppingCart /> Panier
              {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
