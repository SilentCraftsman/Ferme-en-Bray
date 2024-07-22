// components/Header.js
import React from "react";
import Link from "next/link";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaShoppingCart,
} from "react-icons/fa";
import "../styles/Header.css";

export default function Header() {
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
            <Link href="/cart">
              <FaShoppingCart /> Panier
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
