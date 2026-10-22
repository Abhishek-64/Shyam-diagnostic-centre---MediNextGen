import React from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search packages, tests, health parameters...',
  className = '',
}) {
  return (
    <div className={`${styles.searchWrapper} ${className}`}>
      <Search size={18} className={styles.searchIcon} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          className={styles.clearBtn}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
