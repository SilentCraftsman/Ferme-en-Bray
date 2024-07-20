// components/Header.js
import Link from 'next/link';
import styles from '../styles/Header.css'; 
const Header = () => {
    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.navList}>
                    <li><Link href="/">Accueil</Link></li>
                    <li><Link href="/products">Produits</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
