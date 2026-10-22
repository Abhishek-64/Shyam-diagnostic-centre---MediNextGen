import styles from './EmptyState.module.css';

/**
 * Empty state component for when data is unavailable.
 */
function EmptyState({ icon = '📭', title = 'Nothing here yet', description, action }) {
  return (
    <div className={styles.wrapper} role="status">
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

export default EmptyState;
