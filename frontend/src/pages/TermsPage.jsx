import React from 'react';
import styles from './LegalPages.module.css';

export default function TermsPage() {
  return (
    <div className={styles.legalWrapper}>
      <div className="container">
        <div className={styles.legalCard}>
          <span className={styles.overline}>Patient Agreement</span>
          <h1 className={styles.title}>Terms of Service & Booking Conditions</h1>
          <span className={styles.updated}>Last Updated: October 2026</span>

          <section className={styles.section}>
            <h2>1. Clinical & Medical Disclaimer</h2>
            <div className={styles.alertBox}>
              <strong>IMPORTANT NOTICE:</strong> All diagnostic information, package descriptions, parameter listings, and test values hosted on this website or communicated through WhatsApp are provided for informational and preliminary scheduling purposes only. Laboratory test reports do not constitute independent medical treatment, personal diagnosis, or medical prescription. Always consult a licensed clinical practitioner or your consulting physician for clinical correlation and treatment decisions.
            </div>
          </section>

          <section className={styles.section}>
            <h2>2. Online Inquiries & Booking Confirmation</h2>
            <p>
              Submitting a home collection request or package enquiry online generates a provisional booking reference number. Final appointment confirmation is contingent upon technician routing, location feasibility, and confirmation by our diagnostic dispatch desk.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Fasting and Sample Integrity Requirements</h2>
            <p>
              Accurate test results require strict patient adherence to preparation instructions (e.g., 10–12 hours fasting for fasting glucose and lipid profiles). If fasting protocols are breached, patients must notify the visiting technician prior to venipuncture.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Turnaround Times</h2>
            <p>
              Turnaround times (e.g. Same Day or 24 Hours) represent standard target reporting cycles under ordinary operational conditions. Specialized investigations requiring culture incubation, reflex confirmation, or technical re-runs may necessitate additional reporting time in the interest of diagnostic accuracy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Cancellations & Rescheduling</h2>
            <p>
              Patients may reschedule or cancel scheduled home visits without penalty by notifying our helpdesk at least two (2) hours prior to the designated collection slot via phone or WhatsApp.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
