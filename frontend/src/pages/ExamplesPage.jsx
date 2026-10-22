import { useState } from 'react';
import PageTitle from '../components/common/PageTitle.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import Alert from '../components/common/Alert.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Input from '../components/common/Input.jsx';
import Textarea from '../components/common/Textarea.jsx';
import useApi from '../hooks/useApi.js';
import useMutation from '../hooks/useMutation.js';
import { ENDPOINTS } from '../services/endpoints.js';
import styles from './ExamplesPage.module.css';

const STATUS_COLORS = {
  active: styles.badgeActive,
  inactive: styles.badgeInactive,
  archived: styles.badgeArchived,
};

function ExamplesPage() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'active' });
  const [deleteId, setDeleteId] = useState(null);

  const { data, loading, error, refetch } = useApi(ENDPOINTS.EXAMPLES, { page, limit: 6 });
  const createMutation = useMutation('post');
  const patchMutation = useMutation('patch');
  const deleteMutation = useMutation('delete');

  const records = data?.data?.records || [];
  const pagination = data?.data?.pagination || {};

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: '', description: '', status: 'active' });
    createMutation.reset();
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title, description: item.description || '', status: item.status });
    patchMutation.reset();
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditItem(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (editItem) {
      result = await patchMutation.mutate(ENDPOINTS.EXAMPLE_BY_ID(editItem.id), form);
    } else {
      result = await createMutation.mutate(ENDPOINTS.EXAMPLES, form);
    }
    if (result.success) {
      closeForm();
      refetch();
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    const result = await deleteMutation.mutate(ENDPOINTS.EXAMPLE_BY_ID(id));
    setDeleteId(null);
    if (result.success) refetch();
  };

  const mutationError = editItem ? patchMutation.error : createMutation.error;
  const mutationLoading = editItem ? patchMutation.loading : createMutation.loading;

  return (
    <div className={`container page-enter ${styles.page}`}>
      <div className={styles.titleRow}>
        <PageTitle
          badge="CRUD Demo"
          title="Example Records"
          subtitle="Live demonstration of the full API request flow: React → Axios → Express → Sequelize → MySQL."
        />
        <Button onClick={openCreate}>+ New Record</Button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <Card className={styles.formCard} padding="lg">
          <h2 className={styles.formTitle}>{editItem ? 'Edit Record' : 'Create New Record'}</h2>
          {mutationError && (
            <Alert type="error" className={styles.alertBox}>
              {mutationError}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              id="ex-title"
              label="Title"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Enter a title"
              required
            />
            <Textarea
              id="ex-description"
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Optional description…"
              rows={3}
            />
            <div className={styles.group}>
              <label htmlFor="ex-status" className={styles.label}>Status</label>
              <select
                id="ex-status"
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className={styles.select}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className={styles.formActions}>
              <Button type="button" variant="ghost" onClick={closeForm} disabled={mutationLoading}>
                Cancel
              </Button>
              <Button type="submit" loading={mutationLoading}>
                {editItem ? 'Save Changes' : 'Create Record'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List */}
      {loading && <LoadingSpinner center label="Loading records from database…" />}

      {error && !loading && (
        <Alert type="error" title="Could not load records">
          {error}
          {error.includes('server') || error.includes('reach') ? (
            <p style={{ marginTop: '8px', fontSize: 'var(--text-xs)' }}>
              Make sure the backend is running: <code>npm run dev:backend</code>
            </p>
          ) : null}
        </Alert>
      )}

      {!loading && !error && records.length === 0 && (
        <EmptyState
          icon="📭"
          title="No records yet"
          description="Create your first ExampleRecord to see it appear here."
          action={<Button onClick={openCreate}>Create First Record</Button>}
        />
      )}

      {!loading && !error && records.length > 0 && (
        <>
          <div className={styles.grid}>
            {records.map((item) => (
              <Card key={item.id} hoverable className={styles.recordCard}>
                <div className={styles.recordHeader}>
                  <span className={`${styles.badge} ${STATUS_COLORS[item.status] || ''}`}>
                    {item.status}
                  </span>
                  <span className={styles.recordId}>#{item.id}</span>
                </div>
                <h3 className={styles.recordTitle}>{item.title}</h3>
                {item.description && (
                  <p className={styles.recordDesc}>{item.description}</p>
                )}
                <div className={styles.recordMeta}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className={styles.recordActions}>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deleteMutation.loading && deleteId === item.id}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Previous
              </Button>
              <span className={styles.pageInfo}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}

      {deleteMutation.error && (
        <Alert type="error" className={styles.alertBox}>
          Delete failed: {deleteMutation.error}
        </Alert>
      )}
    </div>
  );
}

export default ExamplesPage;
