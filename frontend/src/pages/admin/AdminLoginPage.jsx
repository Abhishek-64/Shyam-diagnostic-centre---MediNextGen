import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Activity, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../../components/common/ThemeToggle.jsx';
import styles from './AdminLoginPage.module.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/admin/auth/login', {
        email: email.trim(),
        password,
      });

      if (res.data?.success) {
        const { token, admin } = res.data.data;
        login(token, admin);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.topBar}>
        <ThemeToggle />
      </div>

      <div className={styles.loginBox}>
        <div className={styles.header}>
          <div className={styles.iconBox}>
            <Activity size={28} />
          </div>
          <h1 className={styles.title}>Administration Portal</h1>
          <p className={styles.subtitle}>
            Shyam Diagnostic Centre & MediNextGen Healthcare
          </p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={18} className={styles.errorIcon} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Admin Email Address</label>
            <div className={styles.inputWrap}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shyamdiagnostic.com"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading ? (
              <>
                <Loader2 size={18} className={styles.spin} />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className={styles.footerNote}>
          <span>🔒 Authorized clinical staff only. Activity is audited.</span>
        </div>
      </div>
    </div>
  );
}
