// components/Header.js
import { FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import '../styles/Header.css'; // Assurez-vous que ce chemin est correct

const Header = () => {
    return (
        <header className="header">
            <nav>
                <ul className="nav-list">
                    <li><a href="/"><FaHome /> Accueil</a></li>
                    <li><a href="/about"><FaInfoCircle /> À propos</a></li>
                    <li><a href="/contact"><FaEnvelope /> Contact</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
