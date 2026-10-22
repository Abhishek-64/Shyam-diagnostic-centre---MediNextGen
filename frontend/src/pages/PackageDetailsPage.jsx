import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Clock,
  Activity,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ChevronLeft,
  Share2,
  Phone,
} from 'lucide-react';
import api from '../services/api.js';
import PriceDisplay from '../components/common/PriceDisplay.jsx';
import VerificationBadge from '../components/common/VerificationBadge.jsx';
import WhatsAppButton from '../components/common/WhatsAppButton.jsx';
import Modal from '../components/common/Modal.jsx';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';
import styles from './PackageDetailsPage.module.css';

export default function PackageDetailsPage() {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadPackage() {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/packages/${slug}`);
        if (res.data?.success) {
          setPkg(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Package not found or currently unavailable.');
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p>Loading package details...</p>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: 'var(--color-error)', margin: '0 auto 1rem' }} />
        <h2>Package Unavailable</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/packages" className="btn btn-primary">
          Browse All Health Packages
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb Bar */}
      <div className={styles.breadcrumbBar}>
        <div className="container">
          <Link to="/packages" className={styles.backLink}>
            <ChevronLeft size={16} /> Back to All Packages
          </Link>
        </div>
      </div>

      <div className="container">
        <div className={styles.detailsGrid}>
          {/* Main Info Column */}
          <div className={styles.mainCol}>
            <div className={styles.headerArea}>
              <div className={styles.badgeRow}>
                <VerificationBadge isVerified={pkg.priceVerified} />
                {pkg.parametersCovered > 0 && (
                  <span className={styles.paramPill}>
                    <Activity size={14} /> {pkg.parametersCovered}+ Parameters Tested
                  </span>
                )}
              </div>

              <h1 className={styles.packageTitle}>{pkg.name}</h1>
              {pkg.subtitle && <p className={styles.packageSubtitle}>{pkg.subtitle}</p>}
            </div>

            {/* Quick Fact Highlights */}
            <div className={styles.highlightCards}>
              <div className={styles.highlightCard}>
                <Clock size={20} className={styles.highlightIcon} />
                <div>
                  <span className={styles.highlightLabel}>Fasting Required</span>
                  <strong className={styles.highlightVal}>
                    {pkg.fastDuration || '10-12 hours overnight'}
                  </strong>
                </div>
              </div>

              <div className={styles.highlightCard}>
                <ShieldCheck size={20} className={styles.highlightIcon} />
                <div>
                  <span className={styles.highlightLabel}>Report Turnaround</span>
                  <strong className={styles.highlightVal}>{pkg.reportTime || 'Within 24 Hours'}</strong>
                </div>
              </div>

              <div className={styles.highlightCard}>
                <CheckCircle2 size={20} className={styles.highlightIcon} />
                <div>
                  <span className={styles.highlightLabel}>Sample Type</span>
                  <strong className={styles.highlightVal}>Blood & Routine Urine</strong>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>Package Overview</h3>
              <p className={styles.descText}>{pkg.description}</p>
            </div>

            {/* Included Tests List */}
            {pkg.tests && pkg.tests.length > 0 && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionHeading}>
                  Key Tests Included in this Package ({pkg.tests.length})
                </h3>
                <div className={styles.testsList}>
                  {pkg.tests.map((test) => (
                    <div key={test.id} className={styles.testItem}>
                      <CheckCircle2 size={18} className={styles.testIcon} />
                      <div className={styles.testText}>
                        <Link to={`/tests/${test.slug}`} className={styles.testNameLink}>
                          {test.name}
                        </Link>
                        {test.code && <span className={styles.testCode}>({test.code})</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation Guidelines */}
            <div className={styles.prepNotice}>
              <h4>Sample Collection Preparation Guidelines:</h4>
              <ul>
                <li>Maintain 10–12 hours strict fasting before collection (plain water is allowed).</li>
                <li>Avoid strenuous exercise and alcoholic beverages for 24 hours prior.</li>
                <li>Continue vital prescribed medications unless specifically advised by your doctor.</li>
              </ul>
            </div>
          </div>

          {/* Sticky Sidebar Booking Card */}
          <aside className={styles.sideCol}>
            <div className={styles.stickyCard}>
              <div className={styles.priceHeader}>
                <span className={styles.priceLabel}>Package Cost</span>
                <PriceDisplay
                  priceInPaise={pkg.priceInPaise}
                  originalPriceInPaise={pkg.originalPriceInPaise}
                  isVerified={pkg.priceVerified}
                  size="lg"
                />
              </div>

              <div className={styles.cardFeatures}>
                <div className={styles.cardFeature}>
                  <CheckCircle2 size={16} className={styles.featureCheck} />
                  <span>Doorstep phlebotomist sample collection</span>
                </div>
                <div className={styles.cardFeature}>
                  <CheckCircle2 size={16} className={styles.featureCheck} />
                  <span>Vacuum-sealed, barcoded sample handling</span>
                </div>
                <div className={styles.cardFeature}>
                  <CheckCircle2 size={16} className={styles.featureCheck} />
                  <span>Digitally verified PDF report on WhatsApp</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <button onClick={() => setModalOpen(true)} className={styles.bookNowBtn}>
                  <Calendar size={18} />
                  <span>Book Home Visit</span>
                </button>

                <WhatsAppButton
                  phone="8320740996"
                  message={`Hello Shyam Diagnostic, I want to book the *${pkg.name}* health package.`}
                  label="Inquire on WhatsApp"
                  variant="outline"
                  size="md"
                />
              </div>

              <div className={styles.needHelp}>
                <Phone size={14} />
                <span>Call clinical coordinator: </span>
                <a href="tel:8320740996">+91 8320740996</a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Book Package: ${pkg.name}`}
      >
        <EnquiryForm
          initialType="package_booking"
          initialPackageId={pkg.id}
          itemName={pkg.name}
          onSuccess={() => {}}
        />
      </Modal>
    </div>
  );
}
