// app/about/page.js
import '@/styles/about.scss';

export default function AboutPage() {
  return (
    <div className="about-container">
      <div className="about-header">
        <div className="about-header-content">
          <h1>À propos de notre entreprise </h1>
          <p>
            {' '}
            Nous sommes une entreprise spécialisée dans la production de
            produits alimentaires à base de volailles. Depuis 2023, nous nous
            engageons à offrir des produits de la plus haute qualité tout en
            respectant les standards les plus stricts en matière de sécurité
            alimentaire et de durabilité.
          </p>
        </div>
        {/* Utilisation de la balise <img> */}
        <img
          src="/images/about-images/farm-image.jpg"
          alt="Image illustrant notre entreprise"
          className="about-image"
          width={600}
          height={400}
        />
      </div>
      <div className="about-content">
        <div className="about-section">
          <h2>Notre Mission</h2>
          <p>
            Notre mission est de fournir à nos clients des produits sains,
            savoureux et nutritifs, tout en contribuant à la préservation de
            l'environnement et en soutenant les pratiques agricoles
            responsables.
          </p>
        </div>
        <div className="about-section">
          <h2>Notre Équipe</h2>
          <p>
            Notre équipe est composée de professionnels passionnés par leur
            métier, qui travaillent sans relâche pour garantir la qualité de nos
            produits et le service à la clientèle. Nous croyons en la
            collaboration et en l'innovation pour atteindre nos objectifs.
          </p>
        </div>
      </div>
    </div>
  );
}
