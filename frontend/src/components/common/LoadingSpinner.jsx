import React from 'react';
import { Activity } from 'lucide-react';
import styles from './LoadingSpinner.module.css';

/**
 * Branded Medical Theme Loading Component for Shyam Diagnostic & MediNextGen.
 * Supports center, page, inline, and table-cell display modes.
 */
export default function LoadingSpinner({
  size = 'md',
  label = 'Loading laboratory data…',
  sublabel = 'Please wait while we connect to Shyam Diagnostic database',
  variant = 'center',
  colSpan,
}) {
  if (variant === 'table' && colSpan) {
    return (
      <tr>
        <td colSpan={colSpan} className={styles.tableCell}>
          <div className={styles.tableInner}>
            <div className={styles.spinnerRing}>
              <Activity className={styles.pulseIcon} size={20} />
            </div>
            <span className={styles.tableLabel}>{label}</span>
          </div>
        </td>
      </tr>
    );
  }

  const wrapperClass = [
    styles.wrapper,
    variant === 'page' ? styles.page : '',
    variant === 'center' ? styles.center : '',
    variant === 'inline' ? styles.inline : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass} role="status" aria-live="polite">
      <div className={`${styles.spinnerContainer} ${styles[size]}`}>
        <div className={styles.outerGlow} />
        <div className={styles.spinnerRing} />
        <div className={styles.innerCore}>
          <Activity className={styles.pulseIcon} size={size === 'lg' ? 22 : size === 'sm' ? 14 : 18} />
        </div>
      </div>
      {label && (
        <div className={styles.labelGroup}>
          <span className={styles.label}>{label}</span>
          {sublabel && variant !== 'inline' && (
            <span className={styles.sublabel}>{sublabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
