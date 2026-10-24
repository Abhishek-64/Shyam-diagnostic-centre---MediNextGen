import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';

// Common
import ProtectedAdminRoute from '../components/common/ProtectedAdminRoute.jsx';

// Public Pages
import HomePage from '../pages/HomePage.jsx';
import PackagesPage from '../pages/PackagesPage.jsx';
import PackageDetailsPage from '../pages/PackageDetailsPage.jsx';
import TestsPage from '../pages/TestsPage.jsx';
import TestDetailsPage from '../pages/TestDetailsPage.jsx';
import HomeCollectionPage from '../pages/HomeCollectionPage.jsx';
import AllIndiaServicePage from '../pages/AllIndiaServicePage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage.jsx';
import TermsPage from '../pages/TermsPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminEnquiriesPage from '../pages/admin/AdminEnquiriesPage.jsx';
import AdminPackagesPage from '../pages/admin/AdminPackagesPage.jsx';
import AdminPackageFormPage from '../pages/admin/AdminPackageFormPage.jsx';
import AdminTestsPage from '../pages/admin/AdminTestsPage.jsx';
import AdminTestFormPage from '../pages/admin/AdminTestFormPage.jsx';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage.jsx';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage.jsx';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:slug" element={<PackageDetailsPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/tests/:slug" element={<TestDetailsPage />} />
        <Route path="/home-collection" element={<Navigate to="/packages" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="packages" element={<AdminPackagesPage />} />
        <Route path="packages/new" element={<AdminPackageFormPage />} />
        <Route path="packages/:id/edit" element={<AdminPackageFormPage />} />
        <Route path="tests" element={<AdminTestsPage />} />
        <Route path="tests/new" element={<AdminTestFormPage />} />
        <Route path="tests/:id/edit" element={<AdminTestFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="partners" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="offers" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="service-areas" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="audit-logs" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
