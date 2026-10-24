import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Clock, ArrowRight } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import styles from './TestCard.module.css';

export default function TestCard({ test, onEnquireClick }) {
  const { settings } = useSettings();
  if (!test) return null;

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {test.category && <span className={styles.categoryBadge}>{test.category.name}</span>}
          {test.hasOfferBadge && <span className={styles.offerBadge}>Offer</span>}
        </div>
        {test.code && <span className={styles.codeBadge}>{test.code}</span>}
      </div>

      <h4 className={styles.title}>
        <Link to={`/tests/${test.slug}`}>{test.name}</Link>
      </h4>

      {test.shortDescription && <p className={styles.desc}>{test.shortDescription}</p>}

      <div className={styles.metaRow}>
        {test.showSampleType !== false && test.sampleType && (
          <div className={styles.metaItem}>
            <Droplet size={13} className={styles.metaIcon} />
            <span>{test.sampleType}</span>
          </div>
        )}
        {test.showReportingTime !== false && test.reportingTime && (
          <div className={styles.metaItem}>
            <Clock size={13} className={styles.metaIcon} />
            <span>{test.reportingTime}</span>
          </div>
        )}
      </div>

      <div className={styles.priceRow}>
        {test.showPriceOnWebsite !== false ? (
          <PriceDisplay
            priceInPaise={test.priceInPaise}
            originalPriceInPaise={test.discountPriceInPaise}
            size="sm"
          />
        ) : (
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            Contact Centre for Rate
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => (onEnquireClick ? onEnquireClick(test) : null)}
          className={styles.enquireBtn}
        >
          Book / Enquire
        </button>

        <WhatsAppButton
          phone={settings.whatsapp_number}
          message={`Hello Shyam Diagnostic, I would like to book the *${test.name}* test.`}
          variant="iconOnly"
          size="sm"
        />

        <Link to={`/tests/${test.slug}`} className={styles.detailBtn} title="View test preparation details">
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
