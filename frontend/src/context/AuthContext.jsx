import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = sessionStorage.getItem('sdc_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('sdc_admin_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Sync Axios authorization header whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      sessionStorage.setItem('sdc_admin_token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      sessionStorage.removeItem('sdc_admin_token');
    }
  }, [token]);

  // Check current session on initial load
  useEffect(() => {
    async function checkAuth() {
      try {
        if (token) {
          const res = await api.get('/admin/auth/me');
          if (res.data?.success) {
            setAdmin(res.data.data);
            sessionStorage.setItem('sdc_admin_user', JSON.stringify(res.data.data));
          }
        }
      } catch {
        setAdmin(null);
        setToken(null);
        sessionStorage.removeItem('sdc_admin_user');
        sessionStorage.removeItem('sdc_admin_token');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = (authToken, adminData) => {
    setToken(authToken);
    setAdmin(adminData);
    sessionStorage.setItem('sdc_admin_token', authToken);
    sessionStorage.setItem('sdc_admin_user', JSON.stringify(adminData));
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const logout = async () => {
    try {
      await api.post('/admin/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      setAdmin(null);
      setToken(null);
      sessionStorage.removeItem('sdc_admin_token');
      sessionStorage.removeItem('sdc_admin_user');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
