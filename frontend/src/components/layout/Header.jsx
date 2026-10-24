import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, Calendar, Activity, ChevronRight, Sparkles } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons.jsx';
import ThemeToggle from '../common/ThemeToggle.jsx';
import WhatsAppButton from '../common/WhatsAppButton.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import styles from './Header.module.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Scroll listener for sticky header elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cleanPhone = (settings.phone_number || '8320740996').replace(/\D/g, '');

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* Top quick announcement bar */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <div className={styles.topBarLeft}>
            <span className={styles.pill}>
              <Sparkles size={13} className={styles.pulseIcon} /> 2,000+ Pathology & Diagnostic Tests Available • NABL Quality Standards
            </span>
          </div>
          <div className={styles.topBarRight}>
            <a href={`tel:${cleanPhone}`} className={styles.topContactLink}>
              <Phone size={13} /> Call: {settings.phone_number}
            </a>
            <span className={styles.divider}>•</span>
            <span className={styles.hours}>{settings.business_hours}</span>
            {settings.instagram_url && (
              <>
                <span className={styles.divider}>•</span>
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.topContactLink}
                  title="Follow Shyam Diagnostic on Instagram"
                >
                  <InstagramIcon size={14} />
                </a>
              </>
            )}
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.topContactLink}
                title="Follow Shyam Diagnostic on Facebook"
              >
                <FacebookIcon size={14} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className={`container ${styles.navContainer}`}>
        {/* Brand Logo & Name with official asset logo */}
        <Link to="/" className={styles.brand} title="Shyam Diagnostic Centre & MediNextGen Healthcare">
          <img
            src="/logo.png"
            alt="Shyam Diagnostic Centre & MediNextGen Healthcare Logo"
            className={styles.brandLogoImg}
          />
          <div className={styles.brandText}>
            <span className={styles.brandName}>Shyam Diagnostic</span>
            <span className={styles.brandSub}>MediNextGen Healthcare</span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Focused, Non-overflowing) */}
        <nav className={styles.desktopNav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/packages"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Health Packages
          </NavLink>
          <NavLink
            to="/tests"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <span>2,000+ Tests</span>
            <span className={styles.navTag}>Catalogue</span>
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            About & Founder
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Contact
          </NavLink>
        </nav>

        {/* Header Actions */}
        <div className={styles.headerActions}>
          <ThemeToggle />
          <div className={styles.whatsappWrap}>
            <WhatsAppButton
              phone="8320740996"
              variant="solid"
              size="sm"
              label="WhatsApp"
              message="Hello Shyam Diagnostic Centre, I would like to enquire about diagnostic tests and health packages."
            />
          </div>
          <Link to="/packages" className={styles.bookBtn}>
            <Calendar size={15} />
            <span>Book Checkup</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuToggle}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <nav className={styles.mobileNav}>
            <NavLink to="/" end className={styles.mobileNavLink}>
              <span>Home</span>
              <ChevronRight size={16} />
            </NavLink>
            <NavLink to="/packages" className={styles.mobileNavLink}>
              <span>Health Packages (Full Body, Gold, NCR)</span>
              <ChevronRight size={16} />
            </NavLink>
            <NavLink to="/tests" className={styles.mobileNavLink}>
              <span>2,000+ Tests Directory</span>
              <ChevronRight size={16} />
            </NavLink>
            <NavLink to="/about" className={styles.mobileNavLink}>
              <span>About Us & Founder (Himanshu Kumar)</span>
              <ChevronRight size={16} />
            </NavLink>
            <NavLink to="/contact" className={styles.mobileNavLink}>
              <span>Contact & Lab Address</span>
              <ChevronRight size={16} />
            </NavLink>

            <div className={styles.mobileActions}>
              <Link to="/packages" className={styles.mobileBookBtn}>
                <Calendar size={18} /> View Health Packages
              </Link>
              <WhatsAppButton
                phone={settings.whatsapp_number}
                variant="solid"
                size="md"
                label="Direct WhatsApp Consultation"
                message="Hello Shyam Diagnostic Centre, I would like to enquire about diagnostic test booking."
              />
              <a href={`tel:${cleanPhone}`} className={styles.mobileCallBtn}>
                <Phone size={18} /> Call {settings.phone_number}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
