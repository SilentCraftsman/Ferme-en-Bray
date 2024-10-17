import React from 'react';
import '@/styles/politique-confidentialite.scss';

export const metadata = {
  title: 'Politique de Confidentialité - La volaille en Bray',
  description:
    'Découvrez notre politique de confidentialité et comment nous protégeons vos informations personnelles chez La volaille en Bray.',
  alternates: {
    canonical: `${process.env.FRONTEND_BASE_URL}/politique-confidentialite`,
  },
};

const PolitiqueConfidentialite = () => (
  <div className="politique-confidentialite-container">
    <h2>Politique de Confidentialité</h2>
    <p>
      <strong>Introduction :</strong> Chez <strong>La volaille en Bray</strong>,
      nous nous engageons à protéger votre vie privée. Cette politique de
      confidentialité décrit la manière dont nous collectons, utilisons et
      protégeons vos informations personnelles.
    </p>
    <p>
      <strong>Collecte des Données :</strong>
      <br /> <br />
      Informations personnelles : Nom, prénom, adresse e-mail, numéro de
      téléphone ;
      <br />
      Informations de navigation : Cookies, adresses IP.
    </p>
    <p>
      <strong>Utilisation des Données :</strong>
      <br /> <br />
      Traiter vos commandes et gérer vos demandes ;
      <br />
      Améliorer nos produits et services ;
      <br />
      Vous envoyer des informations et offres commerciales, si vous avez
      consenti à les recevoir ;
      <br />
      Assurer la sécurité du site et prévenir les fraudes.
    </p>
    <p>
      <strong>Conservation des Données :</strong> Vos données sont conservées
      uniquement pour la durée nécessaire à la réalisation des objectifs
      précisés, en accord avec les législations applicables.
    </p>
    <p>
      <strong>Sécurité des Données :</strong> Nous mettons en œuvre des mesures
      techniques et organisationnelles pour garantir la sécurité de vos données
      personnelles.
    </p>
    <p>
      <strong>Droits des Utilisateurs :</strong>
      <br />
      <br /> Conformément au RGPD, vous disposez des droits suivants :
      <br />
      Droit d'accès, Droit de rectification, Droit à l'effacement, Droit à la
      limitation du traitement, Droit d'opposition, Droit à la portabilité.
    </p>
    <p>
      Pour exercer ces droits, contactez-nous à l'adresse suivante :{' '}
      <strong>lavolailleenbray@gmail.com</strong> ou par téléphone au{' '}
      <strong>06 09 50 57 78</strong>.
    </p>
    <p>
      <strong>Modifications :</strong> Cette politique peut être modifiée. Les
      changements seront publiés sur cette page et seront effectifs dès leur
      publication.
    </p>
  </div>
);

export default PolitiqueConfidentialite;
