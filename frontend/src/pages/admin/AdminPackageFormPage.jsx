import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Save, Loader2, CheckSquare, Square, AlertCircle, Eye } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import styles from './AdminPackageFormPage.module.css';

export default function AdminPackageFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [testsList, setTestsList] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    subtitle: '',
    description: '',
    parametersCovered: 60,
    fastDuration: '10-12 hours overnight fasting required',
    reportTime: 'Within 24 Hours',
    priceRupees: '',
    originalPriceRupees: '',
    isPopular: false,
    isFeatured: false,
    hasOfferBadge: false,
    isHomeCollectionAvailable: true,
    priceVerified: false,
    isPublished: false,
    displayOrder: 0,
    showPriceOnWebsite: true,
    showOriginalPrice: true,
    showFastDuration: true,
    showReportTime: true,
    testIds: [],
  });

  // Load available tests and existing package data
  useEffect(() => {
    async function init() {
      try {
        const testsRes = await api.get('/admin/tests?limit=100');
        if (testsRes.data?.success) {
          setTestsList(testsRes.data.data.items || []);
        }

        if (isEdit) {
          const pkgRes = await api.get(`/admin/packages/${id}`);
          if (pkgRes.data?.success) {
            const p = pkgRes.data.data;
            setForm({
              name: p.name || '',
              subtitle: p.subtitle || '',
              description: p.description || '',
              parametersCovered: p.parametersCovered || 0,
              fastDuration: p.fastDuration || '',
              reportTime: p.reportTime || '',
              priceRupees: p.priceInPaise ? (p.priceInPaise / 100).toString() : '',
              originalPriceRupees: p.originalPriceInPaise
                ? (p.originalPriceInPaise / 100).toString()
                : '',
              isPopular: Boolean(p.isPopular),
              isFeatured: Boolean(p.isFeatured),
              hasOfferBadge: Boolean(p.hasOfferBadge),
              isHomeCollectionAvailable: p.isHomeCollectionAvailable !== false,
              priceVerified: Boolean(p.priceVerified),
              isPublished: Boolean(p.isPublished),
              displayOrder: p.displayOrder || 0,
              showPriceOnWebsite: p.showPriceOnWebsite !== false,
              showOriginalPrice: p.showOriginalPrice !== false,
              showFastDuration: p.showFastDuration !== false,
              showReportTime: p.showReportTime !== false,
              testIds: p.tests ? p.tests.map((t) => t.id) : [],
            });
          }
        }
      } catch (err) {
        toast.error('Failed to load data for form');
      } finally {
        setInitialLoading(false);
      }
    }
    init();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleTest = (testId) => {
    setForm((prev) => {
      const exists = prev.testIds.includes(testId);
      const updated = exists ? prev.testIds.filter((t) => t !== testId) : [...prev.testIds, testId];
      return { ...prev, testIds: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!form.name.trim()) {
      setErrors({ name: 'Package name is required.' });
      return;
    }

    const price = parseFloat(form.priceRupees);
    if (isNaN(price) || price < 0) {
      setErrors({ priceRupees: 'Please enter a valid price in rupees.' });
      return;
    }

    if (form.isPublished && !form.priceVerified) {
      setErrors({
        isPublished:
          'Rule Violation: You cannot publish this package until "Verified Price & Details" is checked.',
      });
      return;
    }

    const payload = {
      name: form.name.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      parametersCovered: parseInt(form.parametersCovered, 10) || 0,
      fastDuration: form.fastDuration.trim(),
      reportTime: form.reportTime.trim(),
      priceInPaise: Math.round(price * 100),
      originalPriceInPaise: form.originalPriceRupees
        ? Math.round(parseFloat(form.originalPriceRupees) * 100)
        : null,
      isPopular: form.isPopular,
      isFeatured: form.isFeatured,
      hasOfferBadge: form.hasOfferBadge,
      isHomeCollectionAvailable: form.isHomeCollectionAvailable,
      priceVerified: form.priceVerified,
      isPublished: form.isPublished,
      displayOrder: parseInt(form.displayOrder, 10) || 0,
      showPriceOnWebsite: form.showPriceOnWebsite,
      showOriginalPrice: form.showOriginalPrice,
      showFastDuration: form.showFastDuration,
      showReportTime: form.showReportTime,
      testIds: form.testIds,
    };

    try {
      setLoading(true);
      if (isEdit) {
        await api.put(`/admin/packages/${id}`, payload);
        toast.success('Package updated successfully');
      } else {
        await api.post('/admin/packages', payload);
        toast.success('New package created successfully');
      }
      navigate('/admin/packages');
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ form: err.response?.data?.message || 'Failed to save package.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <LoadingSpinner variant="center" label="Loading health package details…" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/admin/packages" className={styles.backLink}>
          <ChevronLeft size={16} /> Back to Packages List
        </Link>
        <h1 className={styles.title}>
          {isEdit ? `Edit Package: ${form.name}` : 'Create New Health Package'}
        </h1>
      </div>

      {errors.form && <div className={styles.errorAlert}>{errors.form}</div>}

      <form onSubmit={handleSubmit} className={styles.formCard}>
        {/* Core Info */}
        <div className={styles.section}>
          <h3>1. Package Core Information</h3>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>
                Package Name <span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Master Health Checkup"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                required
              />
              {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Subtitle / Key Highlight</label>
              <input
                type="text"
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="e.g. 75 Parameters Covered • Total Body Screening"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Detailed Clinical Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Explain tests included, organ systems covered, and who this package is recommended for..."
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Pricing & Fasting */}
        <div className={styles.section}>
          <h3>2. Pricing, Fasting & Delivery Time</h3>
          <div className={styles.grid3}>
            <div className={styles.field}>
              <label className={styles.label}>
                Selling Price (₹) <span className={styles.req}>*</span>
              </label>
              <input
                type="number"
                name="priceRupees"
                value={form.priceRupees}
                onChange={handleChange}
                placeholder="1999"
                className={`${styles.input} ${errors.priceRupees ? styles.inputError : ''}`}
                required
              />
              {errors.priceRupees && (
                <span className={styles.fieldError}>{errors.priceRupees}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Original / Strike-through Price (₹)</label>
              <input
                type="number"
                name="originalPriceRupees"
                value={form.originalPriceRupees}
                onChange={handleChange}
                placeholder="3999"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Parameters Covered Count</label>
              <input
                type="number"
                name="parametersCovered"
                value={form.parametersCovered}
                onChange={handleChange}
                placeholder="75"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Fasting Requirements</label>
              <input
                type="text"
                name="fastDuration"
                value={form.fastDuration}
                onChange={handleChange}
                placeholder="10-12 hours fasting required"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Report Turnaround Time</label>
              <input
                type="text"
                name="reportTime"
                value={form.reportTime}
                onChange={handleChange}
                placeholder="Within 24 Hours"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Included Tests Multi-Select */}
        <div className={styles.section}>
          <h3>3. Tests Included in this Package</h3>
          <p className={styles.sectionDesc}>
            Check individual tests included in this checkup profile ({form.testIds.length} selected):
          </p>

          <div className={styles.testsPickerGrid}>
            {testsList.map((test) => {
              const selected = form.testIds.includes(test.id);
              return (
                <div
                  key={test.id}
                  onClick={() => toggleTest(test.id)}
                  className={`${styles.testPickerItem} ${selected ? styles.testPickerSelected : ''}`}
                >
                  {selected ? (
                    <CheckSquare size={18} className={styles.checkedIcon} />
                  ) : (
                    <Square size={18} className={styles.uncheckedIcon} />
                  )}
                  <span className={styles.pickerTestName}>{test.name}</span>
                  {test.code && <span className={styles.pickerTestCode}>({test.code})</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification & Publication Rules */}
        <div className={styles.section}>
          <h3>4. Verification, Display & Publication</h3>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="priceVerified"
                checked={form.priceVerified}
                onChange={handleChange}
              />
              <div>
                <strong>Verified Price & Included Parameters</strong>
                <p>Confirm that fees and parameters have been formally approved by clinical directors.</p>
              </div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
              />
              <div>
                <strong>Publish on Public Website</strong>
                <p>Enforce rule: Cannot be published if unverified.</p>
              </div>
            </label>
            {errors.isPublished && (
              <span className={styles.ruleError}>{errors.isPublished}</span>
            )}

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              <div>
                <strong>Featured on Homepage</strong>
                <p>Highlight on the main website hero & featured packages carousel.</p>
              </div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isPopular"
                checked={form.isPopular}
                onChange={handleChange}
              />
              <div>
                <strong>Mark as Most Popular Checkup</strong>
              </div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isHomeCollectionAvailable"
                checked={form.isHomeCollectionAvailable}
                onChange={handleChange}
              />
              <div>
                <strong>Home Sample Collection Eligible</strong>
              </div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="hasOfferBadge"
                checked={form.hasOfferBadge}
                onChange={handleChange}
              />
              <div>
                <strong>Display Special Offer Badge</strong>
                <p>Highlights this package with a prominent "Offer" badge on website cards.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Public Website Display Controls */}
        <div className={styles.section}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Eye size={20} color="#0d9488" />
            <h3 style={{ margin: 0 }}>5. Public Website Display Controls</h3>
          </div>
          <p className={styles.sectionDesc}>
            Choose exactly which data attributes are visible to public visitors on the website cards.
          </p>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="showPriceOnWebsite"
                checked={form.showPriceOnWebsite}
                onChange={handleChange}
              />
              <div>
                <strong>Show Discounted Selling Price (₹)</strong>
                <p>If unchecked, shows &ldquo;Contact Centre for Rate&rdquo; on the card.</p>
              </div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="showOriginalPrice"
                checked={form.showOriginalPrice}
                onChange={handleChange}
              />
              <div>
                <strong>Show Original / MRP Strikethrough Price</strong>
                <p>If unchecked, hides original strike-through rate and savings % badge.</p>
              </div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="showFastDuration"
                checked={form.showFastDuration}
                onChange={handleChange}
              />
              <div>
                <strong>Show Fasting Duration & Requirements</strong>
                <p>Displays fasting guidance badges on the website package card.</p>
              </div>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="showReportTime"
                checked={form.showReportTime}
                onChange={handleChange}
              />
              <div>
                <strong>Show Report Delivery Turnaround Time</strong>
                <p>Displays expected report time (e.g. &ldquo;Within 24 Hours&rdquo;) on the card.</p>
              </div>
            </label>
          </div>
        </div>

        <div className={styles.formActions}>
          <Link to="/admin/packages" className={styles.cancelBtn}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} className={styles.saveBtn}>
            {loading ? (
              <>
                <Loader2 size={16} className={styles.spin} />
                <span>Saving Package...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isEdit ? 'Update Package' : 'Save & Create Package'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
