// app/about/page.js
import '../../styles/about.css';

export const metadata = {
    title: 'À propos - Entreprise de Volailles',
    description: 'En savoir plus sur l\'Entreprise de Volailles.',
};

export default function AboutPage() {
    return (
        <div className="about-container">
            <h1>À propos de notre entreprise</h1>
            <p>
                Nous sommes une entreprise spécialisée dans la production de produits alimentaires
                à base de volailles. Depuis [année de création], nous nous engageons à offrir des
                produits de la plus haute qualité tout en respectant les standards les plus stricts
                en matière de sécurité alimentaire et de durabilité.
            </p>
            <h2>Notre Mission</h2>
            <p>
                Notre mission est de fournir à nos clients des produits sains, savoureux et
                nutritifs, tout en contribuant à la préservation de l'environnement et en soutenant
                les pratiques agricoles responsables.
            </p>
            <h2>Notre Équipe</h2>
            <p>
                Notre équipe est composée de professionnels passionnés par leur métier, qui travaillent
                sans relâche pour garantir la qualité de nos produits et le service à la clientèle.
                Nous croyons en la collaboration et en l'innovation pour atteindre nos objectifs.
            </p>
            <h2>Contact</h2>
            <p>
                Pour en savoir plus sur nos produits ou pour toute autre demande, n'hésitez pas à nous
                contacter à l'adresse <a href="mailto:contact@entreprisevolailles.com">contact@entreprisevolailles.com</a>.
            </p>
        </div>
    );
}
