import React from 'react';
import '@/styles/mentions-legales.scss';

export const metadata = {
  title: 'Mentions Légales - La volaille en Bray',
  description:
    "Consultez les mentions légales de La volaille en Bray, incluant les informations de contact et les détails de l'entreprise.",
  alternates: {
    canonical: `${process.env.FRONTEND_BASE_URL}/mentions-legales`,
  },
};

const MentionsLegales = () => (
  <div className="mentions-legales-container">
    <h2>Mentions Légales</h2>
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
      <strong>Gérants :</strong> Allison Bouchart et Bruno Bouchart
    </p>
    <p>
      <strong>Nom de l'entreprise :</strong> La volaille en Bray
    </p>

    <h3>Informations sur l'entreprise</h3>
    <p>
      La société <strong>La volaille en Bray</strong> est spécialisée dans la
      production de produits alimentaires à base de volailles. Nous mettons un
      point d'honneur à respecter les standards les plus stricts en matière de
      sécurité alimentaire et de durabilité.
    </p>
    <p>
      <strong>SIRET :</strong>980 699 185 00014
      <br />
      <strong>Responsable du contenu :</strong> Gambier Giovanni <br />
      <strong>Hébergeur du site :</strong> Planethoster - 4416 Rue
      Louis-B.-Mayer, Laval, QC H7P 0G1, Canada
    </p>

    <h3>Responsabilité</h3>
    <p>
      La société décline toute responsabilité en cas d'erreurs ou d'omissions
      dans les informations fournies sur le site. Les utilisateurs sont invités
      à nous signaler toute erreur ou omission à l'adresse suivante :
      lavolailleenbray@gmail.com
    </p>

    <h3>Propriété Intellectuelle</h3>
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
