import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import styles from './BulkCsvModal.module.css';

export default function BulkCsvModal({
  isOpen,
  onClose,
  title = 'Bulk Import CSV',
  sampleDownloadUrl = '/admin/tests/sample-csv',
  sampleFilename = 'sample_tests.csv',
  uploadEndpoint = '/admin/tests/bulk-csv',
  onSuccess,
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadingSample, setDownloadingSample] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  if (!isOpen) return null;

  const handleDownloadSample = async () => {
    try {
      setDownloadingSample(true);
      const res = await api.get(sampleDownloadUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', sampleFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Sample CSV downloaded successfully');
    } catch (err) {
      toast.error('Failed to download sample CSV template');
    } finally {
      setDownloadingSample(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith('.csv') && selected.type !== 'text/csv') {
        toast.error('Please select a valid .csv file');
        return;
      }
      setFile(selected);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file first');
      return;
    }

    try {
      setUploading(true);
      setResult(null);
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post(uploadEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setResult(res.data.data);
        toast.success(res.data.message || 'CSV imported successfully!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to import CSV';
      toast.error(msg);
      setResult({
        error: msg,
        details: err.response?.data?.errors || [],
      });
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <FileText size={20} className={styles.headerIcon} />
            <h3 className={styles.title}>{title}</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Sample Download Bar */}
          <div className={styles.sampleBar}>
            <div>
              <strong className={styles.sampleTitle}>Need the standard format?</strong>
              <p className={styles.sampleSubtitle}>
                Download our verified CSV template containing pre-filled sample rows and all column definitions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSample}
              disabled={downloadingSample}
              className={styles.sampleBtn}
            >
              {downloadingSample ? (
                <Loader2 size={15} className={styles.spin} />
              ) : (
                <Download size={15} />
              )}
              <span>Download Sample CSV</span>
            </button>
          </div>

          {/* Upload Area */}
          <div
            className={`${styles.dropzone} ${file ? styles.dropzoneActive : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,text/csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Upload size={32} className={styles.uploadIcon} />
            {file ? (
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>
                  {(file.size / 1024).toFixed(1)} KB • Click to choose a different file
                </span>
              </div>
            ) : (
              <div>
                <p className={styles.dropPrompt}>
                  <strong>Click to select</strong> or drag and drop your CSV file here
                </p>
                <span className={styles.dropHint}>Supports standard RFC4180 CSV files (*.csv)</span>
              </div>
            )}
          </div>

          {/* Result / Summary */}
          {result && !result.error && (
            <div className={styles.successAlert}>
              <CheckCircle2 size={18} className={styles.alertIconSuccess} />
              <div>
                <strong>Bulk Import Succeeded!</strong>
                <p>
                  Total Processed: <strong>{result.totalProcessed || 0}</strong> | Inserted:{' '}
                  <strong style={{ color: '#10b981' }}>{result.insertedCount || 0}</strong> | Updated:{' '}
                  <strong style={{ color: '#0284c7' }}>{result.updatedCount || 0}</strong>
                </p>
                {result.errors && result.errors.length > 0 && (
                  <div className={styles.skippedList}>
                    <span>Skipped {result.errors.length} row(s) due to formatting:</span>
                    <ul>
                      {result.errors.slice(0, 5).map((e, idx) => (
                        <li key={idx}>Row {e.row}: {e.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {result?.error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={18} className={styles.alertIconError} />
              <div>
                <strong>Import Failed:</strong>
                <p>{result.error}</p>
                {result.details && result.details.length > 0 && (
                  <ul className={styles.errorDetailsList}>
                    {result.details.slice(0, 5).map((e, idx) => (
                      <li key={idx}>{typeof e === 'string' ? e : e.message || JSON.stringify(e)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {file && !uploading && (
            <button type="button" onClick={handleReset} className={styles.resetBtn}>
              Clear
            </button>
          )}
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Close
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className={styles.uploadBtn}
          >
            {uploading ? (
              <>
                <Loader2 size={15} className={styles.spin} />
                <span>Importing CSV...</span>
              </>
            ) : (
              <>
                <Upload size={15} />
                <span>Upload & Import Records</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
