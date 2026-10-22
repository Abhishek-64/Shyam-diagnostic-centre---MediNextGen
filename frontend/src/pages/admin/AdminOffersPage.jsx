import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Tag, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import Modal from '../../components/common/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './AdminOffersPage.module.css';

export default function AdminOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [activeOfferId, setActiveOfferId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    code: '',
    description: '',
    discountPercentage: '',
    bannerText: '',
    validFrom: '',
    validUntil: '',
    isVerified: false,
    isPublished: false,
  });

  const toast = useToast();

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/offers');
      if (res.data?.success) {
        setOffers(res.data.data.items || res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load promotional offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setActiveOfferId(null);
    setForm({
      title: '',
      code: '',
      description: '',
      discountPercentage: '',
      bannerText: '',
      validFrom: '',
      validUntil: '',
      isVerified: false,
      isPublished: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (offer) => {
    setModalMode('edit');
    setActiveOfferId(offer.id);
    setForm({
      title: offer.title,
      code: offer.code || '',
      description: offer.description || '',
      discountPercentage: offer.discountPercentage != null ? offer.discountPercentage.toString() : '',
      bannerText: offer.bannerText || '',
      validFrom: offer.validFrom ? offer.validFrom.split('T')[0] : '',
      validUntil: offer.validUntil ? offer.validUntil.split('T')[0] : '',
      isVerified: Boolean(offer.isVerified),
      isPublished: Boolean(offer.isPublished),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Offer title is required');
      return;
    }

    if (form.isPublished && !form.isVerified) {
      toast.error('Unverified promotional offers cannot be published to live visitors');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: form.title.trim(),
        code: form.code.trim() ? form.code.trim().toUpperCase() : null,
        description: form.description.trim() || undefined,
        discountPercentage: form.discountPercentage ? Number(form.discountPercentage) : null,
        bannerText: form.bannerText.trim() || undefined,
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null,
        isVerified: form.isVerified,
        isPublished: form.isPublished,
      };

      if (modalMode === 'create') {
        const res = await api.post('/admin/offers', payload);
        if (res.data?.success) {
          toast.success('Promotional offer created successfully');
          setIsModalOpen(false);
          fetchOffers();
        }
      } else {
        const res = await api.put(`/admin/offers/${activeOfferId}`, payload);
        if (res.data?.success) {
          toast.success('Offer updated successfully');
          setIsModalOpen(false);
          fetchOffers();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save offer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete promotional offer "${title}"?`)) return;

    try {
      const res = await api.delete(`/admin/offers/${id}`);
      if (res.data?.success) {
        toast.success(`Offer deleted`);
        fetchOffers();
      }
    } catch (err) {
      toast.error('Failed to delete offer');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Promotions & Coupons</h1>
          <p className={styles.subtitle}>
            Manage seasonal discounts, corporate vouchers, and promotional headline banners.
          </p>
        </div>

        <button onClick={openCreateModal} className={styles.createBtn}>
          <Plus size={16} /> Create Offer
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Offer Details</th>
                <th>Discount</th>
                <th>Verification</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading promotions...
                  </td>
                </tr>
              ) : offers.length > 0 ? (
                offers.map((offer) => (
                  <tr key={offer.id}>
                    <td>
                      <strong className={styles.offerTitle}>{offer.title}</strong>
                      {offer.code && <span className={styles.promoCode}>{offer.code}</span>}
                    </td>
                    <td>
                      {offer.discountPercentage ? (
                        <span className={styles.discountBadge}>
                          {offer.discountPercentage}% OFF
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                          Custom Campaign
                        </span>
                      )}
                    </td>
                    <td>
                      {offer.isVerified ? (
                        <span className={styles.verifiedBadge}>
                          <CheckCircle2 size={13} /> Verified
                        </span>
                      ) : (
                        <span className={styles.unverifiedBadge}>
                          <AlertTriangle size={13} /> Draft Pending
                        </span>
                      )}
                    </td>
                    <td>
                      {offer.isPublished ? (
                        <span className={styles.statusPublished}>
                          <CheckCircle2 size={13} /> Live
                        </span>
                      ) : (
                        <span className={styles.statusDraft}>
                          <XCircle size={13} /> Hidden
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionBtns}>
                        <button
                          onClick={() => openEditModal(offer)}
                          className={styles.editBtn}
                          title="Edit offer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id, offer.title)}
                          className={styles.deleteBtn}
                          title="Delete offer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                    No offers created yet. Click "Create Offer" to launch a campaign.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create Promotional Campaign' : 'Edit Campaign'}
      >
        <form onSubmit={handleSubmit} className={styles.formModal}>
          <div className={styles.field}>
            <label className={styles.label}>Offer Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Senior Citizen Health Week"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Coupon Code (Optional)</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SENIOR15, DIWALI20"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Discount Percentage (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={form.discountPercentage}
                onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                placeholder="e.g. 15"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Announcement Banner Text (Top of Website)</label>
            <input
              type="text"
              value={form.bannerText}
              onChange={(e) => setForm({ ...form, bannerText: e.target.value })}
              placeholder="e.g. Special Offer: 15% off full body checkups this month!"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Terms & Details</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Applicability terms, minimum billing, validity remarks..."
              className={styles.textarea}
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Valid From</label>
              <input
                type="date"
                value={form.validFrom}
                onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Valid Until</label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.isVerified}
                onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
              />
              <span>
                <strong>Management Verification Done</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>
                  Confirmed with centre billing desk. Required before publishing.
                </small>
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.isPublished}
                disabled={!form.isVerified}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              />
              <span>
                <strong>Publish Live on Website</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>
                  {!form.isVerified
                    ? '(Disabled: Check verification above first)'
                    : 'Show banner and coupon code on customer portal.'}
                </small>
              </span>
            </label>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className={styles.cancelModalBtn}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitModalBtn} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="spin" size={15} /> Saving...
                </>
              ) : (
                'Save Offer'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
