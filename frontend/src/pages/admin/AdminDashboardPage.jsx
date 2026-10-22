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
} from 'lucide-react';
import api from '../../services/api.js';
import styles from './AdminDashboardPage.module.css';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard/stats');
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = data?.stats || {};
  const recentEnquiries = data?.recentEnquiries || [];

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
