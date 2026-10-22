import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, ShieldCheck, AlertTriangle, Building2, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import Modal from '../../components/common/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './AdminPartnersPage.module.css';

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    city: 'Ahmedabad',
    state: 'Gujarat',
    accreditation: 'NABL Accredited / ISO 15189',
    isAccreditationVerified: false,
    isPublished: false,
    contactPhone: '',
    contactEmail: '',
  });

  const toast = useToast();

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/partners');
      if (res.data?.success) {
        setPartners(res.data.data.items || res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load partner laboratories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setActivePartnerId(null);
    setForm({
      name: '',
      city: 'Ahmedabad',
      state: 'Gujarat',
      accreditation: 'NABL Accredited / ISO 15189',
      isAccreditationVerified: false,
      isPublished: false,
      contactPhone: '',
      contactEmail: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (partner) => {
    setModalMode('edit');
    setActivePartnerId(partner.id);
    setForm({
      name: partner.name,
      city: partner.city || '',
      state: partner.state || '',
      accreditation: partner.accreditation || '',
      isAccreditationVerified: Boolean(partner.isAccreditationVerified),
      isPublished: Boolean(partner.isPublished),
      contactPhone: partner.contactPhone || '',
      contactEmail: partner.contactEmail || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Laboratory name is required');
      return;
    }

    if (form.isPublished && !form.isAccreditationVerified) {
      toast.error('Cannot publish partner lab without verified accreditation documents');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        accreditation: form.accreditation.trim() || undefined,
        isAccreditationVerified: form.isAccreditationVerified,
        isPublished: form.isPublished,
        contactPhone: form.contactPhone.trim() || undefined,
        contactEmail: form.contactEmail.trim() || undefined,
      };

      if (modalMode === 'create') {
        const res = await api.post('/admin/partners', payload);
        if (res.data?.success) {
          toast.success('Partner laboratory registered');
          setIsModalOpen(false);
          fetchPartners();
        }
      } else {
        const res = await api.put(`/admin/partners/${activePartnerId}`, payload);
        if (res.data?.success) {
          toast.success('Partner laboratory updated');
          setIsModalOpen(false);
          fetchPartners();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save partner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete partner laboratory "${name}"?`)) return;

    try {
      const res = await api.delete(`/admin/partners/${id}`);
      if (res.data?.success) {
        toast.success(`Partner "${name}" removed`);
        fetchPartners();
      }
    } catch (err) {
      toast.error('Failed to delete partner');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Partner Laboratories Network</h1>
          <p className={styles.subtitle}>
            Manage regional and national NABL / ICMR accredited partner labs executing specialized tests.
          </p>
        </div>

        <button onClick={openCreateModal} className={styles.createBtn}>
          <Plus size={16} /> Add Partner Lab
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Laboratory Name</th>
                <th>Location</th>
                <th>Accreditation</th>
                <th>Verification</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading partner labs...
                  </td>
                </tr>
              ) : partners.length > 0 ? (
                partners.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong className={styles.partnerName}>{p.name}</strong>
                      {(p.contactPhone || p.contactEmail) && (
                        <div className={styles.partnerContact}>
                          {p.contactPhone && <span>📞 {p.contactPhone} </span>}
                          {p.contactEmail && <span>✉️ {p.contactEmail}</span>}
                        </div>
                      )}
                    </td>
                    <td>
                      {p.city}, {p.state}
                    </td>
                    <td>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)' }}>
                        {p.accreditation || 'Standard Pathology'}
                      </span>
                    </td>
                    <td>
                      {p.isAccreditationVerified ? (
                        <span className={styles.badgeVerified}>
                          <ShieldCheck size={13} /> Verified
                        </span>
                      ) : (
                        <span className={styles.badgeUnverified}>
                          <AlertTriangle size={13} /> Unverified
                        </span>
                      )}
                    </td>
                    <td>
                      {p.isPublished ? (
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
                          onClick={() => openEditModal(p)}
                          className={styles.editBtn}
                          title="Edit partner"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className={styles.deleteBtn}
                          title="Delete partner"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No partner labs found. Click "Add Partner Lab" to onboard one.
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
        title={modalMode === 'create' ? 'Onboard Partner Laboratory' : 'Edit Partner Details'}
      >
        <form onSubmit={handleSubmit} className={styles.formModal}>
          <div className={styles.field}>
            <label className={styles.label}>Laboratory Brand / Institutional Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. MediNextGen Reference Lab"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>City *</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Ahmedabad"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>State *</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="e.g. Gujarat"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Accreditation & Quality Standards</label>
            <input
              type="text"
              value={form.accreditation}
              onChange={(e) => setForm({ ...form, accreditation: e.target.value })}
              placeholder="e.g. NABL Accredited (MC-XXXX), CAP Compliant"
              className={styles.input}
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Contact Phone</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                placeholder="e.g. labops@medinextgen.com"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.isAccreditationVerified}
                onChange={(e) => setForm({ ...form, isAccreditationVerified: e.target.checked })}
              />
              <span>
                <strong>Accreditation Documents Verified</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>
                  NABL / ISO certificate validity and scope inspected by medical quality lead.
                </small>
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.isPublished}
                disabled={!form.isAccreditationVerified}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              />
              <span>
                <strong>Show on Public Website & Network Page</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>
                  {!form.isAccreditationVerified
                    ? '(Disabled: Verify accreditation certificates first)'
                    : 'List partner on the All-India network and laboratory profile pages.'}
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
                'Save Partner'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
