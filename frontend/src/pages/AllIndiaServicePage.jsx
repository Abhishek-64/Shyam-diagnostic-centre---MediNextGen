import React from 'react';
import {
  Globe2,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Users,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';
import WhatsAppButton from '../components/common/WhatsAppButton.jsx';
import styles from './AllIndiaServicePage.module.css';

export default function AllIndiaServicePage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroHeader}>
        <div className="container">
          <div className={styles.heroInner}>
            <span className={styles.overline}>MediNextGen Healthcare Network</span>
            <h1 className={styles.title}>All-India Diagnostic Partner Network</h1>
            <p className={styles.subtitle}>
              Expanding accessible, quality diagnostic services beyond local borders through accredited partner laboratories across major Indian metropolitan hubs and tier-2 cities.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Core Pillars */}
        <div className={styles.pillarsGrid}>
          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>
              <Building2 size={24} />
            </div>
            <h3>Accredited Partner Labs</h3>
            <p>
              Collaborating with certified, high-throughput pathology centers adhering to stringent quality control standards.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>
              <Globe2 size={24} />
            </div>
            <h3>Unified Digital Delivery</h3>
            <p>
              Standardized digital reports accessible through WhatsApp and secure web downloads regardless of collection city.
            </p>
          </div>

          <div className={styles.pillarCard}>
            <div className={styles.pillarIcon}>
              <ShieldCheck size={24} />
            </div>
            <h3>Pre-Vetted Pricing</h3>
            <p>
              Transparent partner fees without hidden facility surcharges or surprise billing for remote investigations.
            </p>
          </div>
        </div>

        {/* Coverage Overview */}
        <div className={styles.coverageSection}>
          <div className={styles.coverageHeader}>
            <span className={styles.sectionOverline}>Network Feasibility</span>
            <h2>How Network Service Works for Patients Outside Surat</h2>
          </div>

          <div className={styles.coverageList}>
            <div className={styles.coverageItem}>
              <div className={styles.itemNum}>1</div>
              <div className={styles.itemText}>
                <strong>Submit Your City & PIN Code</strong>
                <p>Fill out the enquiry form below or message our national desk on WhatsApp with your location and required tests.</p>
              </div>
            </div>

            <div className={styles.coverageItem}>
              <div className={styles.itemNum}>2</div>
              <div className={styles.itemText}>
                <strong>Partner Lab Routing & Slot Confirmation</strong>
                <p>Our centralized coordination desk matches your request with our nearest verified partner laboratory.</p>
              </div>
            </div>

            <div className={styles.coverageItem}>
              <div className={styles.itemNum}>3</div>
              <div className={styles.itemText}>
                <strong>Sample Pickup / Walk-In & Digital Reporting</strong>
                <p>Enjoy doorstep collection or expedited priority counter walk-in with swift digital PDF report dispatch.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Section */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <span className={styles.formOverline}>Pan-India Inquiries</span>
              <h2>Request Out-of-Station Diagnostic Coordination</h2>
              <p>Tell us your city and requested tests for immediate feasibility confirmation.</p>
            </div>

            <EnquiryForm
              initialType="all_india_service"
              onSuccess={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
