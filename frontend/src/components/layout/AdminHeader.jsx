import React from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';
import styles from './AdminHeader.module.css';

export default function AdminHeader({ onMenuClick }) {
  const { admin, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          onClick={onMenuClick}
          className={styles.menuBtn}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <h2 className={styles.title}>Administration Portal</h2>
      </div>

      <div className={styles.right}>
        <ThemeToggle />

        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            <User size={16} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{admin?.name || 'Administrator'}</span>
            <span className={styles.userRole}>{admin?.role || 'Staff'}</span>
          </div>
        </div>

        <button onClick={logout} className={styles.logoutBtn} title="Log out">
          <LogOut size={18} />
          <span className={styles.logoutText}>Logout</span>
        </button>
      </div>
    </header>
  );
}
