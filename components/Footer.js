// components/Footer.js
import { FaFacebook } from "react-icons/fa";
import "../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        La volaille en bray - &copy; 2024
        <br></br>
        <br></br> Tous droits réservés.
      </p>
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
    </footer>
  );
};

export default Footer;
