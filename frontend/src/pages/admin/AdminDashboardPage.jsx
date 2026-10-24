import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Package,
  FlaskConical,
  Percent,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Users,
} from 'lucide-react';
import api from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import styles from './AdminDashboardPage.module.css';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [statsRes, analyticsRes] = await Promise.allSettled([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/analytics/overview'),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.data?.success) {
          setData(statsRes.value.data.data);
        }
        if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data?.success) {
          setAnalytics(analyticsRes.value.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <LoadingSpinner variant="center" label="Loading operational dashboard & patient stats…" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentEnquiries = data?.recentEnquiries || [];
  const trafficSummary = analytics?.summary || {};

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Operational Overview</h1>
          <p className={styles.subtitle}>
            Real-time patient bookings, catalogue publication status, and enquiry pipeline.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link to="/admin/packages/new" className={styles.actionBtn}>
            <Plus size={16} /> New Package
          </Link>
          <Link to="/admin/tests/new" className={styles.secondaryActionBtn}>
            <Plus size={16} /> New Test
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Pending Enquiries</span>
            <div className={`${styles.iconWrap} ${styles.warningIcon}`}>
              <Clock size={20} />
            </div>
          </div>
          <span className={styles.statNumber}>{stats.pendingEnquiries ?? 0}</span>
          <span className={styles.statSub}>Requires staff contact & scheduling</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Today's New Bookings</span>
            <div className={`${styles.iconWrap} ${styles.blueIcon}`}>
              <Inbox size={20} />
            </div>
          </div>
          <span className={styles.statNumber}>{stats.newEnquiriesToday ?? 0}</span>
          <span className={styles.statSub}>Total: {stats.totalEnquiries ?? 0} registered</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Verified Packages</span>
            <div className={`${styles.iconWrap} ${styles.greenIcon}`}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <span className={styles.statNumber}>
            {stats.verifiedPackages ?? 0} / {stats.totalPackages ?? 0}
          </span>
          <span className={styles.statSub}>
            {stats.publishedPackages ?? 0} live on website
          </span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Diagnostic Tests</span>
            <div className={`${styles.iconWrap} ${styles.purpleIcon}`}>
              <FlaskConical size={20} />
            </div>
          </div>
          <span className={styles.statNumber}>{stats.totalTests ?? 0}</span>
          <span className={styles.statSub}>{stats.activeOffers ?? 0} active discount offers</span>
        </div>

        <Link
          to="/admin/analytics"
          className={styles.statCard}
          style={{ textDecoration: 'none', cursor: 'pointer' }}
          title="Click to view full visitor analytics"
        >
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Today's Unique Visitors</span>
            <div className={`${styles.iconWrap} ${styles.blueIcon}`}>
              <Users size={20} />
            </div>
          </div>
          <span className={styles.statNumber}>{trafficSummary.todayUniqueVisitors ?? 0}</span>
          <span className={styles.statSub}>
            {trafficSummary.todayViews ?? 0} views today • View Analytics →
          </span>
        </Link>
      </div>

      {/* Recent Enquiries Table Section */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}>
          <div>
            <h3>Recent Patient Bookings & Enquiries</h3>
            <p>Most recent patient requests submitted via website or phone</p>
          </div>
          <Link to="/admin/enquiries" className={styles.viewAllBtn}>
            View All Enquiries <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ref Number</th>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>PIN Code</th>
                <th>Enquiry Type</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.length > 0 ? (
                recentEnquiries.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <Link to={`/admin/enquiries?id=${enq.id}`} className={styles.refLink}>
                        {enq.referenceNumber}
                      </Link>
                    </td>
                    <td className={styles.patientName}>{enq.fullName}</td>
                    <td>
                      <a href={`tel:${enq.phone}`} className={styles.phoneLink}>
                        {enq.phone}
                      </a>
                    </td>
                    <td>{enq.pinCode}</td>
                    <td>
                      <span className={styles.typeBadge}>
                        {enq.enquiryType.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[enq.status]}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.noData}>
                    No recent enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
