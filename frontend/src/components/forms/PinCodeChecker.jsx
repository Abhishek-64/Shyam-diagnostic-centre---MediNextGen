import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import WhatsAppButton from '../common/WhatsAppButton.jsx';
import styles from './PinCodeChecker.module.css';

export default function PinCodeChecker({ onAreaAvailable }) {
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const clean = pinCode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setError('Please enter a valid 6-digit Indian PIN code (e.g., 395001).');
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/service-areas/check?pinCode=${clean}`);
      if (res.data?.success) {
        setResult(res.data.data);
        if (res.data.data.available && onAreaAvailable) {
          onAreaAvailable(res.data.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to verify PIN code right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkerCard}>
      <div className={styles.header}>
        <div className={styles.pinIconBox}>
          <MapPin size={22} />
        </div>
        <div>
          <h4 className={styles.title}>Check Home Collection Availability</h4>
          <p className={styles.subtitle}>
            Enter your 6-digit postal PIN code to verify phlebotomist home pickup
          </p>
        </div>
      </div>

      <form onSubmit={handleCheck} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            maxLength={6}
            value={pinCode}
            onChange={(e) => {
              setPinCode(e.target.value.replace(/\D/g, ''));
              if (error) setError('');
            }}
            placeholder="e.g. 395001"
            className={styles.input}
          />
          <button type="submit" disabled={loading} className={styles.checkBtn}>
            {loading ? <Loader2 size={16} className={styles.spin} /> : 'Check PIN'}
          </button>
        </div>
      </form>

      {error && <div className={styles.errorMsg}>{error}</div>}

      {result && (
        <div
          className={`${styles.resultBox} ${
            result.available ? (result.isFreeHomeCollection ? styles.successFree : styles.success) : styles.unmapped
          }`}
        >
          {result.available ? (
            <div className={styles.resultInner}>
              <CheckCircle2 size={22} className={styles.resultIcon} />
              <div className={styles.resultText}>
                <strong>{result.isFreeHomeCollection ? 'Free Home Collection Available!' : 'Home Collection Available!'}</strong>
                <p>{result.message}</p>
                {result.areaName && (
                  <span className={styles.areaTag}>
                    {result.areaName}, {result.city}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.resultInner}>
              <Info size={22} className={styles.unmappedIcon} />
              <div className={styles.resultText}>
                <strong>Service Not Automated for PIN {result.pinCode}</strong>
                <p>{result.message}</p>
                <div className={styles.unmappedCta}>
                  <WhatsAppButton
                    phone="8320740996"
                    message={`Hello, I would like to check home sample pickup feasibility for PIN code: ${result.pinCode}.`}
                    variant="solid"
                    size="sm"
                    label="Ask on WhatsApp"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
