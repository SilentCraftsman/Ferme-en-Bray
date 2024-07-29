// app/contact/page.js
"use client";

import "../../styles/contact.scss";
//import { useState } from "react";

export default function ContactPage() {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contactez-Nous</h1>
      <form className="contact-form">
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
