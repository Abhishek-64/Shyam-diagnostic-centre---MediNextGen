import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FlaskConical, Sparkles } from 'lucide-react';
import api from '../services/api.js';
import TestCard from '../components/catalogue/TestCard.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Modal from '../components/common/Modal.jsx';
import EnquiryForm from '../components/forms/EnquiryForm.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import styles from './TestsPage.module.css';

export default function TestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const isPopular = searchParams.get('popular') === 'true';

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [page, setPage] = useState(1);

  // Modal
  const [selectedTest, setSelectedTest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get('/categories');
        if (res.data?.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch tests on filter change
  useEffect(() => {
    async function loadTests() {
      try {
        setLoading(true);
        let url = `/tests?page=${page}&limit=12`;
        if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
        if (currentCategory) url += `&category=${encodeURIComponent(currentCategory)}`;
        if (isPopular) url += `&popular=true`;

        const res = await api.get(url);
        if (res.data?.success) {
          setTests(res.data.data.items || []);
          setMeta(res.data.data.meta || { page: 1, totalPages: 1, total: 0 });
        }
      } catch (err) {
        console.error('Failed to load tests', err);
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, [page, currentSearch, currentCategory, isPopular]);

  const handleSearch = (val) => {
    setSearchInput(val);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (val) params.set('search', val);
    else params.delete('search');
    setSearchParams(params);
  };

  const handleCategorySelect = (slug) => {
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    setSearchParams(params);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div className="container">
          <span className={styles.overline}>Pathology & Lab Diagnostics</span>
          <h1 className={styles.pageTitle}>Comprehensive Medical Tests Directory</h1>
          <p className={styles.pageSubtitle}>
            Search blood, urine, metabolic, thyroid, and biochemical tests with clear preparation instructions and turnaround times.
          </p>

          <div className={styles.searchBarRow}>
            <SearchBar
              value={searchInput}
              onChange={handleSearch}
              onClear={() => handleSearch('')}
              placeholder="Search tests by name or test code (e.g. CBC, HbA1c, Thyroid, Lipid, Vitamin)..."
            />
          </div>

          {/* Category Tabs */}
          <div className={styles.categoryTabs}>
            <button
              onClick={() => handleCategorySelect('')}
              className={`${styles.tabBtn} ${!currentCategory ? styles.activeTab : ''}`}
            >
              All Tests ({meta.total || tests.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`${styles.tabBtn} ${currentCategory === cat.slug ? styles.activeTab : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <LoadingSpinner
            size="lg"
            label="Loading diagnostic tests catalogue…"
            sublabel="Accessing over 2,000+ pathology tests with NABL protocols"
            variant="center"
          />
        ) : tests.length > 0 ? (
          <>
            <div className={styles.grid}>
              {tests.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  onEnquireClick={(t) => {
                    setSelectedTest(t);
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
            <FlaskConical size={48} className={styles.emptyIcon} />
            <h3>No tests matching your filter</h3>
            <p>Try searching for a general health parameter or browse other categories.</p>
            <button onClick={() => handleCategorySelect('')} className={styles.resetBtn}>
              View All Tests
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedTest ? `Book Test: ${selectedTest.name}` : 'Book Diagnostic Test'}
      >
        <EnquiryForm
          initialType="test_enquiry"
          initialTestId={selectedTest?.id}
          itemName={selectedTest?.name}
          onSuccess={() => {}}
        />
      </Modal>
    </div>
  );
}
