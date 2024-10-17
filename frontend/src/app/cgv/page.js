import '@/styles/cgv.scss';

export const metadata = {
  title: 'Conditions Générales de Vente - La volaille en Bray',
  description:
    'Consultez les conditions générales de vente de La volaille en Bray, incluant les modalités de vente, les prix, et les informations de contact.',
  alternates: {
    canonical: `${process.env.FRONTEND_BASE_URL}/cgv`,
  },
};

const Cgv = () => {
  return (
    <div className="cgv-container">
      <h2>Conditions Générales de Vente (CGV)</h2>
      <section>
        <h3>Introduction</h3>
        <p>
          Les présentes conditions générales de vente régissent l'ensemble des
          transactions réalisées sur notre site. En accédant à notre site et en
          effectuant des achats, vous acceptez ces conditions dans leur
          intégralité.
        </p>
      </section>

      <section>
        <h3>1. Objet</h3>
        <p>
          Les présentes CGV visent à définir les modalités de vente entre la
          société "La volaille en Bray" et le client.
        </p>
      </section>

      <section>
        <h3>2. Produits</h3>
        <p>
          Les images des produits sont illustratives et peuvent différer des
          produits réels.
        </p>
      </section>

      <section>
        <h3>3. Prix</h3>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises. "La volaille
          en Bray" se réserve le droit de modifier les prix à tout moment.
        </p>
      </section>

      <section>
        <h3>4. Paiement</h3>
        <p>
          Le paiement s'effectue en ligne via une plateforme sécurisée. Le
          client garantit qu'il est pleinement autorisé à utiliser la carte de
          paiement pour le règlement de sa commande.
        </p>
      </section>

      <section>
        <h3>5. Retrait des produits</h3>
        <p>
          Les produits commandés peuvent être retirés directement à notre point
          de vente situé à 24 Rte de Beauvais, 76220 Ferrières-en-Bray. Les
          horaires de retrait sont les suivants : Vendredi et Samedi de 17h30 à
          20h00.
        </p>
      </section>

      <section>
        <h3>6. Droit de rétractation</h3>
        <p>
          Conformément à la législation en vigueur, le client dispose d'un délai
          de 14 jours pour se rétracter, mais les produits périssables doivent
          être récupérés dans les 48 heures suivant la commande. Passé ce délai,
          le droit de rétractation ne s'applique pas.
        </p>
      </section>

      <section>
        <h3>7. Service client</h3>
        <p>
          Pour toute question ou réclamation, vous pouvez nous contacter via la
          page de contact ou par email à l'adresse suivante :
          lavolailleenbray@gmail.com
        </p>
      </section>

      <section>
        <h3>8. Informations de Contact</h3>
        <p>
          Adresse : 24 Rte de Beauvais, 76220 Ferrières-en-Bray
          <br />
          Téléphone : 06 09 50 57 78
          <br />
          Gérants : Bruno Bouchart et Allison Bouchart
        </p>
      </section>

      <section>
        <h3>9. Litiges</h3>
        <p>
          En cas de litige, les parties conviennent de rechercher une solution
          amiable avant toute action judiciaire.
        </p>
      </section>

      <section>
        <h3>10. Modification des CGV</h3>
        <p>
          "La volaille en Bray" se réserve le droit de modifier les présentes
          conditions générales de vente à tout moment.
        </p>
      </section>

      <p>Ces CGV sont à jour au 17 octobre 2024.</p>
    </div>
  );
};

export default Cgv;
