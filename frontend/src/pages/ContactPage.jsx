import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../components/common/SocialIcons.jsx';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';
import WhatsAppButton from '../components/common/WhatsAppButton.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const { settings: siteSettings } = useSettings();
  const googleMapUrl = siteSettings.google_maps_url || 'https://maps.app.goo.gl/zqFsm7Lt0qOeluRsy';

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroHeader}>
        <div className="container">
          <div className={styles.heroInner}>
            <span className={styles.overline}>Patient Support & Helpdesk</span>
            <h1 className={styles.title}>Contact Shyam Diagnostic Centre</h1>
            <p className={styles.subtitle}>
              Have questions regarding home collection, fasting requirements, or specific test reports? We are here to assist you via WhatsApp, telephone, or in-person visit.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.contactGrid}>
          {/* Info cards */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <div className={styles.infoIconBox}>
                <MapPin size={22} />
              </div>
              <div>
                <h3>Centre & Head Office Location</h3>
                <p><strong>Shyam Diagnostic Centre & MediNextGen Healthcare</strong></p>
                <span className={styles.addressLine}>
                  {siteSettings.business_address}
                </span>
                <div style={{ marginTop: '0.65rem' }}>
                  <a
                    href={googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLinkBtn}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.825rem',
                      fontWeight: '700',
                      color: 'var(--color-primary)',
                      textDecoration: 'underline'
                    }}
                  >
                    <MapPin size={15} /> View on Google Maps / Directions <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIconBox}>
                <Clock size={22} />
              </div>
              <div>
                <h3>Operating Hours</h3>
                <p><strong>{siteSettings.business_hours}</strong></p>
                <span className={styles.note}>Pathology sample collection starts early at 7:00 AM</span>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIconBox}>
                <Phone size={22} />
              </div>
              <div>
                <h3>Phone & Emergency Dispatch</h3>
                <p>
                  Direct Call: <a href={`tel:${siteSettings.phone_number.replace(/\D/g, '')}`}>{siteSettings.phone_number}</a>
                </p>
                <div className={styles.waBtnWrap}>
                  <WhatsAppButton
                    phone={siteSettings.whatsapp_number}
                    label="Chat with Helpdesk"
                    variant="solid"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIconBox}>
                <Mail size={22} />
              </div>
              <div>
                <h3>Email Inquiries</h3>
                <p>
                  Official Contact:{' '}
                  <a href={`mailto:${siteSettings.email_contact}`}>{siteSettings.email_contact}</a>
                </p>
              </div>
            </div>

            {(siteSettings.instagram_url || siteSettings.facebook_url) && (
              <div className={styles.infoCard}>
                <div className={styles.infoIconBox}>
                  <InstagramIcon size={22} />
                </div>
                <div>
                  <h3>Official Social Channels</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                    {siteSettings.instagram_url && (
                      <a
                        href={siteSettings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}
                      >
                        <InstagramIcon size={16} /> Instagram <ExternalLink size={12} />
                      </a>
                    )}
                    {siteSettings.facebook_url && (
                      <a
                        href={siteSettings.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}
                      >
                        <FacebookIcon size={16} /> Facebook <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <span className={styles.formOverline}>Direct Messaging</span>
                <h2>Send Us a Message / Request Callback</h2>
                <p>Fill out the form below and our front desk will reply promptly.</p>
              </div>

              <EnquiryForm initialType="general" onSuccess={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
