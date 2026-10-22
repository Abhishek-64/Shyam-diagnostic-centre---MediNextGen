import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import styles from './VerificationBadge.module.css';

export default function VerificationBadge({ isVerified, verifiedText = 'Verified Package', unverifiedText = 'Pending Verification' }) {
  if (isVerified) {
    return (
      <span className={`${styles.badge} ${styles.verified}`} title="Package parameters and pricing confirmed">
        <ShieldCheck size={14} />
        <span>{verifiedText}</span>
      </span>
    );
  }

  return (
    <span className={`${styles.badge} ${styles.unverified}`} title="Details pending final verification">
      <HelpCircle size={14} />
      <span>{unverifiedText}</span>
    </span>
  );
}
