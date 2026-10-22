import React, { useState, useEffect } from 'react';
import { ShieldCheck, User, Calendar, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import Pagination from '../../components/common/Pagination.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './AdminAuditLogsPage.module.css';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const toast = useToast();

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/audit-logs?page=${page}&limit=20`);
      if (res.data?.success) {
        setLogs(res.data.data.items || []);
        setMeta(res.data.data.meta || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Audit Trail</h1>
        <p className={styles.subtitle}>
          Immutable security and compliance log of all administrative actions, catalog modifications, and verification events.
        </p>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Staff / Admin</th>
                <th>Action Taken</th>
                <th>Target Entity</th>
                <th>Event Payload Details</th>
                <th>Client IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className={styles.dateCell}>
                      {new Date(log.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td>
                      <div className={styles.userBadge}>
                        <strong>{log.adminUser?.name || 'System / Automated'}</strong>
                        <div style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                          {log.adminUser?.email || ''}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.actionTag}>{log.action}</span>
                    </td>
                    <td>
                      <span className={styles.entityBadge}>
                        {log.entityType} #{log.entityId}
                      </span>
                    </td>
                    <td>
                      <code className={styles.detailsCode} title={JSON.stringify(log.details)}>
                        {JSON.stringify(log.details || {})}
                      </code>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      {log.ipAddress || 'Internal'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No audit records recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
