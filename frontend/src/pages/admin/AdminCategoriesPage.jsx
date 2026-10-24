import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, FolderOpen, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import Modal from '../../components/common/Modal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './AdminCategoriesPage.module.css';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [activeCatId, setActiveCatId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    iconName: 'Activity',
    displayOrder: 0,
    isPublished: true,
  });

  const toast = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/categories');
      if (res.data?.success) {
        setCategories(res.data.data.items || res.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setModalMode('create');
    setActiveCatId(null);
    setForm({
      name: '',
      description: '',
      iconName: 'Activity',
      displayOrder: categories.length + 1,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setModalMode('edit');
    setActiveCatId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      iconName: cat.iconName || 'Activity',
      displayOrder: cat.displayOrder || 0,
      isPublished: Boolean(cat.isPublished),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      if (modalMode === 'create') {
        const res = await api.post('/admin/categories', form);
        if (res.data?.success) {
          toast.success('Category created successfully');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await api.put(`/admin/categories/${activeCatId}`, form);
        if (res.data?.success) {
          toast.success('Category updated successfully');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Tests assigned to it will be unassigned.`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/categories/${id}`);
      if (res.data?.success) {
        toast.success(`Category "${name}" deleted`);
        fetchCategories();
      }
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Diagnostic Categories</h1>
          <p className={styles.subtitle}>
            Organize lab tests and health checkups into logical clinical departments.
          </p>
        </div>

        <button onClick={openCreateModal} className={styles.createBtn}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Display Order</th>
                <th>Linked Tests</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <LoadingSpinner variant="table" colSpan={5} label="Loading diagnostic categories…" />
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <strong className={styles.catName}>{cat.name}</strong>
                      <span className={styles.catSlug}>/{cat.slug}</span>
                    </td>
                    <td>{cat.displayOrder}</td>
                    <td>
                      <span className={styles.badge}>{cat.testCount || 0} Tests</span>
                    </td>
                    <td>
                      {cat.isPublished ? (
                        <span className={styles.statusPublished}>
                          <CheckCircle2 size={13} /> Active
                        </span>
                      ) : (
                        <span className={styles.statusDraft}>
                          <XCircle size={13} /> Inactive
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionBtns}>
                        <button
                          onClick={() => openEditModal(cat)}
                          className={styles.editBtn}
                          title="Edit category"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className={styles.deleteBtn}
                          title="Delete category"
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
                    No categories found. Click "Add Category" to create one.
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
        title={modalMode === 'create' ? 'Create Diagnostic Category' : 'Edit Category'}
      >
        <form onSubmit={handleSubmit} className={styles.formModal}>
          <div className={styles.field}>
            <label className={styles.label}>Category Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Hematology & Blood Studies"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Display Order</label>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Clinical Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Short explanation of tests categorized in this section..."
              className={styles.textarea}
            />
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            />
            <span>Show on public website</span>
          </label>

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
                'Save Category'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
