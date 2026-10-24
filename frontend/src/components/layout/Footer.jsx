import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../common/SocialIcons.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import WhatsAppButton from '../common/WhatsAppButton.jsx';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings: siteSettings } = useSettings();
  const googleMapUrl = siteSettings.google_maps_url || 'https://maps.app.goo.gl/zqFsm7Lt0qOeluRsy';
  const cleanPhone = (siteSettings.phone_number || '8320740996').replace(/\D/g, '');

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.mainFooter}`}>
        <div className={styles.footerGrid}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <div className={styles.brandHeader}>
              <img
                src="/logo.png"
                alt="Shyam Diagnostic & MediNextGen Logo"
                className={styles.footerLogoImg}
              />
              <div className={styles.brandTitle}>
                <span className={styles.shyam}>Shyam Diagnostic</span>
                <span className={styles.medi}>MediNextGen Healthcare</span>
              </div>
            </div>

            <p className={styles.brandDesc}>
              Trusted diagnostic pathology, 2,000+ tests catalogue, preventive health packages, and rapid digital reporting in Sahibabad, Ghaziabad & Delhi-NCR network.
            </p>

            {/* Social Media Links */}
            <div className={styles.socialRow}>
              {siteSettings.instagram_url && (
                <a
                  href={siteSettings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  title="Follow us on Instagram"
                >
                  <InstagramIcon size={15} />
                  <span>Instagram</span>
                </a>
              )}
              {siteSettings.facebook_url && (
                <a
                  href={siteSettings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  title="Follow us on Facebook"
                >
                  <FacebookIcon size={15} />
                  <span>Facebook</span>
                </a>
              )}
              <WhatsAppButton
                phone={siteSettings.whatsapp_number}
                variant="outline"
                size="sm"
                label="WhatsApp"
              />
            </div>
          </div>

          {/* Contact Details Col */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Laboratory Centre</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <MapPin size={15} className={styles.contactIcon} />
                <div>
                  <span className={styles.addressText}>{siteSettings.business_address}</span>
                  <a
                    href={googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLinkBtn}
                  >
                    View on Maps <ExternalLink size={10} />
                  </a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <Clock size={15} className={styles.contactIcon} />
                <span>{siteSettings.business_hours}</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={15} className={styles.contactIcon} />
                <a href={`tel:${cleanPhone}`}>{siteSettings.phone_number}</a>
              </div>
              <div className={styles.contactItem}>
                <Mail size={15} className={styles.contactIcon} />
                <a href={`mailto:${siteSettings.email_contact}`}>{siteSettings.email_contact}</a>
              </div>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li>
                <Link to="/packages">
                  <ArrowRight size={12} /> Health Packages
                </Link>
              </li>
              <li>
                <Link to="/tests">
                  <ArrowRight size={12} /> 2,000+ Tests Catalogue
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <ArrowRight size={12} /> About Founder
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <ArrowRight size={12} /> Contact & Directions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy">
                  <ArrowRight size={12} /> Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
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
