import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowRight } from 'lucide-react';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.notFoundWrapper}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.iconBox}>
            <FileQuestion size={48} />
          </div>
          <span className={styles.errorCode}>404 Error</span>
          <h1 className={styles.title}>Diagnostic Page Not Found</h1>
          <p className={styles.desc}>
            The test, health package, or page you are trying to view might have been moved or is currently not available.
          </p>

          <div className={styles.actions}>
            <Link to="/" className={styles.homeBtn}>
              <Home size={16} /> Return to Homepage
            </Link>
            <Link to="/packages" className={styles.secondaryBtn}>
              Browse Health Packages <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
