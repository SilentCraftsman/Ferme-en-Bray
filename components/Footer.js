// components/Footer.js
import { FaFacebook } from "react-icons/fa";
import "../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="/mentions-legales" rel="noopener noreferrer">
            Mentions légales
          </a>
          <a href="/politique-confidentialite" rel="noopener noreferrer">
            Politique de confidentialité
          </a>
          <a href="/cgu" rel="noopener noreferrer">
            Conditions générales d'utilisation (CGU)
          </a>
          <a href="/cgv" rel="noopener noreferrer">
            Conditions générales de vente (CGV)
          </a>
          <a href="/contact" rel="noopener noreferrer">
            Contact
          </a>
        </div>
        <p>La volaille en bray - &copy; 2024</p>
        <p>Tous droits réservés.</p>
        <div className="social-media">
          <a
            href="https://www.facebook.com/groups/355255679901634/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook size={32} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
