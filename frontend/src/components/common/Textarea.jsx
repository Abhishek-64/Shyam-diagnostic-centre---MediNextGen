import { forwardRef } from 'react';
import styles from './Textarea.module.css';

const Textarea = forwardRef(function Textarea(
  {
    id,
    label,
    error,
    helperText,
    required = false,
    rows = 4,
    className = '',
    ...rest
  },
  ref
) {
  const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${textareaId}-error` : undefined;

  return (
    <div className={`${styles.group} ${className}`}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        required={required}
        aria-invalid={!!error}
        aria-describedby={errorId || undefined}
        className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
        {...rest}
      />
      {error && (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className={styles.helperText}>{helperText}</p>
      )}
    </div>
  );
});

export default Textarea;
