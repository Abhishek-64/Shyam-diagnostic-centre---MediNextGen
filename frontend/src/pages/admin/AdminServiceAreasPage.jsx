import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, MapPin, Search, Globe, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import Modal from '../../components/common/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './AdminServiceAreasPage.module.css';

export default function AdminServiceAreasPage() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [activeAreaId, setActiveAreaId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    pinCode: '',
    areaName: '',
    city: 'Ahmedabad',
    state: 'Gujarat',
    isHomeCollectionActive: true,
    isAllIndiaPartner: false,
    notes: '',
  });

  const toast = useToast();

  const fetchAreas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/service-areas');
      if (res.data?.success) {
        setAreas(res.data.data.items || res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load serviceable areas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setActiveAreaId(null);
    setForm({
      pinCode: '',
      areaName: '',
      city: 'Ahmedabad',
      state: 'Gujarat',
      isHomeCollectionActive: true,
      isAllIndiaPartner: false,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (area) => {
    setModalMode('edit');
    setActiveAreaId(area.id);
    setForm({
      pinCode: area.pinCode,
      areaName: area.areaName,
      city: area.city || 'Ahmedabad',
      state: area.state || 'Gujarat',
      isHomeCollectionActive: Boolean(area.isHomeCollectionActive),
      isAllIndiaPartner: Boolean(area.isAllIndiaPartner),
      notes: area.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(form.pinCode.trim())) {
      toast.error('PIN code must be exactly 6 digits');
      return;
    }
    if (!form.areaName.trim()) {
      toast.error('Area / Locality name is required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        pinCode: form.pinCode.trim(),
        areaName: form.areaName.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        isHomeCollectionActive: form.isHomeCollectionActive,
        isAllIndiaPartner: form.isAllIndiaPartner,
        notes: form.notes.trim() || undefined,
      };

      if (modalMode === 'create') {
        const res = await api.post('/admin/service-areas', payload);
        if (res.data?.success) {
          toast.success('PIN code added to service network');
          setIsModalOpen(false);
          fetchAreas();
        }
      } else {
        const res = await api.put(`/admin/service-areas/${activeAreaId}`, payload);
        if (res.data?.success) {
          toast.success('Service area updated');
          setIsModalOpen(false);
          fetchAreas();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service area');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, pinCode, areaName) => {
    if (!window.confirm(`Remove PIN code ${pinCode} (${areaName}) from service areas?`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/service-areas/${id}`);
      if (res.data?.success) {
        toast.success(`PIN ${pinCode} removed`);
        fetchAreas();
      }
    } catch (err) {
      toast.error('Failed to delete service area');
    }
  };

  const filteredAreas = areas.filter((a) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      a.pinCode?.includes(q) ||
      a.areaName?.toLowerCase().includes(q) ||
      a.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Service Areas & PIN Codes</h1>
          <p className={styles.subtitle}>
            Control exactly where home sample collection is active. Patients can only book PINs registered here.
          </p>
        </div>

        <button onClick={openCreateModal} className={styles.createBtn}>
          <Plus size={16} /> Add PIN Code
        </button>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by 6-digit PIN code, area, or city..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>PIN Code</th>
                <th>Locality / Area</th>
                <th>City & State</th>
                <th>Home Collection</th>
                <th>Network Type</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading service areas...
                  </td>
                </tr>
              ) : filteredAreas.length > 0 ? (
                filteredAreas.map((area) => (
                  <tr key={area.id}>
                    <td>
                      <span className={styles.pinCodeBadge}>{area.pinCode}</span>
                    </td>
                    <td>
                      <strong>{area.areaName}</strong>
                      {area.notes && (
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          {area.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      {area.city}, {area.state}
                    </td>
                    <td>
                      {area.isHomeCollectionActive ? (
                        <span className={styles.activeBadge}>
                          <CheckCircle2 size={13} /> Active
                        </span>
                      ) : (
                        <span className={styles.inactiveBadge}>
                          <XCircle size={13} /> Paused
                        </span>
                      )}
                    </td>
                    <td>
                      {area.isAllIndiaPartner ? (
                        <span className={styles.partnerBadge}>
                          <Globe size={13} /> Partner Network
                        </span>
                      ) : (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          Direct Fleet
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionBtns}>
                        <button
                          onClick={() => openEditModal(area)}
                          className={styles.editBtn}
                          title="Edit area"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(area.id, area.pinCode, area.areaName)}
                          className={styles.deleteBtn}
                          title="Delete area"
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
                    {search ? 'No matching PIN codes found.' : 'No service areas defined. Click "Add PIN Code".'}
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
        title={modalMode === 'create' ? 'Add Serviceable PIN Code' : 'Edit PIN Code Area'}
      >
        <form onSubmit={handleSubmit} className={styles.formModal}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>6-Digit PIN Code *</label>
              <input
                type="text"
                maxLength={6}
                value={form.pinCode}
                onChange={(e) => setForm({ ...form, pinCode: e.target.value.replace(/\D/g, '') })}
                placeholder="e.g. 380001"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Area / Locality Name *</label>
              <input
                type="text"
                value={form.areaName}
                onChange={(e) => setForm({ ...form, areaName: e.target.value })}
                placeholder="e.g. Navrangpura / CG Road"
                className={styles.input}
                required
              />
            </div>
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
            <label className={styles.label}>Internal Logistics / Phlebotomist Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              placeholder="e.g. Assigned to West Zone runner batch 1; morning slots 6 AM - 11 AM."
              className={styles.textarea}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.isHomeCollectionActive}
                onChange={(e) => setForm({ ...form, isHomeCollectionActive: e.target.checked })}
              />
              <span>
                <strong>Home Sample Collection Active</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>
                  Patients entering this PIN will see "Available for Home Visit".
                </small>
              </span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.isAllIndiaPartner}
                onChange={(e) => setForm({ ...form, isAllIndiaPartner: e.target.checked })}
              />
              <span>
                <strong>All-India / Partner Lab Routed</strong>
                <small style={{ display: 'block', color: 'var(--color-text-muted)' }}>
                  Mark if served via national partner laboratories outside local Ahmedabad fleet.
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
                'Save Service Area'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
