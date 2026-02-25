import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.logo}>🇸🇱 LeoneAI</span>
        <span className={styles.copy}>© {year} LeoneAI Trading Platform. All rights reserved.</span>
        <span className={styles.tagline}>Sierra Leone's AI Trader</span>
      </div>
    </footer>
  );
};

export default Footer;
