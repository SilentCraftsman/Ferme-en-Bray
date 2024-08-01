// app/contact/page.js
"use client";

import { useState } from "react";
import "../../styles/contact.scss";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      /***************************************************************************************************************************
       N'oublie de pas de mettre le vrai lien avec l'id dans fetch
        ***************************************************************************************************************************/
      const response = await fetch("id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessageType("success");
        setMessage("Demande envoyée avec succès");
        setFormData({
          prenom: "",
          nom: "",
          email: "",
          message: "",
        });
      } else {
        setMessageType("error");
        setMessage("Erreur lors de l'envoi de la demande");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Erreur: " + error.message);
    }

    setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contactez-Nous</h1>
      <p className="contact-description">
        Pour toute question ou demande, veuillez remplir le formulaire
        ci-dessous ou nous envoyer un email à{" "}
        <a href="mailto:contact@entreprisevolailles.com">
          contact@entreprisevolailles.com
        </a>
        .
      </p>
      <div className="contact-info">
        <h2 className="contact-info-title">Informations de Contact</h2>
        <p className="contact-info-item">
          <strong>Adresse :</strong> 24 Rte de Beauvais, 76220 Ferrières-en-Bray
        </p>
        <p className="contact-info-item">
          <strong>Téléphone :</strong> +33 1 23 45 67 89
        </p>
        <p className="contact-info-item">
          <strong>Gérant :</strong> Bruno Bouchart
        </p>
      </div>
      <div className="map-container">
        <h2 className="map-title">Localisez-Nous</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2675.509248658827!2d1.5539124153378517!3d49.54224867933108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e0c9a7824280b7%3A0x63e87bb9b4eecb22!2s24%20Rte%20de%20Beauvais%2C%2076220%20Ferrieres-en-Bray!5e0!3m2!1sen!2sfr!4v1631846497347!5m2!1sen!2sfr"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      <h2 className="form-title">Formulaire</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="prenom">Prénom :</label>
        <input
          type="text"
          id="prenom"
          name="prenom"
          required
          value={formData.prenom}
          onChange={handleChange}
        />

        <label htmlFor="nom">Nom :</label>
        <input
          type="text"
          id="nom"
          name="nom"
          required
          value={formData.nom}
          onChange={handleChange}
        />

        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="message">Message :</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          required
          value={formData.message}
          onChange={handleChange}
        ></textarea>

        <button type="submit">Envoyer</button>
      </form>
      {message && (
        <div className={`form-message ${messageType}`}>{message}</div>
      )}
    </div>
  );
}
