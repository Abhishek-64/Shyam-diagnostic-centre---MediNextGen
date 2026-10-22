import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar.jsx';
import AdminHeader from '../components/layout/AdminHeader.jsx';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.adminMain}>
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
