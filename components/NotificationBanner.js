// components/NotificationBanner.js
"use client";

import React from "react";
import styles from "../styles/NotificationBanner.module.css";

const NotificationBanner = ({ message, show, onClose }) => {
  return (
    <div className={`${styles.banner} ${show ? styles.show : ""}`} role="alert">
      <span className={styles.message}>{message}</span>
      <span className={styles.close} onClick={onClose}>
        &times;
      </span>
    </div>
  );
};

export default NotificationBanner;
