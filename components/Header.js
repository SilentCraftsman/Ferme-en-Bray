import React from "react";
import { FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import "../styles/Header.css";
const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">La ferme en Bray</h1>
      <nav className="nav">
        <ul className="nav-list">
          <li>
            <a href="/">
              <FaHome /> Accueil
            </a>
          </li>
          <li>
            <a href="/about">
              <FaInfoCircle /> À propos
            </a>
          </li>
          <li>
            <a href="/contact">
              <FaEnvelope /> Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
