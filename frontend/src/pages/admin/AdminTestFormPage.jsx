import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Save, Loader2, FlaskConical } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './AdminPackageFormPage.module.css';

export default function AdminTestFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    code: '',
    categoryId: '',
    shortDescription: '',
    description: '',
    sampleType: 'Whole Blood (EDTA)',
    reportingTime: 'Same Day (4 to 6 Hours)',
    preparationInstructions: 'No special fasting required unless advised by your physician.',
    priceRupees: '',
    discountPriceRupees: '',
    isPopular: false,
    hasOfferBadge: false,
    isHomeCollectionAvailable: true,
    isPublished: true,
  });

  useEffect(() => {
    async function init() {
      try {
        let catList = [];
        try {
          const catRes = await api.get('/admin/categories');
          if (catRes.data?.success) {
            catList = Array.isArray(catRes.data.data) ? catRes.data.data : (catRes.data.data.items || []);
          }
        } catch {
          const pubCatRes = await api.get('/categories');
          if (pubCatRes.data?.success) {
            catList = Array.isArray(pubCatRes.data.data) ? pubCatRes.data.data : [];
          }
        }
        setCategories(catList);

        if (isEdit) {
          const testRes = await api.get(`/admin/tests/${id}`);
          if (testRes.data?.success) {
            const t = testRes.data.data;
            setForm({
              name: t.name || '',
              code: t.code || '',
              categoryId: t.categoryId != null ? String(t.categoryId) : '',
              shortDescription: t.shortDescription || '',
              description: t.description || '',
              sampleType: t.sampleType || '',
              reportingTime: t.reportingTime || '',
              preparationInstructions: t.preparationInstructions || '',
              priceRupees: t.priceInPaise != null ? (t.priceInPaise / 100).toString() : '',
              discountPriceRupees:
                t.discountPriceInPaise != null ? (t.discountPriceInPaise / 100).toString() : '',
              isPopular: Boolean(t.isPopular),
              hasOfferBadge: Boolean(t.hasOfferBadge),
              isHomeCollectionAvailable: t.isHomeCollectionAvailable !== false,
              isPublished: Boolean(t.isPublished),
            });
          }
        }
      } catch (err) {
        toast.error('Failed to load test details');
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Test name is required';
    if (!form.priceRupees || isNaN(form.priceRupees) || Number(form.priceRupees) < 0) {
      errs.priceRupees = 'Valid test fee in ₹ is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        code: form.code.trim() || undefined,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        shortDescription: form.shortDescription.trim() || undefined,
        description: form.description.trim() || undefined,
        sampleType: form.sampleType.trim() || undefined,
        reportingTime: form.reportingTime.trim() || undefined,
        preparationInstructions: form.preparationInstructions.trim() || undefined,
        priceInPaise: Math.round(Number(form.priceRupees) * 100),
        discountPriceInPaise: form.discountPriceRupees
          ? Math.round(Number(form.discountPriceRupees) * 100)
          : null,
        isPopular: form.isPopular,
        hasOfferBadge: form.hasOfferBadge,
        isHomeCollectionAvailable: form.isHomeCollectionAvailable,
        isPublished: form.isPublished,
      };

      if (isEdit) {
        const res = await api.put(`/admin/tests/${id}`, payload);
        if (res.data?.success) {
          toast.success('Test updated successfully');
          navigate('/admin/tests');
        }
      } else {
        const res = await api.post('/admin/tests', payload);
        if (res.data?.success) {
          toast.success('Test created successfully');
          navigate('/admin/tests');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving test');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className="spin" size={32} />
        <p>Loading test details...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/admin/tests" className={styles.backLink}>
          <ChevronLeft size={16} /> Back to Tests Directory
        </Link>
        <h1 className={styles.title}>
          {isEdit ? `Edit Test: ${form.name}` : 'Create New Diagnostic Test'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        {/* Basic Info */}
        <div className={styles.section}>
          <h3>Basic Test Identification</h3>
          <p className={styles.sectionDesc}>
            Primary laboratory parameter name, unique test code, and medical category.
          </p>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>
                Test Full Name <span className={styles.req}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Complete Blood Count (CBC) with ESR"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Test Short Code / LIS ID</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="e.g. CBC-01, LFT-02, TSH-01"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Diagnostic Category</label>
              <select
                name="categoryId"
                value={form.categoryId || ''}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Specimen / Sample Type</label>
              <input
                type="text"
                name="sampleType"
                value={form.sampleType}
                onChange={handleChange}
                placeholder="e.g. Whole Blood, Serum, Random Urine"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className={styles.section}>
          <h3>Pricing (₹)</h3>
          <p className={styles.sectionDesc}>
            Accurate laboratory rate. Money is stored securely in paise internally.
          </p>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>
                Actual Patient Fee (₹) <span className={styles.req}>*</span>
              </label>
              <input
                type="number"
                name="priceRupees"
                value={form.priceRupees}
                onChange={handleChange}
                placeholder="e.g. 350"
                min="0"
                step="1"
                className={`${styles.input} ${errors.priceRupees ? styles.inputError : ''}`}
              />
              {errors.priceRupees && <span className={styles.error}>{errors.priceRupees}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Standard / MRP Rate (₹) [Optional strikethrough]</label>
              <input
                type="number"
                name="discountPriceRupees"
                value={form.discountPriceRupees}
                onChange={handleChange}
                placeholder="e.g. 500"
                min="0"
                step="1"
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Clinical Overview & Instructions */}
        <div className={styles.section}>
          <h3>Clinical Details & Preparation</h3>
          <p className={styles.sectionDesc}>
            Provide patients with pre-test guidance and turnaround expectations.
          </p>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Turnaround / Reporting Time</label>
              <input
                type="text"
                name="reportingTime"
                value={form.reportingTime}
                onChange={handleChange}
                placeholder="e.g. Same Day (4 to 6 Hours)"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Patient Preparation & Fasting</label>
              <input
                type="text"
                name="preparationInstructions"
                value={form.preparationInstructions}
                onChange={handleChange}
                placeholder="e.g. 10-12 hours overnight fasting recommended"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Brief Tagline / Summary</label>
            <input
              type="text"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="e.g. Evaluates overall health and detects a wide range of blood disorders."
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Detailed Clinical Overview</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what this test measures, why a doctor prescribes it, and normal clinical indications..."
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Publishing & Visibility */}
        <div className={styles.section}>
          <h3>Visibility & Availability</h3>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isHomeCollectionAvailable"
                checked={form.isHomeCollectionAvailable}
                onChange={handleChange}
              />
              <span className={styles.checkboxText}>
                <strong>Home Sample Collection Eligible</strong>
                <small>Phlebotomist can collect sample at patient's residence.</small>
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isPopular"
                checked={form.isPopular}
                onChange={handleChange}
              />
              <span className={styles.checkboxText}>
                <strong>Feature as Popular Test</strong>
                <small>Showcase prominently on home page and quick-selection lists.</small>
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="hasOfferBadge"
                checked={form.hasOfferBadge}
                onChange={handleChange}
              />
              <span className={styles.checkboxText}>
                <strong>Display Special Offer Badge</strong>
                <small>Highlights this test with a high-visibility "Special Offer" tag on catalogue cards.</small>
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
              />
              <span className={styles.checkboxText}>
                <strong>Published on Public Website</strong>
                <small>Make visible in search results, catalogue, and enquiry forms.</small>
              </span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => navigate('/admin/tests')}
            className={styles.cancelBtn}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className={styles.spin} size={18} /> Saving Test...
              </>
            ) : (
              <>
                <Save size={18} /> {isEdit ? 'Update Test' : 'Create Test'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
