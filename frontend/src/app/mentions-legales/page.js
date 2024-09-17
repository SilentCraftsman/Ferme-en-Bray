import React from 'react';
import '@/styles/mentions-legales.scss';

const MentionsLegales = () => (
  <div className="mentions-legales-container">
    <h1>Mentions Légales</h1>
    <p>
      <strong>Informations de Contact</strong>
    </p>
    <p>
      <strong>Adresse :</strong> 24 Rte de Beauvais, 76220 Ferrières-en-Bray
    </p>
    <p>
      <strong>Téléphone :</strong> 06 09 50 57 78
    </p>
    <p>
      <strong>Gérant :</strong> Bruno Bouchart
    </p>
    <p>
      <strong>Nom de l'entreprise :</strong> La volaille en Bray
    </p>

    <h2>Informations sur l'entreprise</h2>
    <p>
      La société <strong>La volaille en Bray</strong> est spécialisée dans la
      production de produits alimentaires à base de volailles. Nous mettons un
      point d'honneur à respecter les standards les plus stricts en matière de
      sécurité alimentaire et de durabilité.
    </p>
    <p>
      <strong>SIRET :</strong> [Numéro de SIRET] <br />
      <strong>Directeur de la publication :</strong> Bruno Bouchart <br />
      <strong>Hébergeur du site :</strong> [Nom et adresse de l'hébergeur]
    </p>

    <h2>Responsabilité</h2>
    <p>
      La société décline toute responsabilité en cas d'erreurs ou d'omissions
      dans les informations fournies sur le site. Les utilisateurs sont invités
      à nous signaler toute erreur ou omission à l'adresse suivante : [Adresse
      e-mail].
    </p>

    <h2>Propriété Intellectuelle</h2>
    <p>
      Tous les contenus présents sur ce site, y compris les textes, images,
      graphiques, logos, icônes et autres éléments, sont la propriété exclusive
      de La volaille en Bray ou de leurs auteurs respectifs. Toute reproduction
      ou utilisation, partielle ou totale, de ces contenus sans autorisation
      expresse est interdite.
    </p>
  </div>
);

export default MentionsLegales;
