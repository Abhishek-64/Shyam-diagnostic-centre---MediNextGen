import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldAlert, ArrowRight, Lock, ExternalLink, Heart } from 'lucide-react';
import api from '../../services/api.js';
import WhatsAppButton from '../common/WhatsAppButton.jsx';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteSettings, setSiteSettings] = useState({
    business_address: '235/G1, Gali No. 4, Shyam Park Main, Sahibabad, Ghaziabad, Uttar Pradesh - 201005, India',
    phone_number: '+91 8320740996',
    whatsapp_number: '8320740996',
    email_contact: 'vadoliyaakshy@gmail.com',
    business_hours: 'Mon–Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 1:00 PM',
    google_maps_url: 'https://share.google/zqFsm7Lt0qOeluRsy',
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get('/settings');
        if (res.data?.success && res.data.data) {
          setSiteSettings((prev) => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        // Fallback to initial defaults
      }
    }
    fetchSettings();
  }, []);

  const googleMapUrl = siteSettings.google_maps_url || 'https://share.google/zqFsm7Lt0qOeluRsy';

  return (
    <footer className={styles.footer}>
      {/* Top Banner CTA */}
      {/* <div className={styles.topCta}>
        <div className={`container ${styles.topCtaInner}`}>
          <div className={styles.topCtaText}>
            <h3>Need Help Choosing the Right Pathology Test or Health Package?</h3>
            <p>Our experienced clinical support team is available on WhatsApp & Call for immediate guidance.</p>
          </div>
          <div className={styles.topCtaBtns}>
            <WhatsAppButton
              phone={siteSettings.whatsapp_number}
              variant="solid"
              size="lg"
              label="Chat with Healthcare Expert"
              message="Hello Shyam Diagnostic Centre, I need guidance selecting a diagnostic test/package."
            />
            <a href={`tel:${siteSettings.phone_number.replace(/\D/g, '')}`} className={styles.callCtaBtn}>
              <Phone size={18} /> Call {siteSettings.phone_number}
            </a>
          </div>
        </div>
      </div> */}

      {/* Main Footer Columns */}
      <div className={`container ${styles.mainFooter}`}>
        <div className={styles.footerGrid}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <div className={styles.brandHeader}>
              <img
                src="/logo.svg"
                alt="Shyam Diagnostic & MediNextGen Logo"
                className={styles.footerLogoImg}
              />
              <div className={styles.brandTitle}>
                <span className={styles.shyam}>Shyam Diagnostic</span>
                <span className={styles.medi}>MediNextGen Healthcare</span>
              </div>
            </div>

            <p className={styles.brandDesc}>
              Trusted diagnostic excellence, over 2,000+ pathology test catalogue, preventive full-body health profiles, and rapid digital reporting in Sahibabad, Ghaziabad, Delhi-NCR & All-India network.
            </p>

            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <MapPin size={18} className={styles.contactIcon} />
                <div>
                  <strong>{siteSettings.business_address}</strong>
                  <div className={styles.mapBtnWrap}>
                    <a
                      href={googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mapLinkBtn}
                    >
                      <MapPin size={13} /> View on Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
              <div className={styles.contactItem}>
                <Clock size={18} className={styles.contactIcon} />
                <span>{siteSettings.business_hours}</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={18} className={styles.contactIcon} />
                <a href={`tel:${siteSettings.phone_number.replace(/\D/g, '')}`}>{siteSettings.phone_number}</a>
              </div>
              <div className={styles.contactItem}>
                <Mail size={18} className={styles.contactIcon} />
                <a href={`mailto:${siteSettings.email_contact}`}>{siteSettings.email_contact}</a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Diagnostic Services</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/packages">
                  <ArrowRight size={14} /> Full Body Checkups (92 Tests)
                </Link>
              </li>
              <li>
                <Link to="/packages">
                  <ArrowRight size={14} /> Vitamin Gold Profile (₹999)
                </Link>
              </li>
              <li>
                <Link to="/packages">
                  <ArrowRight size={14} /> Healthy Hearty NCR-Delhi (₹2200)
                </Link>
              </li>
              <li>
                <Link to="/tests">
                  <ArrowRight size={14} /> 2,000+ Pathology Test Catalogue
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <ArrowRight size={14} /> Center Location & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Patient Support */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>About & Administration</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/about">
                  <ArrowRight size={14} /> About Founder (Himanshu Kumar)
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <ArrowRight size={14} /> Our Mission & Vision
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <ArrowRight size={14} /> Reach Our Centre
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy">
                  <ArrowRight size={14} /> Privacy & Data Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions">
                  <ArrowRight size={14} /> Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className={styles.staffLink}>
                  <Lock size={14} /> Staff Portal Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className={styles.disclaimerBox}>
          <ShieldAlert size={20} className={styles.disclaimerIcon} />
          <p className={styles.disclaimerText}>
            <strong>Medical & Diagnostic Notice:</strong> Online inquiries, slot selections, and test information are intended for patient facilitation with Shyam Diagnostic Centre & MediNextGen Healthcare. Diagnostic test reports are issued under NABL / ICMR accredited clinical protocols and should be interpreted by a registered medical practitioner.
          </p>
        </div>

        {/* Bottom Bar with Developer Credit */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {currentYear} Shyam Diagnostic Centre & MediNextGen Healthcare. All rights reserved.
          </p>

          <div className={styles.developerCredit}>
            <span>Developed by </span>
            <a
              href="https://abhishek-varma-portfolio.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.developerLink}
              title="Portfolio of Abhishek Varma"
            >
              Abhishek Varma
            </a>
          </div>

          <div className={styles.bottomLinks}>
            <Link to="/privacy-policy">Privacy</Link>
            <span>•</span>
            <Link to="/terms-and-conditions">Terms</Link>
            <span>•</span>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
