import React, { useState, useEffect } from 'react';
import {
  Users,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  RefreshCw,
  TrendingUp,
  Clock,
  Compass,
} from 'lucide-react';
import api from '../../services/api.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import styles from './AdminAnalyticsPage.module.css';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      const res = await api.get('/admin/analytics/overview');
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <LoadingSpinner variant="center" label="Aggregating live visitor traffic & analytics…" />
      </div>
    );
  }

  const summary = data?.summary || {};
  const topPages = data?.topPages || [];
  const deviceBreakdown = data?.deviceBreakdown || [];
  const recentActivity = data?.recentActivity || [];
  const dailyViews = data?.dailyViews || [];

  const totalDeviceCount = deviceBreakdown.reduce((acc, curr) => acc + parseInt(curr.count, 10), 0) || 1;

  const getDeviceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'mobile':
        return <Smartphone size={18} />;
      case 'tablet':
        return <Tablet size={18} />;
      default:
        return <Monitor size={18} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Visitor Traffic & Unique User Analytics</h1>
          <p className={styles.subtitle}>
            Monitor patient traffic, identify unique visitors, and track most viewed diagnostic services in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className={styles.refreshBtn}
        >
          <RefreshCw size={16} className={refreshing ? styles.spin : ''} />
          <span>{refreshing ? 'Updating…' : 'Refresh Traffic'}</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Today's Unique Visitors</span>
            <div className={`${styles.iconWrap} ${styles.blueIcon}`}>
              <Users size={22} />
            </div>
          </div>
          <span className={styles.statNumber}>{summary.todayUniqueVisitors ?? 0}</span>
          <span className={styles.statSub}>Distinct patients checked our website today</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Today's Total Pageviews</span>
            <div className={`${styles.iconWrap} ${styles.greenIcon}`}>
              <Eye size={22} />
            </div>
          </div>
          <span className={styles.statNumber}>{summary.todayViews ?? 0}</span>
          <span className={styles.statSub}>Total pages browsed across all visits</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>All-Time Unique Visitors</span>
            <div className={`${styles.iconWrap} ${styles.purpleIcon}`}>
              <Globe size={22} />
            </div>
          </div>
          <span className={styles.statNumber}>{summary.totalUniqueVisitors ?? 0}</span>
          <span className={styles.statSub}>Cumulative unique patient devices logged</span>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>All-Time Pageviews</span>
            <div className={`${styles.iconWrap} ${styles.amberIcon}`}>
              <TrendingUp size={22} />
            </div>
          </div>
          <span className={styles.statNumber}>{summary.totalViews ?? 0}</span>
          <span className={styles.statSub}>Cumulative catalogue interactions</span>
        </div>
      </div>

      {/* 2-Column Section: Top Visited Pages & Device Breakdown */}
      <div className={styles.dualGrid}>
        {/* Top Visited Pages */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrap}>
              <Compass size={18} className={styles.tealIcon} />
              <h3>Top Visited Pages</h3>
            </div>
            <span className={styles.cardBadge}>{topPages.length} Routes</span>
          </div>

          <div className={styles.pagesList}>
            {topPages.length > 0 ? (
              topPages.map((p, idx) => {
                const maxViews = Math.max(...topPages.map((item) => parseInt(item.views, 10)), 1);
                const pct = Math.round((parseInt(p.views, 10) / maxViews) * 100);
                return (
                  <div key={idx} className={styles.pageItem}>
                    <div className={styles.pageMeta}>
                      <span className={styles.pageRank}>#{idx + 1}</span>
                      <strong className={styles.pagePath}>{p.path === '/' ? '/ (Home)' : p.path}</strong>
                      <span className={styles.pageHits}>{p.views} views</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.emptyText}>No page views recorded yet.</p>
            )}
          </div>
        </div>

        {/* Device Distribution */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWrap}>
              <Smartphone size={18} className={styles.blueIconText} />
              <h3>Visitor Device Breakdown</h3>
            </div>
          </div>

          <div className={styles.deviceList}>
            {deviceBreakdown.length > 0 ? (
              deviceBreakdown.map((d, idx) => {
                const pct = Math.round((parseInt(d.count, 10) / totalDeviceCount) * 100);
                return (
                  <div key={idx} className={styles.deviceItem}>
                    <div className={styles.deviceIconBox}>{getDeviceIcon(d.deviceType)}</div>
                    <div className={styles.deviceInfo}>
                      <div className={styles.deviceMeta}>
                        <strong className={styles.deviceName}>{d.deviceType}</strong>
                        <span className={styles.deviceCount}>
                          {d.count} visits ({pct}%)
                        </span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFillDevice}
                          style={{
                            width: `${pct}%`,
                            background:
                              d.deviceType === 'Mobile'
                                ? '#10b981'
                                : d.deviceType === 'Tablet'
                                ? '#8b5cf6'
                                : '#0284c7',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.emptyText}>No device metrics recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Live Activity Stream */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleWrap}>
            <Clock size={18} className={styles.purpleIconText} />
            <h3>Live Visitor Activity Stream</h3>
          </div>
          <span className={styles.cardBadge}>Last 15 Hits</span>
        </div>

        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Visitor ID</th>
                <th>Page Visited</th>
                <th>Device</th>
                <th>Browser</th>
                <th>Operating System</th>
                <th>Referrer</th>
                <th style={{ textAlign: 'right' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <code className={styles.visitorCode}>
                        {item.visitorId.length > 14
                          ? `${item.visitorId.slice(0, 12)}…`
                          : item.visitorId}
                      </code>
                    </td>
                    <td>
                      <strong className={styles.tablePath}>
                        {item.path === '/' ? '/ (Home)' : item.path}
                      </strong>
                    </td>
                    <td>
                      <span className={styles.deviceTag}>
                        {getDeviceIcon(item.deviceType)} {item.deviceType}
                      </span>
                    </td>
                    <td>{item.browser || 'Unknown'}</td>
                    <td>{item.os || 'Unknown'}</td>
                    <td className={styles.referrerCell}>
                      {item.referrer ? item.referrer.replace(/^https?:\/\//, '') : 'Direct Visit'}
                    </td>
                    <td style={{ textAlign: 'right' }} className={styles.timeCell}>
                      {new Date(item.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.emptyText} style={{ textAlign: 'center' }}>
                    No visitor records found. As users browse the website, real-time events appear here.
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
