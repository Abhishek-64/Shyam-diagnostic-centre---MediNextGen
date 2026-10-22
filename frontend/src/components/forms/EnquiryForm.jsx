import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Calendar, Clock, MapPin, User, Phone, Mail, Loader2, Building2 } from 'lucide-react';
import api from '../../services/api.js';
import styles from './EnquiryForm.module.css';

export default function EnquiryForm({
  initialType = 'general',
  initialPackageId = null,
  initialTestId = null,
  itemName = '',
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    pinCode: '',
    city: '',
    address: '',
    enquiryType: initialType === 'home_collection' ? 'test_booking' : initialType,
    preferredDate: '',
    preferredTimeSlot: '7:00 AM - 9:00 AM (Fasting Sample)',
    additionalNotes: '',
    packageId: initialPackageId,
    testId: initialTestId,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode.trim())) {
      errs.pinCode = 'PIN code must be exactly 6 digits.';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post('/enquiries', formData);
      if (res.data?.success) {
        setSubmittedData(res.data.data);
        if (onSuccess) onSuccess(res.data.data);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ form: err.response?.data?.message || 'Submission failed. Please try again or message on WhatsApp.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Success Confirmation State
  if (submittedData) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIconBox}>
          <CheckCircle2 size={40} className={styles.successIcon} />
        </div>
        <h3 className={styles.successTitle}>Booking Request Submitted!</h3>
        <p className={styles.successSubtitle}>
          Thank you, <strong>{submittedData.fullName}</strong>. Your enquiry has been registered.
        </p>

        <div className={styles.refBox}>
          <span className={styles.refLabel}>Booking Reference Number:</span>
          <span className={styles.refNumber}>{submittedData.referenceNumber}</span>
        </div>

        <p className={styles.followupText}>
          Our clinical coordinators will contact you shortly to confirm your booking, sample timings, and appointment details.
        </p>

        {submittedData.whatsAppUrl && (
          <div className={styles.whatsappActionBox}>
            <a
              href={submittedData.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waDirectBtn}
            >
              <MessageCircle size={20} />
              <span>Connect on WhatsApp with Ref #{submittedData.referenceNumber}</span>
            </a>
            <span className={styles.waHint}>
              Click above to instantly send your reference number to our diagnostic support team on WhatsApp.
            </span>
          </div>
        )}

        <button
          onClick={() => {
            setSubmittedData(null);
            setFormData({
              fullName: '',
              phone: '',
              email: '',
              pinCode: '',
              city: 'Ghaziabad',
              address: '',
              enquiryType: initialType === 'home_collection' ? 'test_booking' : initialType,
              preferredDate: '',
              preferredTimeSlot: '7:00 AM - 9:00 AM (Fasting Sample)',
              additionalNotes: '',
              packageId: initialPackageId,
              testId: initialTestId,
            });
          }}
          className={styles.newEnquiryBtn}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  // Today's date in YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {itemName && (
        <div className={styles.selectedItemBanner}>
          <span>Selected Service:</span>
          <strong>{itemName}</strong>
        </div>
      )}

      {errors.form && <div className={styles.formErrorAlert}>{errors.form}</div>}

      <div className={styles.grid2}>
        {/* Full Name */}
        <div className={styles.field}>
          <label htmlFor="fullName" className={styles.label}>
            Full Name <span className={styles.req}>*</span>
          </label>
          <div className={styles.inputWrap}>
            <User size={16} className={styles.inputIcon} />
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Ramesh Patel"
              className={`${styles.input} ${errors.fullName ? styles.inputError : ''}`}
            />
          </div>
          {errors.fullName && <span className={styles.fieldError}>{errors.fullName}</span>}
        </div>

        {/* Mobile Number */}
        <div className={styles.field}>
          <label htmlFor="phone" className={styles.label}>
            Mobile Number (WhatsApp) <span className={styles.req}>*</span>
          </label>
          <div className={styles.inputWrap}>
            <Phone size={16} className={styles.inputIcon} />
            <input
              id="phone"
              type="tel"
              name="phone"
              maxLength={10}
              value={formData.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'phone', value: val } });
              }}
              placeholder="10-digit mobile number"
              className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
            />
          </div>
          {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
        </div>
      </div>

      <div className={styles.grid2}>
        {/* PIN Code */}
        <div className={styles.field}>
          <label htmlFor="pinCode" className={styles.label}>
            PIN Code <span className={styles.opt}>(Optional)</span>
          </label>
          <div className={styles.inputWrap}>
            <MapPin size={16} className={styles.inputIcon} />
            <input
              id="pinCode"
              type="text"
              name="pinCode"
              maxLength={6}
              value={formData.pinCode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                handleChange({ target: { name: 'pinCode', value: val } });
              }}
              placeholder="6-digit PIN (e.g. 201005)"
              className={`${styles.input} ${errors.pinCode ? styles.inputError : ''}`}
            />
          </div>
          {errors.pinCode && <span className={styles.fieldError}>{errors.pinCode}</span>}
        </div>

        {/* City */}
        <div className={styles.field}>
          <label htmlFor="city" className={styles.label}>
            City / Area
          </label>
          <div className={styles.inputWrap}>
            <Building2 size={16} className={styles.inputIcon} />
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. City / Area"
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className={styles.field}>
        <label htmlFor="address" className={styles.label}>
          Address / Location <span className={styles.opt}>(Optional)</span>
        </label>
        <textarea
          id="address"
          name="address"
          rows={2}
          value={formData.address}
          onChange={handleChange}
          placeholder="House / Flat No., Society, Street, Landmark"
          className={`${styles.textarea} ${errors.address ? styles.inputError : ''}`}
        />
        {errors.address && <span className={styles.fieldError}>{errors.address}</span>}
      </div>

      <div className={styles.grid2}>
        {/* Preferred Date */}
        <div className={styles.field}>
          <label htmlFor="preferredDate" className={styles.label}>
            Preferred Collection Date
          </label>
          <div className={styles.inputWrap}>
            <Calendar size={16} className={styles.inputIcon} />
            <input
              id="preferredDate"
              type="date"
              name="preferredDate"
              min={todayStr}
              value={formData.preferredDate}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        {/* Time Slot */}
        <div className={styles.field}>
          <label htmlFor="preferredTimeSlot" className={styles.label}>
            Preferred Time Slot
          </label>
          <div className={styles.inputWrap}>
            <Clock size={16} className={styles.inputIcon} />
            <select
              id="preferredTimeSlot"
              name="preferredTimeSlot"
              value={formData.preferredTimeSlot}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="7:00 AM - 9:00 AM (Fasting Sample)">7:00 AM – 9:00 AM (Fasting)</option>
              <option value="9:00 AM - 11:00 AM">9:00 AM – 11:00 AM</option>
              <option value="11:00 AM - 1:00 PM">11:00 AM – 1:00 PM</option>
              <option value="1:00 PM - 4:00 PM">1:00 PM – 4:00 PM</option>
              <option value="4:00 PM - 7:00 PM">4:00 PM – 7:00 PM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Email (Optional) */}
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email Address (Optional — for digital PDF report)
        </label>
        <div className={styles.inputWrap}>
          <Mail size={16} className={styles.inputIcon} />
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="patient@example.com"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          />
        </div>
        {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
      </div>

      {/* Additional Notes */}
      <div className={styles.field}>
        <label htmlFor="additionalNotes" className={styles.label}>
          Additional Health Notes or Doctor Prescription Details
        </label>
        <textarea
          id="additionalNotes"
          name="additionalNotes"
          rows={2}
          value={formData.additionalNotes}
          onChange={handleChange}
          placeholder="Mention any specific doctor instructions or prescription notes..."
          className={styles.textarea}
        />
      </div>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? (
          <>
            <Loader2 size={18} className={styles.spin} />
            <span>Submitting Request...</span>
          </>
        ) : (
          <span>Confirm & Book Diagnostic Test / Package</span>
        )}
      </button>

      <p className={styles.disclaimerNote}>
        🔒 Your personal details are confidential and secured under healthcare privacy standards.
      </p>
    </form>
  );
}
