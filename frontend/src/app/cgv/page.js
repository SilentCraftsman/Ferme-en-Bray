// app\cgv\page.js

import '@/styles/cgv.scss';

const Cgv = () => {
  return (
    <div className="cgv-container">
      <h1>Conditions Générales de Vente (CGV)</h1>
      <section>
        <h2>Introduction</h2>
        <p>
          Les présentes conditions générales de vente régissent l'ensemble des
          transactions réalisées sur notre site. En accédant à notre site et en
          effectuant des achats, vous acceptez ces conditions dans leur
          intégralité.
        </p>
      </section>

      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes CGV visent à définir les modalités de vente entre la
          société "La volaille en Bray" et le client.
        </p>
      </section>

      <section>
        <h2>2. Produits</h2>
        <p>
          Nos produits sont décrits avec la plus grande précision possible. Les
          photographies des produits ne sont pas contractuelles.
        </p>
      </section>

      <section>
        <h2>3. Prix</h2>
        <p>
          Les prix sont indiqués en euros, toutes taxes comprises. "La volaille
          en Bray" se réserve le droit de modifier les prix à tout moment.
        </p>
      </section>

      <section>
        <h2>4. Paiement</h2>
        <p>
          Le paiement s'effectue en ligne via une plateforme sécurisée. Le
          client garantit qu'il est pleinement autorisé à utiliser la carte de
          paiement pour le règlement de sa commande.
        </p>
      </section>

      <section>
        <h2>5. Retrait des produits</h2>
        <p>
          Les produits commandés peuvent être retirés directement à notre point
          de vente situé à 24 Rte de Beauvais, 76220 Ferrières-en-Bray. Les
          horaires de retrait sont les suivants : Vendredi et Samedi de 17h30 à
          20h00.
        </p>
      </section>

      <section>
        <h2>6. Droit de rétractation</h2>
        <p>
          Conformément à la législation en vigueur, le client dispose d'un délai
          de 14 jours pour se rétracter sans avoir à justifier de motif.
        </p>
      </section>

      <section>
        <h2>7. Service client</h2>
        <p>
          Pour toute question ou réclamation, vous pouvez nous contacter via la
          page de contact ou par email à l'adresse suivante :
          serviceclient@volaille-en-bray.com.
        </p>
      </section>

      <section>
        <h2>8. Informations de Contact</h2>
        <p>
          Adresse : 24 Rte de Beauvais, 76220 Ferrières-en-Bray
          <br />
          Téléphone : 06 09 50 57 78
          <br />
          Gérant : Bruno Bouchart
        </p>
      </section>

      <section>
        <h2>9. Litiges</h2>
        <p>
          En cas de litige, les parties conviennent de rechercher une solution
          amiable avant toute action judiciaire.
        </p>
      </section>

      <section>
        <h2>10. Modification des CGV</h2>
        <p>
          "La volaille en Bray" se réserve le droit de modifier les présentes
          conditions générales de vente à tout moment.
        </p>
      </section>

      <p>Ces CGV sont à jour au 25 août 2024.</p>
    </div>
  );
};

export default Cgv;
