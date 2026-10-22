import styles from './Card.module.css';

/**
 * Reusable Card component.
 */
function Card({ children, className = '', padding = 'md', hoverable = false, ...rest }) {
  return (
    <div
      className={[
        styles.card,
        styles[`padding-${padding}`],
        hoverable ? styles.hoverable : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return <div className={`${styles.cardHeader} ${className}`}>{children}</div>;
}

function CardBody({ children, className = '' }) {
  return <div className={`${styles.cardBody} ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
  return <div className={`${styles.cardFooter} ${className}`}>{children}</div>;
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
