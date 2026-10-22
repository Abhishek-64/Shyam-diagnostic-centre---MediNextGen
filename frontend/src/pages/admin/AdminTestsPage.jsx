import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Plus, Search, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api.js';
import PriceDisplay from '../../components/common/PriceDisplay.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './AdminPackagesPage.module.css'; // Reusable table styling

export default function AdminTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const toast = useToast();

  const fetchTests = async () => {
    try {
      setLoading(true);
      let url = `/admin/tests?page=${page}&limit=15`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
      const res = await api.get(url);
      if (res.data?.success) {
        setTests(res.data.data.items || []);
        setMeta(res.data.data.meta || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [page, search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete test "${name}"?`)) return;
    try {
      const res = await api.delete(`/admin/tests/${id}`);
      if (res.data?.success) {
        toast.success(`Test "${name}" deleted`);
        fetchTests();
      }
    } catch (err) {
      toast.error('Failed to delete test');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Diagnostic Tests Directory</h1>
          <p className={styles.subtitle}>
            Manage individual pathology, biochemical, and blood test parameters.
          </p>
        </div>

        <Link to="/admin/tests/new" className={styles.createBtn}>
          <Plus size={16} /> Create New Test
        </Link>
      </div>

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
            placeholder="Search tests by name or test code..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Category</th>
                <th>Sample Type</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={styles.loadingCell}>
                    Loading tests...
                  </td>
                </tr>
              ) : tests.length > 0 ? (
                tests.map((test) => (
                  <tr key={test.id}>
                    <td>
                      <strong className={styles.pkgName}>{test.name}</strong>
                      <span className={styles.pkgSlug}>
                        {test.code ? `Code: ${test.code} • ` : ''}/{test.slug}
                      </span>
                    </td>
                    <td>
                      <span className={styles.paramTag}>{test.category?.name || 'General'}</span>
                    </td>
                    <td>{test.sampleType || 'Whole Blood'}</td>
                    <td>
                      <PriceDisplay
                        priceInPaise={test.priceInPaise}
                        originalPriceInPaise={test.discountPriceInPaise}
                        size="sm"
                      />
                    </td>
                    <td>
                      <span
                        className={`${styles.statusToggleBtn} ${
                          test.isPublished ? styles.published : styles.draft
                        }`}
                      >
                        {test.isPublished ? (
                          <>
                            <CheckCircle2 size={13} /> Published
                          </>
                        ) : (
                          <>
                            <XCircle size={13} /> Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionBtns}>
                        <Link
                          to={`/admin/tests/${test.id}/edit`}
                          className={styles.editBtn}
                          title="Edit test"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(test.id, test.name)}
                          className={styles.deleteBtn}
                          title="Delete test"
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
                    No tests found. Click "Create New Test" to add one.
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
