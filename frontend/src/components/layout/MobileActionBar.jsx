import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import styles from './MobileActionBar.module.css';

export default function MobileActionBar() {
  const whatsappUrl = 'https://wa.me/918320740996?text=Hello%20Shyam%20Diagnostic%20%26%20MediNextGen%2C%20I%20would%20like%20to%20enquire%20about%20diagnostic%20tests.';

  return (
    <aside className={styles.actionBar} aria-label="Quick mobile contact actions">
      <a href="tel:8320740996" className={styles.actionBtn}>
        <Phone size={18} />
        <span>Call</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.actionBtn} ${styles.whatsappBtn}`}
      >
        <MessageCircle size={18} />
        <span>WhatsApp</span>
      </a>

      <Link to="/packages" className={`${styles.actionBtn} ${styles.bookBtn}`}>
        <Calendar size={18} />
        <span>Book Test</span>
      </Link>
    </aside>
  );
}
