import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import styles from './ScrollToTop.module.css';

/**
 * ScrollToTop
 * 1. Automatically resets window scroll to the top on every route change (SPA navigation).
 * 2. Provides a smooth floating "Back to Top" button when user scrolls down.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // 1. Reset scroll position on route change
  useEffect(() => {
    // If navigating to an anchor hash (e.g. #contact), scroll to that element
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Immediately reset window scroll position
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // Reset document element & body scroll
    if (typeof document !== 'undefined') {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Reset any scrollable main containers
      const mainEl = document.getElementById('main-content') || document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTop = 0;
      }
    }
  }, [pathname, search, hash]);

  // 2. Track scroll distance for floating "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setShowScrollBtn(window.scrollY > 350);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      className={`${styles.backToTopBtn} ${showScrollBtn ? styles.visible : ''}`}
      aria-label="Scroll back to top of page"
      title="Back to Top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
