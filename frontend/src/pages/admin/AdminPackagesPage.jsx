import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  ShieldCheck,
  Globe,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import api from '../../services/api.js';
import PriceDisplay from '../../components/common/PriceDisplay.jsx';
import VerificationBadge from '../../components/common/VerificationBadge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import BulkCsvModal from '../../components/common/BulkCsvModal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './AdminPackagesPage.module.css';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [showCsvModal, setShowCsvModal] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const fetchPackages = async () => {
    try {
      setLoading(true);
      let url = `/admin/packages?page=${page}&limit=12`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setPackages(res.data.data.items || []);
        setMeta(res.data.data.meta || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [page, search]);

  const handleVerify = async (id, name) => {
    try {
      const res = await api.patch(`/admin/packages/${id}/verify`);
      if (res.data?.success) {
        toast.success(`Package "${name}" verified! It can now be published.`);
        fetchPackages();
      }
    } catch (err) {
      toast.error('Failed to verify package');
    }
  };

  const handleTogglePublish = async (id, currentPublished, priceVerified) => {
    if (!currentPublished && !priceVerified) {
      toast.error('Cannot publish an unverified package. Click "Verify" first.');
      return;
    }

    try {
      const res = await api.patch(`/admin/packages/${id}/publish`, {
        isPublished: !currentPublished,
      });
      if (res.data?.success) {
        toast.success(
          !currentPublished ? 'Package published to public website!' : 'Package moved to draft'
        );
        fetchPackages();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update publication status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete package "${name}"?`)) return;
    try {
      const res = await api.delete(`/admin/packages/${id}`);
      if (res.data?.success) {
        toast.success(`Package "${name}" deleted`);
        fetchPackages();
      }
    } catch (err) {
      toast.error('Failed to delete package');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Health Checkup Packages</h1>
          <p className={styles.subtitle}>
            Manage preventive health profiles, verified clinical pricing, and public visibility.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowCsvModal(true)}
            className={styles.verifyBtn}
            style={{ padding: '0.65rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Upload size={16} /> Bulk Import (CSV)
          </button>
          <Link to="/admin/packages/new" className={styles.createBtn}>
            <Plus size={16} /> Create New Package
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchBarRow}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search packages by name or subtitle..."
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Packages Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Package Name</th>
                <th>Parameters</th>
                <th>Price</th>
                <th>Price Verification</th>
                <th>Public Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingSpinner variant="table" colSpan={6} label="Loading health packages database…" />
              ) : packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td>
                      <strong className={styles.pkgName}>{pkg.name}</strong>
                      <span className={styles.pkgSlug}>/{pkg.slug}</span>
                    </td>
                    <td>
                      <span className={styles.paramTag}>
                        {pkg.parametersCovered > 0 ? `${pkg.parametersCovered}+ Tests` : 'Unspecified'}
                      </span>
                    </td>
                    <td>
                      <PriceDisplay
                        priceInPaise={pkg.priceInPaise}
                        originalPriceInPaise={pkg.originalPriceInPaise}
                        isVerified={pkg.priceVerified}
                        size="sm"
                      />
                    </td>
                    <td>
                      <div className={styles.verifyCol}>
                        <VerificationBadge isVerified={pkg.priceVerified} />
                        {!pkg.priceVerified && (
                          <button
                            onClick={() => handleVerify(pkg.id, pkg.name)}
                            className={styles.verifyActionBtn}
                            title="Verify price with lab directors"
                          >
                            Verify Now
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleTogglePublish(pkg.id, pkg.isPublished, pkg.priceVerified)}
                        className={`${styles.statusToggleBtn} ${
                          pkg.isPublished ? styles.published : styles.draft
                        }`}
                        title={
                          !pkg.priceVerified
                            ? 'Cannot publish unverified package'
                            : 'Click to toggle public visibility'
                        }
                      >
                        {pkg.isPublished ? (
                          <>
                            <CheckCircle2 size={13} /> Published
                          </>
                        ) : (
                          <>
                            <XCircle size={13} /> Draft (Hidden)
                          </>
                        )}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionBtns}>
                        <Link
                          to={`/admin/packages/${pkg.id}/edit`}
                          className={styles.editBtn}
                          title="Edit package parameters and pricing"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(pkg.id, pkg.name)}
                          className={styles.deleteBtn}
                          title="Delete package"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noData}>
                    No packages found. Click "Create New Package" to add one.
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

      <BulkCsvModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        title="Bulk Import Health Checkup Packages"
        sampleDownloadUrl="/admin/packages/sample-csv"
        sampleFilename="sample_packages.csv"
        uploadEndpoint="/admin/packages/bulk-csv"
        onSuccess={() => {
          fetchPackages();
        }}
      />
    </div>
  );
}
