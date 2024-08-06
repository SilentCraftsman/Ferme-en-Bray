// components/Footer.js
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import "../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 Entreprise de Volailles. Tous droits réservés.</p>
      <div className="social-media">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter size={24} />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram size={24} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
