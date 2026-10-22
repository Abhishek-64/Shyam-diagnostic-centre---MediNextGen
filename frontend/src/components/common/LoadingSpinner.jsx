import styles from './LoadingSpinner.module.css';

/**
 * Loading spinner for async operations.
 */
function LoadingSpinner({ size = 'md', label = 'Loading…', center = false }) {
  return (
    <div
      className={[styles.wrapper, center ? styles.center : ''].filter(Boolean).join(' ')}
      role="status"
      aria-label={label}
    >
      <span className={`${styles.spinner} ${styles[size]}`} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
