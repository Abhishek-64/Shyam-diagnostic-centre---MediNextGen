import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Phone,
  MessageCircle,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  Calendar,
} from 'lucide-react';
import api from '../../services/api.js';
import Pagination from '../../components/common/Pagination.jsx';
import Modal from '../../components/common/Modal.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './AdminEnquiriesPage.module.css';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  // Detail Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const toast = useToast();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      let url = `/admin/enquiries?page=${page}&limit=15`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await api.get(url);
      if (res.data?.success) {
        setEnquiries(res.data.data.items || []);
        setMeta(res.data.data.meta || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, statusFilter, search]);

  const openDetail = async (id) => {
    try {
      setDetailLoading(true);
      setModalOpen(true);
      const res = await api.get(`/admin/enquiries/${id}`);
      if (res.data?.success) {
        setSelectedEnquiry(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load enquiry details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const res = await api.patch(`/admin/enquiries/${enquiryId}/status`, {
        status: newStatus,
      });
      if (res.data?.success) {
        toast.success(`Status updated to ${newStatus}`);
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
        fetchEnquiries();
      }
    } catch (err) {
      toast.error('Failed to update enquiry status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const res = await api.post(`/admin/enquiries/${selectedEnquiry.id}/notes`, {
        note: newNote.trim(),
      });
      if (res.data?.success) {
        toast.success('Internal note added');
        setNewNote('');
        // Refresh details
        const updated = await api.get(`/admin/enquiries/${selectedEnquiry.id}`);
        setSelectedEnquiry(updated.data.data);
      }
    } catch (err) {
      toast.error('Failed to add note');
    }
  };

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'New', value: 'new' },
    { label: 'Contacted', value: 'contacted' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Patient Bookings & Enquiries</h1>
          <p className={styles.subtitle}>
            Manage patient slot requests, home pickup schedules, and clinical staff notes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filtersBar}>
        <div className={styles.tabs}>
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`${styles.tabBtn} ${statusFilter === tab.value ? styles.activeTab : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Ref #, Name, Phone, PIN..."
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reference #</th>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>PIN Code</th>
                <th>Type</th>
                <th>Item of Interest</th>
                <th>Status</th>
                <th>Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className={styles.loadingCell}>
                    Loading enquiries...
                  </td>
                </tr>
              ) : enquiries.length > 0 ? (
                enquiries.map((enq) => {
                  const item = enq.package?.name || enq.test?.name || 'General Inquiry';
                  return (
                    <tr key={enq.id}>
                      <td className={styles.refCell}>{enq.referenceNumber}</td>
                      <td className={styles.patientName}>{enq.fullName}</td>
                      <td>
                        <a href={`tel:${enq.phone}`} className={styles.phoneLink}>
                          {enq.phone}
                        </a>
                      </td>
                      <td>{enq.pinCode}</td>
                      <td>
                        <span className={styles.typeBadge}>
                          {enq.enquiryType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className={styles.itemCell} title={item}>
                        {item}
                      </td>
                      <td>
                        <select
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                          className={`${styles.statusSelect} ${styles[enq.status]}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className={styles.actionBtns}>
                          <a
                            href={`https://wa.me/91${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.fullName)}%2C%20regarding%20your%20diagnostic%20booking%20(Ref%3A%20${enq.referenceNumber})%20with%20Shyam%20Diagnostic.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.waIconBtn}
                            title="Chat with Patient on WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </a>
                          <button
                            onClick={() => openDetail(enq.id)}
                            className={styles.detailBtn}
                            title="View Full Booking Details & Staff Notes"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className={styles.noData}>
                    No patient enquiries matching active filters.
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

      {/* Enquiry Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedEnquiry ? `Booking: ${selectedEnquiry.referenceNumber}` : 'Enquiry Detail'}
        maxWidth="680px"
      >
        {detailLoading || !selectedEnquiry ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading details...</p>
        ) : (
          <div className={styles.modalContent}>
            <div className={styles.modalHeaderRow}>
              <div>
                <span className={styles.modalName}>{selectedEnquiry.fullName}</span>
                <span className={styles.modalPhone}>Phone: {selectedEnquiry.phone}</span>
                {selectedEnquiry.email && (
                  <span className={styles.modalEmail}>Email: {selectedEnquiry.email}</span>
                )}
              </div>
              <div>
                <span className={`${styles.statusBadge} ${styles[selectedEnquiry.status]}`}>
                  Status: {selectedEnquiry.status}
                </span>
              </div>
            </div>

            <div className={styles.modalGrid2}>
              <div>
                <span className={styles.infoLabel}>PIN Code / Location</span>
                <p className={styles.infoVal}>
                  PIN: {selectedEnquiry.pinCode}
                  {selectedEnquiry.city ? ` (${selectedEnquiry.city})` : ''}
                </p>
              </div>

              <div>
                <span className={styles.infoLabel}>Enquiry Type</span>
                <p className={styles.infoVal} style={{ textTransform: 'capitalize' }}>
                  {selectedEnquiry.enquiryType.replace('_', ' ')}
                </p>
              </div>

              <div>
                <span className={styles.infoLabel}>Preferred Appointment</span>
                <p className={styles.infoVal}>
                  {selectedEnquiry.preferredDate || 'Earliest available'}
                  {selectedEnquiry.preferredTimeSlot ? ` • ${selectedEnquiry.preferredTimeSlot}` : ''}
                </p>
              </div>

              <div>
                <span className={styles.infoLabel}>Item of Interest</span>
                <p className={styles.infoVal}>
                  {selectedEnquiry.package?.name || selectedEnquiry.test?.name || 'General Inquiry'}
                </p>
              </div>
            </div>

            {selectedEnquiry.address && (
              <div className={styles.modalBlock}>
                <span className={styles.infoLabel}>Complete Patient Address</span>
                <p className={styles.addressBox}>{selectedEnquiry.address}</p>
              </div>
            )}

            {selectedEnquiry.additionalNotes && (
              <div className={styles.modalBlock}>
                <span className={styles.infoLabel}>Patient's Notes / Doctor Prescription</span>
                <p className={styles.notesBox}>{selectedEnquiry.additionalNotes}</p>
              </div>
            )}

            {/* Quick Status Update Selector */}
            <div className={styles.statusUpdateRow}>
              <span className={styles.infoLabel}>Update Booking Status:</span>
              <div className={styles.statusButtons}>
                {['contacted', 'scheduled', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                    disabled={selectedEnquiry.status === st || updatingStatus}
                    className={`${styles.stBtn} ${selectedEnquiry.status === st ? styles.stBtnActive : ''}`}
                  >
                    Mark {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Staff Notes Section */}
            <div className={styles.notesSection}>
              <h4>Internal Clinical & Dispatch Notes</h4>
              <form onSubmit={handleAddNote} className={styles.noteForm}>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add note (e.g. Called patient, phlebotomist Ramesh assigned)..."
                  className={styles.noteInput}
                />
                <button type="submit" className={styles.addNoteBtn}>
                  <Plus size={16} /> Add Note
                </button>
              </form>

              <div className={styles.notesHistory}>
                {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                  selectedEnquiry.notes.map((n) => (
                    <div key={n.id} className={styles.noteItem}>
                      <p className={styles.noteText}>{n.note}</p>
                      <span className={styles.noteMeta}>
                        {n.adminUser ? n.adminUser.name : 'System'} •{' '}
                        {new Date(n.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className={styles.noNotes}>No notes recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
