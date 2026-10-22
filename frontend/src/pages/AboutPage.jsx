import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  Microscope,
  HeartPulse,
  Phone,
  MapPin,
  Building2,
  Clock,
} from 'lucide-react';
import WhatsAppButton from '../components/common/WhatsAppButton.jsx';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.heroHeader}>
        <div className="container">
          <div className={styles.heroInner}>
            <span className={styles.overline}>About Our Centre</span>
            <h1 className={styles.title}>Shyam Diagnostic Centre & MediNextGen Healthcare</h1>
            <p className={styles.subtitle}>
              Dedicated to clinical precision, patient convenience, and dependable pathology diagnostics with rigorous quality control.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Story Section */}
        <div className={styles.storyGrid}>
          <div className={styles.storyContent}>
            <h2>Committed to Diagnostic Excellence Across Delhi-NCR & India</h2>
            <p>
              At <strong>Shyam Diagnostic Centre</strong>, in operational and strategic synergy with <strong>MediNextGen Healthcare</strong>, our founding objective is to make timely, high-precision laboratory diagnostics universally accessible. Headquartered in <strong>Sahibabad, Ghaziabad, Uttar Pradesh</strong>, we provide over <strong>2,000+ pathological, biochemical, and specialized diagnostic tests</strong> backed by certified lab protocols.
            </p>
            <p>
              We integrate automated multi-channel clinical analyzers with daily internal quality controls and peer-reviewed external validation. Each parameter—from routine hemograms and metabolic panels to intricate endocrine assays and cardiac markers—is scrutinized by qualified pathologists and medical biochemists.
            </p>

            <div className={styles.actionRow}>
              <Link to="/packages" className={styles.primaryBtn}>
                <Calendar size={16} /> Explore Health Packages
              </Link>
              <WhatsAppButton
                phone="8320740996"
                variant="outline"
                size="md"
                label="Direct WhatsApp Enquiry"
              />
            </div>
          </div>

          <div className={styles.pillarsCard}>
            <h3>Our Core Commitments</h3>
            <div className={styles.pillarItem}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              <div>
                <strong>Precision Calibration</strong>
                <p>Analyzers are calibrated daily using standardized commercial controls.</p>
              </div>
            </div>

            <div className={styles.pillarItem}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              <div>
                <strong>Single-Use Sterile Protocol</strong>
                <p>100% single-use vacutainers, sterile disposable needles, and biohazard containment.</p>
              </div>
            </div>

            <div className={styles.pillarItem}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              <div>
                <strong>Rapid Digital Delivery</strong>
                <p>Digital PDF test results delivered reliably to your WhatsApp and email within 12–24 hours.</p>
              </div>
            </div>

            <div className={styles.pillarItem}>
              <CheckCircle2 size={18} className={styles.checkIcon} />
              <div>
                <strong>Patient-Centric Transparency</strong>
                <p>Honest test descriptions, pre-vetted prices, and zero hidden facility surcharges.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Leadership & Operations Profile Section */}
        <div className={styles.founderSection}>
          <div className={styles.founderCardWrapper}>
            <div className={styles.founderCard}>
              <div className={styles.founderCrestCol}>
                <div className={styles.crestCircle}>
                  <Award size={48} className={styles.crestIcon} />
                </div>
                <div className={styles.crestBadge}>FOUNDING LEADERSHIP</div>
                <h3 className={styles.crestTitle}>Himanshu Kumar</h3>
                <span className={styles.crestSub}>Operations Specialist</span>
                <div className={styles.crestOrgPill}>
                  <Building2 size={13} />
                  <span>MediNextGen Healthcare</span>
                </div>
              </div>

              <div className={styles.founderInfoCol}>
                <span className={styles.founderBadge}>LEADERSHIP & OPERATIONS PROFILE</span>
                <h2 className={styles.founderName}>Himanshu Kumar</h2>
                <span className={styles.founderRole}>Founder & Executive Operations Specialist</span>
                <p className={styles.founderBio}>
                  A seasoned healthcare operations professional with a proven record of steering robust Direct Selling Agent (DSA) systems, strategic healthcare technology collaborations, and patient coordination services across Delhi-NCR and nationwide.
                </p>
                <p className={styles.founderMission}>
                  Based in <strong>Sahibabad, Ghaziabad, UP</strong>, Himanshu drives the organization's mission to bridge patients and primary care physicians with certified NABL and ICMR accredited pathology laboratories through rapid digital logistics, quality assurance, and uncompromised precision.
                </p>

                <div className={styles.founderMetaGrid}>
                  <div className={styles.founderMetaItem}>
                    <MapPin size={18} className={styles.metaIcon} />
                    <div>
                      <small>Operations Base</small>
                      <strong>Sahibabad, Ghaziabad, UP</strong>
                    </div>
                  </div>
                  <div className={styles.founderMetaItem}>
                    <Phone size={18} className={styles.metaIcon} />
                    <div>
                      <small>Contact Hotline</small>
                      <strong>+91 8320740996</strong>
                    </div>
                  </div>
                  <div className={styles.founderMetaItem}>
                    <ShieldCheck size={18} className={styles.metaIcon} />
                    <div>
                      <small>Diagnostic Quality</small>
                      <strong>NABL & ICMR Partner Protocols</strong>
                    </div>
                  </div>
                  <div className={styles.founderMetaItem}>
                    <Clock size={18} className={styles.metaIcon} />
                    <div>
                      <small>Turnaround Time</small>
                      <strong>Same-Day & 12–24h Reports</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.founderActionRow}>
                  <WhatsAppButton
                    phone="8320740996"
                    label="Chat with Leadership"
                    variant="solid"
                    size="md"
                    message="Hello Mr. Himanshu Kumar, I would like to connect regarding Shyam Diagnostic & MediNextGen Healthcare."
                  />
                  <a href="tel:8320740996" className={styles.founderCallBtn}>
                    <Phone size={15} /> Call: +91 8320740996
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Assurance Features */}
        <div className={styles.qaSection}>
          <div className={styles.qaHeader}>
            <span className={styles.sectionOverline}>Clinical Quality Assurance</span>
            <h2>Our Multi-Tier Quality Protocol</h2>
          </div>

          <div className={styles.qaGrid}>
            <div className={styles.qaCard}>
              <Microscope size={28} className={styles.qaIcon} />
              <h4>Automated Instrumentation</h4>
              <p>
                Eliminating manual transcription errors through direct bidirectional laboratory information system (LIS) interfacing.
              </p>
            </div>

            <div className={styles.qaCard}>
              <ShieldCheck size={28} className={styles.qaIcon} />
              <h4>Barcoded Traceability</h4>
              <p>
                Every sample tube is assigned a unique alphanumeric barcode immediately at bedside to ensure total sample security.
              </p>
            </div>

            <div className={styles.qaCard}>
              <HeartPulse size={28} className={styles.qaIcon} />
              <h4>Pathologist Review</h4>
              <p>
                Abnormal or critical panic values are immediately re-run on backup systems and verified by a medical specialist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
