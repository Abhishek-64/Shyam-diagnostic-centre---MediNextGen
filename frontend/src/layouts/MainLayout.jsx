import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import MobileActionBar from '../components/layout/MobileActionBar.jsx';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main} id="main-content">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}
