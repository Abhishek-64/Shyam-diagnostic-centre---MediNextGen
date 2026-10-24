import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Search, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import api from '../services/api.js';
import PackageCard from '../components/catalogue/PackageCard.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Modal from '../components/common/Modal.jsx';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import styles from './PackagesPage.module.css';

export default function PackagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const querySearch = searchParams.get('search') || '';
  const queryPopular = searchParams.get('popular') === 'true';

  const [searchInput, setSearchInput] = useState(querySearch);
  const [filterPopular, setFilterPopular] = useState(queryPopular);
  const [page, setPage] = useState(1);

  // Modal
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPackages() {
      try {
        setLoading(true);
        let url = `/packages?page=${page}&limit=12`;
        if (querySearch) url += `&search=${encodeURIComponent(querySearch)}`;
        if (filterPopular) url += `&popular=true`;

        const res = await api.get(url);
        if (res.data?.success) {
          setPackages(res.data.data.items || []);
          setMeta(res.data.data.meta || { page: 1, totalPages: 1, total: 0 });
        }
      } catch (err) {
        console.error('Failed to load packages', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, [page, querySearch, filterPopular]);

  const handleSearchSubmit = (val) => {
    setSearchInput(val);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (val) params.set('search', val);
    else params.delete('search');
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setPage(1);
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params);
  };

  const togglePopular = () => {
    const next = !filterPopular;
    setFilterPopular(next);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (next) params.set('popular', 'true');
    else params.delete('popular');
    setSearchParams(params);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className="container">
          <span className={styles.overline}>Preventive Healthcare • 2,000+ Tests Available</span>
          <h1 className={styles.pageTitle}>Full Body Health Checkup Packages</h1>
          <p className={styles.pageSubtitle}>
            Certified diagnostic profiles and preventive health checkups covering up to 92 parameters, backed by over 2,000+ specialized medical tests.
          </p>

          <div className={styles.searchBarRow}>
            <SearchBar
              value={searchInput}
              onChange={handleSearchSubmit}
              onClear={handleClearSearch}
              placeholder="Search by package name or health concern (e.g. Master, Diabetes, Heart)..."
            />
          </div>

          <div className={styles.filterPills}>
            <button
              onClick={() => {
                setFilterPopular(false);
                const params = new URLSearchParams(searchParams);
                params.delete('popular');
                setSearchParams(params);
              }}
              className={`${styles.filterPill} ${!filterPopular ? styles.activePill : ''}`}
            >
              All Packages ({meta.total || packages.length})
            </button>
            <button
              onClick={togglePopular}
              className={`${styles.filterPill} ${filterPopular ? styles.activePill : ''}`}
            >
              <Sparkles size={14} /> Most Popular Checkups
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <LoadingSpinner
            size="lg"
            label="Loading verified health packages…"
            sublabel="Full body checkups, Vitamin profiles & Cardiology packages"
            variant="center"
          />
        ) : packages.length > 0 ? (
          <>
            <div className={styles.grid}>
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onBookClick={(p) => {
                    setSelectedPkg(p);
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>

            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </>
        ) : (
          <div className={styles.emptyState}>
            <Package size={48} className={styles.emptyIcon} />
            <h3>No health packages found</h3>
            <p>Try searching with another keyword or reset active filters.</p>
            <button onClick={handleClearSearch} className={styles.resetBtn}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedPkg ? `Book: ${selectedPkg.name}` : 'Book Health Package'}
      >
        <EnquiryForm
          initialType="package_booking"
          initialPackageId={selectedPkg?.id}
          itemName={selectedPkg?.name}
          onSuccess={() => {}}
        />
      </Modal>
    </div>
  );
}
