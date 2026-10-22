import { forwardRef } from 'react';
import styles from './Input.module.css';

/**
 * Reusable Input component with label, error, and helper text.
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    type = 'text',
    error,
    helperText,
    required = false,
    className = '',
    ...rest
  },
  ref
) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`${styles.group} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={errorId || undefined}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
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

export default Input;
