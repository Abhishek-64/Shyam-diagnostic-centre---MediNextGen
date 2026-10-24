import React, { useState, useEffect } from 'react';
import { Save, Loader2, Phone, MessageSquare, MapPin, Clock, Mail, ShieldAlert, Share2, Globe } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../../components/common/SocialIcons.jsx';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import styles from './AdminSettingsPage.module.css';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsMap, setSettingsMap] = useState({});

  const toast = useToast();
  const { refreshSettings } = useSettings();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/settings');
      if (res.data?.success) {
        const map = {};
        (res.data.data || []).forEach((s) => {
          map[s.settingKey] = s.settingValue;
        });
        setSettingsMap(map);
      }
    } catch (err) {
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettingsMap((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Update each key via PUT /admin/settings/:key
      const keys = Object.keys(settingsMap);
      for (const k of keys) {
        await api.put(`/admin/settings/${k}`, {
          settingValue: settingsMap[k],
        });
      }
      await refreshSettings();
      toast.success('System settings saved successfully');
    } catch (err) {
      toast.error('Failed to save some settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Loader2 className="spin" size={32} />
        <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>
          Loading system configurations...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Settings & Configuration</h1>
        <p className={styles.subtitle}>
          Manage primary business channels, WhatsApp integration numbers, and operational information.
        </p>
      </div>

      <form onSubmit={handleSave} className={styles.settingsCard}>
        {/* Contact & WhatsApp */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <MessageSquare size={18} color="var(--color-primary)" />
            <h3 className={styles.sectionTitle}>Direct Communication Channels</h3>
          </div>
          <p className={styles.sectionDesc}>
            These phone numbers power the floating WhatsApp button, header hotlines, and quick booking triggers.
          </p>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>
                WhatsApp Business Number (10 digits)
              </label>
              <input
                type="text"
                value={settingsMap.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="e.g. 8320740996"
                className={styles.input}
              />
              <span className={styles.settingMeta}>
                Currently: <strong>{settingsMap.whatsapp_number || '8320740996'}</strong> (Client confirmation pending before marketing rollout)
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Reception / Phone Helpline</label>
              <input
                type="text"
                value={settingsMap.phone_number || ''}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                placeholder="e.g. 8320740996"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Official Support Email Address</label>
            <input
              type="email"
              value={settingsMap.email_contact || ''}
              onChange={(e) => handleChange('email_contact', e.target.value)}
              placeholder="e.g. contact@shyamdiagnostic.com"
              className={styles.input}
            />
          </div>
        </div>

        {/* Operating Hours & Physical Location */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Clock size={18} color="var(--color-primary)" />
            <h3 className={styles.sectionTitle}>Operating Hours & Centre Location</h3>
          </div>
          <p className={styles.sectionDesc}>
            Displayed in the main footer, contact page, and patient information sections.
          </p>

          <div className={styles.field}>
            <label className={styles.label}>Operating Hours Description</label>
            <input
              type="text"
              value={settingsMap.business_hours || ''}
              onChange={(e) => handleChange('business_hours', e.target.value)}
              placeholder="Mon – Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 1:00 PM"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Diagnostic Centre Address</label>
            <textarea
              value={settingsMap.business_address || ''}
              onChange={(e) => handleChange('business_address', e.target.value)}
              rows={3}
              placeholder="Shyam Diagnostic Centre & MediNextGen Healthcare, Surat, Gujarat, India"
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Home Collection Messaging */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <MapPin size={18} color="var(--color-primary)" />
            <h3 className={styles.sectionTitle}>Home Sample Collection Logistics</h3>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Home Collection Highlight Banner</label>
            <input
              type="text"
              value={settingsMap.home_collection_charges_text || ''}
              onChange={(e) => handleChange('home_collection_charges_text', e.target.value)}
              placeholder="Free Home Collection on select packages & central areas"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Free Home Collection PIN Codes (Comma Separated)</label>
            <input
              type="text"
              value={settingsMap.home_collection_free_pincodes || ''}
              onChange={(e) => handleChange('home_collection_free_pincodes', e.target.value)}
              placeholder="395001,395002,395003"
              className={styles.input}
            />
            <span className={styles.settingMeta}>
              Patients booking from these PINs receive complimentary sample pickup.
            </span>
          </div>
        </div>

        {/* Social Media & External Channels (Editable) */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Share2 size={18} color="var(--color-primary)" />
            <h3 className={styles.sectionTitle}>Social Media & Map Links (Public Portal)</h3>
          </div>
          <p className={styles.sectionDesc}>
            These official links appear in the website footer, contact page, and communication links.
          </p>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>
                <InstagramIcon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Instagram Official Profile URL
              </label>
              <input
                type="url"
                value={settingsMap.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://www.instagram.com/shyam.diagnosticscentre?..."
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <FacebookIcon size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Facebook Official Page URL
              </label>
              <input
                type="url"
                value={settingsMap.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                placeholder="https://www.facebook.com/share/..."
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <Globe size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Google Maps Location Link
            </label>
            <input
              type="url"
              value={settingsMap.google_maps_url || ''}
              onChange={(e) => handleChange('google_maps_url', e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="spin" size={16} /> Saving Configurations...
              </>
            ) : (
              <>
                <Save size={16} /> Save All Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
