// app/contact/page.js
'use client';

import { useState } from 'react';
import '@/styles/contact.scss';
import dotenv from 'dotenv';

dotenv.config();

export default function ContactPage() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    message: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validation simple côté client
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      // Validation de l'email
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = process.env.NEXT_PUBLIC_FORMSPREE_URL;

    if (!url) {
      setMessageType('error');
      setMessage("L'URL du formulaire n'est pas définie.");
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessageType('success');
        setMessage('Demande envoyée avec succès');
        setFormData({
          prenom: '',
          nom: '',
          email: '',
          message: '',
        });
      } else {
        setMessageType('error');
        setMessage("Erreur lors de l'envoi de la demande");
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Erreur: ' + error.message);
    }

    setTimeout(() => {
      setMessage('');
    }, 3500);
  };

  return (
    <>
      <div className="contact-container">
        <div className="contact-container-content">
          <h1 className="contact-title">Contactez-Nous</h1>
          <p className="contact-description">
            Pour toute question ou demande, veuillez remplir le formulaire
            ci-dessous ou nous envoyer un email à{' '}
            <a href="mailto:contact@entreprisevolailles.com">
              contact@entreprisevolailles.com
            </a>
            .
          </p>
          <p className="contact-info-item">
            <strong>Adresse :</strong> 24 Rte de Beauvais, 76220
            Ferrières-en-Bray
          </p>
          <p className="contact-info-item">
            <strong>Téléphone :</strong> 06 09 50 57 78
          </p>
          <p className="contact-info-item">
            <strong>Gérant :</strong> Bruno Bouchart
          </p>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2675.509248658827!2d1.5539124153378517!3d49.54224867933108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e0c9a7824280b7%3A0x63e87bb9b4eecb22!2s24%20Rte%20de%20Beauvais%2C%2076220%20Ferrieres-en-Bray!5e0!3m2!1sen!2sfr!4v1631846497347!5m2!1sen!2sfr"
              width="70%"
              height="245"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Localisation de l'entreprise"
            ></iframe>
          </div>
        </div>
        <div className="form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-name">
              <div className="form-name-content">
                <span>Prenom</span>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                />
              </div>
              <div className="form-name-content">
                <span htmlFor="nom">Nom</span>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-email"
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
              className="contact-message"
            ></textarea>
            <button type="submit">Envoyer</button>
          </form>
          {message && (
            <div className={`form-message ${messageType}`}>{message}</div>
          )}
        </div>
      </div>
    </>
  );
}
