// app/contact/page.js
import '../../styles/contact.css';

export const metadata = {
    title: 'Contact - Entreprise de Volailles',
    description: 'Contactez l\'Entreprise de Volailles pour toute demande.',
};

export default function ContactPage() {
    return (
        <div className="contact-container">
            <h1>Contactez-Nous</h1>
            <p>
                Pour toute question ou demande, veuillez remplir le formulaire ci-dessous ou nous
                envoyer un email à <a href="mailto:contact@entreprisevolailles.com">contact@entreprisevolailles.com</a>.
            </p>
            <form className="contact-form" method="POST" action="/api/contact">
                <label htmlFor="name">Nom :</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="email">Email :</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="message">Message :</label>
                <textarea id="message" name="message" rows="5" required></textarea>

                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
}
