// app/layout.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css'; // Importez les styles globaux

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
