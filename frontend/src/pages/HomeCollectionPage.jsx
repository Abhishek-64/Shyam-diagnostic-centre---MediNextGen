import React, { useState } from 'react';
import {
  Home,
  ShieldCheck,
  Thermometer,
  Clock,
  Sparkles,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import PinCodeChecker from '../components/forms/PinCodeChecker.jsx';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';
import WhatsAppButton from '../components/common/WhatsAppButton.jsx';
import styles from './HomeCollectionPage.module.css';

export default function HomeCollectionPage() {
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroHeader}>
        <div className="container">
          <div className={styles.heroInner}>
            <span className={styles.overline}>Doorstep Clinical Care</span>
            <h1 className={styles.title}>Safe & Sterile Home Sample Collection</h1>
            <p className={styles.subtitle}>
              Avoid clinic queues, early morning traffic, and fasting delays. Our certified phlebotomists arrive right at your doorstep with cold-chain sample preservation kits.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Step 1: PIN code availability check */}
        <div className={styles.pinSection}>
          <PinCodeChecker onAreaAvailable={(area) => setSelectedArea(area)} />
        </div>

        {/* Hygiene & Clinical Standards Highlights */}
        <div className={styles.standardsGrid}>
          <div className={styles.standardCard}>
            <div className={styles.standardIconBox}>
              <ShieldCheck size={24} />
            </div>
            <h4>Sterile & Single-Use Supplies</h4>
            <p>Sealed vacuum tubes, sterile needles, and alcohol swabs opened in front of the patient.</p>
          </div>

          <div className={styles.standardCard}>
            <div className={styles.standardIconBox}>
              <Thermometer size={24} />
            </div>
            <h4>Active Cold Chain Transport</h4>
            <p>Samples are transferred immediately to temperature-controlled biohazard gel boxes.</p>
          </div>

          <div className={styles.standardCard}>
            <div className={styles.standardIconBox}>
              <Clock size={24} />
            </div>
            <h4>Timely Morning Slots</h4>
            <p>Flexible 7:00 AM – 11:00 AM slots to minimize fasting discomfort for elderly & diabetic patients.</p>
          </div>
        </div>

        {/* Booking Form Card */}
        <div className={styles.bookingSection}>
          <div className={styles.bookingCard}>
            <div className={styles.formHeader}>
              <span className={styles.formOverline}>Direct Appointment</span>
              <h2>Schedule Your Home Visit</h2>
              <p>Fill in your details below and our dispatch coordinator will call to confirm your preferred slot.</p>
            </div>

            <EnquiryForm
              initialType="home_collection"
              onSuccess={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
