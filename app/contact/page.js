// app/contact/page.js
"use client";

import "../../styles/contact.css";
import { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      alert("Une erreur s'est produite lors de l'envoi de votre message.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contactez-Nous</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom :</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formState.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="message">Message :</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={formState.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}
