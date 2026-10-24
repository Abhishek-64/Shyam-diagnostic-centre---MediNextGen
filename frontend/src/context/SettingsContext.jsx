import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const DEFAULT_SETTINGS = {
  whatsapp_number: '8320740996',
  phone_number: '+91 8320740996',
  business_address: 'G 1, Plot no 235, Street Number 4, Om Market, Shyam Park Main, Rajendra Nagar, Sahibabad, Ghaziabad, Uttar Pradesh 201005',
  business_hours: 'Mon – Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 1:00 PM',
  email_contact: 'Info.medinextgenhealthcare@gmail.com',
  home_collection_charges_text: 'Free Home Collection on select packages & central areas',
  home_collection_free_pincodes: '395001,395002,395003,395004,395005,395006,395007,395008,395009',
  instagram_url: 'https://www.instagram.com/shyam.diagnosticscentre?dlrf=ZGM0NmYxcXRiejdj',
  facebook_url: 'https://www.facebook.com/share/1GbwoZYF6Z/',
  google_maps_url: 'https://maps.app.goo.gl/zqFsm7Lt0qOeluRsy',
};

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: false,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('sdc_site_settings');
      if (cached) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(cached) };
      }
    } catch {
      // Ignore JSON parse errors
    }
    return DEFAULT_SETTINGS;
  });
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data?.success && res.data.data) {
        const cleaned = {};
        Object.entries(res.data.data).forEach(([k, v]) => {
          cleaned[k] = typeof v === 'string' ? v.trim() : v;
        });
        const merged = { ...DEFAULT_SETTINGS, ...cleaned };
        setSettings(merged);
        localStorage.setItem('sdc_site_settings', JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('Failed to refresh site settings from API, using cached/default:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
