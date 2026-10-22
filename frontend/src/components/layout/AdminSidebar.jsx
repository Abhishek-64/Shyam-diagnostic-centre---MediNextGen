import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Package,
  FlaskConical,
  Tags,
  Percent,
  MapPin,
  Building2,
  Settings,
  History,
  ExternalLink,
  Activity,
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

export default function AdminSidebar({ isOpen, onClose }) {
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Patient Enquiries', path: '/admin/enquiries', icon: Inbox },
    { label: 'Health Packages', path: '/admin/packages', icon: Package },
    { label: 'Tests Directory', path: '/admin/tests', icon: FlaskConical },
    { label: 'Test Categories', path: '/admin/categories', icon: Tags },
    { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && <div className={styles.backdrop} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <Activity size={20} />
          </div>
          <div className={styles.brandMeta}>
            <span className={styles.name}>SDC Admin</span>
            <span className={styles.role}>Management Console</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <Icon size={18} className={styles.itemIcon} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <Link to="/" target="_blank" className={styles.publicSiteLink}>
            <span>View Public Website</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </aside>
    </>
  );
}
