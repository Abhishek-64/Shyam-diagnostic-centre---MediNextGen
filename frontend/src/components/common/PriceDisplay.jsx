import React from 'react';
import styles from './PriceDisplay.module.css';

export default function PriceDisplay({
  priceInPaise,
  originalPriceInPaise,
  isVerified = true,
  size = 'md', // 'sm' | 'md' | 'lg'
  showBadge = true,
}) {
  if (!isVerified || priceInPaise === undefined || priceInPaise === null || priceInPaise === 0) {
    return (
      <div className={`${styles.priceWrapper} ${styles[size]}`}>
        <span className={styles.unverifiedNote}>Price to be confirmed</span>
      </div>
    );
  }

  const price = Math.round(priceInPaise / 100);
  const originalPrice = originalPriceInPaise ? Math.round(originalPriceInPaise / 100) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className={`${styles.priceWrapper} ${styles[size]}`}>
      <span className={styles.currentPrice}>
        <span className={styles.currencySymbol}>₹</span>
        {price.toLocaleString('en-IN')}
      </span>

      {hasDiscount && (
        <>
          <span className={styles.originalPrice}>₹{originalPrice.toLocaleString('en-IN')}</span>
          {showBadge && discountPercentage > 0 && (
            <span className={styles.discountBadge}>{discountPercentage}% OFF</span>
          )}
        </>
      )}
    </div>
  );
}
