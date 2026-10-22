import React from 'react';
import styles from './LegalPages.module.css';

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.legalWrapper}>
      <div className="container">
        <div className={styles.legalCard}>
          <span className={styles.overline}>Patient Data Protection</span>
          <h1 className={styles.title}>Privacy & Confidentiality Policy</h1>
          <span className={styles.updated}>Last Updated: October 2026</span>

          <section className={styles.section}>
            <h2>1. Introduction & Scope</h2>
            <p>
              Shyam Diagnostic Centre and MediNextGen Healthcare (“we”, “our”, or “the Centre”) are deeply committed to safeguarding the privacy, confidentiality, and integrity of the personal health data and diagnostic records entrusted to us by our patients, visitors, and healthcare practitioners.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <p>When you book an appointment, schedule home collection, or request reports, we collect:</p>
            <ul>
              <li><strong>Contact Identifiers:</strong> Full legal name, contact phone/WhatsApp number, residential address, and email.</li>
              <li><strong>Clinical Data:</strong> Requested test panels, prescribing doctor names, sample timestamps, and pathological results.</li>
              <li><strong>Technical Identifiers:</strong> IP addresses and system logs recorded strictly for security, rate-limiting, and fraud prevention.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Patient Data</h2>
            <p>Your data is used strictly for:</p>
            <ul>
              <li>Coordinating home sample collection by trained, vaccinated phlebotomists.</li>
              <li>Analyzing biological specimens and generating laboratory PDF reports.</li>
              <li>Dispatching electronic reports directly to you via secure WhatsApp link or email.</li>
              <li>Complying with statutory medical record retention standards mandated by Indian health authorities.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. No Sale or Commercial Disclosure of Health Data</h2>
            <p>
              We <strong>NEVER</strong> sell, rent, lease, or monetize your patient contact numbers, medical history, or laboratory findings to third-party advertisers or insurance brokers.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Contact Our Data Compliance Desk</h2>
            <p>
              If you have inquiries regarding how your diagnostic records are stored or wish to request corrections, contact us at <a href="mailto:privacy@shyamdiagnostic.com">privacy@shyamdiagnostic.com</a> or via our central telephone +91 8320740996.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
