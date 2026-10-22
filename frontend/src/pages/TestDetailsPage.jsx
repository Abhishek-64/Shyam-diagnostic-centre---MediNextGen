import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Droplet,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ArrowRight,
  Package,
} from 'lucide-react';
import api from '../services/api.js';
import PriceDisplay from '../components/common/PriceDisplay.jsx';
import WhatsAppButton from '../components/common/WhatsAppButton.jsx';
import Modal from '../components/common/Modal.jsx';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';
import styles from './TestDetailsPage.module.css';

export default function TestDetailsPage() {
  const { slug } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/tests/${slug}`);
        if (res.data?.success) {
          setTest(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Test not found or currently unavailable.');
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p>Loading test information...</p>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: 'var(--color-error)', margin: '0 auto 1rem' }} />
        <h2>Test Unavailable</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/tests" className="btn btn-primary">
          Back to Tests Directory
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.breadcrumbBar}>
        <div className="container">
          <Link to="/tests" className={styles.backLink}>
            <ChevronLeft size={16} /> Back to All Tests
          </Link>
        </div>
      </div>

      <div className="container">
        <div className={styles.detailsGrid}>
          {/* Main info */}
          <div className={styles.mainCol}>
            <div className={styles.headerArea}>
              <div className={styles.badgeRow}>
                {test.category && (
                  <span className={styles.catBadge}>{test.category.name}</span>
                )}
                {test.code && <span className={styles.codeBadge}>Code: {test.code}</span>}
              </div>

              <h1 className={styles.testTitle}>{test.name}</h1>
              {test.shortDescription && <p className={styles.testSubtitle}>{test.shortDescription}</p>}
            </div>

            {/* Quick specifications */}
            <div className={styles.specGrid}>
              <div className={styles.specCard}>
                <Droplet size={20} className={styles.specIcon} />
                <div>
                  <span className={styles.specLabel}>Sample Type</span>
                  <strong className={styles.specVal}>{test.sampleType || 'Whole Blood / Serum'}</strong>
                </div>
              </div>

              <div className={styles.specCard}>
                <Clock size={20} className={styles.specIcon} />
                <div>
                  <span className={styles.specLabel}>Reporting Time</span>
                  <strong className={styles.specVal}>{test.reportingTime || 'Same Day (4–6 Hours)'}</strong>
                </div>
              </div>

              <div className={styles.specCard}>
                <ShieldCheck size={20} className={styles.specIcon} />
                <div>
                  <span className={styles.specLabel}>Home Pickup</span>
                  <strong className={styles.specVal}>
                    {test.isHomeCollectionAvailable ? 'Available at Doorstep' : 'Visit Centre'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Preparation Requirements */}
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>Patient Preparation Instructions</h3>
              <div className={styles.prepCard}>
                <p>
                  {test.preparationInstructions ||
                    'No special preparation required. Water intake is permitted. Continue medications unless directed otherwise by your physician.'}
                </p>
              </div>
            </div>

            {/* Description / Clinical Significance */}
            {test.description && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionHeading}>Clinical Significance & Overview</h3>
                <p className={styles.descText}>{test.description}</p>
              </div>
            )}

            {/* Related Packages */}
            {test.packages && test.packages.length > 0 && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionHeading}>
                  Checkup Packages That Include This Test
                </h3>
                <div className={styles.packagesList}>
                  {test.packages.map((pkg) => (
                    <Link key={pkg.id} to={`/packages/${pkg.slug}`} className={styles.pkgItem}>
                      <Package size={20} className={styles.pkgIcon} />
                      <div className={styles.pkgInfo}>
                        <strong>{pkg.name}</strong>
                        <span>{pkg.subtitle || 'Comprehensive health screen'}</span>
                      </div>
                      <ArrowRight size={16} className={styles.pkgArrow} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Booking Card */}
          <aside className={styles.sideCol}>
            <div className={styles.card}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Test Fee</span>
                <PriceDisplay
                  priceInPaise={test.priceInPaise}
                  originalPriceInPaise={test.discountPriceInPaise}
                  size="lg"
                />
              </div>

              <div className={styles.cardFeatures}>
                <div className={styles.cardFeature}>
                  <CheckCircle2 size={16} className={styles.checkIcon} />
                  <span>Vaccinated, trained phlebotomist</span>
                </div>
                <div className={styles.cardFeature}>
                  <CheckCircle2 size={16} className={styles.checkIcon} />
                  <span>Sealed sterile vacuum tubes</span>
                </div>
                <div className={styles.cardFeature}>
                  <CheckCircle2 size={16} className={styles.checkIcon} />
                  <span>Verified digital PDF report</span>
                </div>
              </div>

              <div className={styles.cardBtns}>
                <button onClick={() => setModalOpen(true)} className={styles.bookBtn}>
                  <Calendar size={18} />
                  <span>Book This Test</span>
                </button>

                <WhatsAppButton
                  phone="8320740996"
                  message={`Hello Shyam Diagnostic, I would like to book the *${test.name}* test.`}
                  label="Inquire via WhatsApp"
                  variant="outline"
                  size="md"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Book Test: ${test.name}`}
      >
        <EnquiryForm
          initialType="test_enquiry"
          initialTestId={test.id}
          itemName={test.name}
          onSuccess={() => {}}
        />
      </Modal>
    </div>
  );
}
