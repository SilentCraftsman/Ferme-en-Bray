import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="page-container">
          <Header />
          <main className="content-wrap">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
