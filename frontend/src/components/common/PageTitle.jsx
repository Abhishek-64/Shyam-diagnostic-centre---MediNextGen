import styles from './PageTitle.module.css';

/**
 * Reusable page title with optional subtitle and badge.
 */
function PageTitle({ title, subtitle, badge, align = 'left', className = '' }) {
  return (
    <div className={`${styles.wrapper} ${styles[align]} ${className}`}>
      {badge && <span className={styles.badge}>{badge}</span>}
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

export default PageTitle;
