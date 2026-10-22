import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, Activity, ArrowRight, Sparkles } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay.jsx';
import VerificationBadge from '../common/VerificationBadge.jsx';
import WhatsAppButton from '../common/WhatsAppButton.jsx';
import styles from './PackageCard.module.css';

export default function PackageCard({ pkg, onBookClick }) {
  if (!pkg) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badgeRow}>
          {pkg.isFeatured && (
            <span className={styles.featuredBadge}>
              <Sparkles size={11} /> Featured Checkup
            </span>
          )}
          <VerificationBadge isVerified={pkg.priceVerified} />
          {pkg.hasOfferBadge && (
            <span className={styles.specialOfferBadge}>
              <Sparkles size={11} /> Special Offer
            </span>
          )}
          {pkg.parametersCovered > 0 && (
            <span className={styles.paramBadge}>
              <Activity size={12} /> {pkg.parametersCovered}+ Tests
            </span>
          )}
        </div>

        <h3 className={styles.title}>
          <Link to={`/packages/${pkg.slug}`}>{pkg.name}</Link>
        </h3>
        {pkg.subtitle && <p className={styles.subtitle}>{pkg.subtitle}</p>}
      </div>

      <div className={styles.features}>
        {pkg.fastDuration && (
          <div className={styles.featureItem}>
            <Clock size={14} className={styles.featureIcon} />
            <span>{pkg.fastDuration}</span>
          </div>
        )}
        {pkg.reportTime && (
          <div className={styles.featureItem}>
            <ShieldCheck size={14} className={styles.featureIcon} />
            <span>Report: {pkg.reportTime}</span>
          </div>
        )}
      </div>

      <div className={styles.priceSection}>
        <PriceDisplay
          priceInPaise={pkg.priceInPaise}
          originalPriceInPaise={pkg.originalPriceInPaise}
          isVerified={pkg.priceVerified}
          size="md"
        />
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => (onBookClick ? onBookClick(pkg) : null)}
          className={styles.bookBtn}
        >
          Book Home Visit
        </button>

        <WhatsAppButton
          phone="8320740996"
          message={`Hello Shyam Diagnostic, I am interested in booking the *${pkg.name}* package.`}
          variant="iconOnly"
          size="md"
        />

        <Link to={`/packages/${pkg.slug}`} className={styles.detailLink} title="View Package Details">
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
