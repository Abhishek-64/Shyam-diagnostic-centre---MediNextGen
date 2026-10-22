import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import logger from '../utils/logger.js';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Send booking notification email to Centre Owner / Administrator
 */
export async function sendOwnerEnquiryAlert(enquiry) {
  try {
    const mailer = getTransporter();

    const subject = `🚨 New Diagnostic Booking Alert: ${enquiry.referenceId} - ${enquiry.patientName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #143566; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">Shyam Diagnostic & MediNextGen Healthcare</h2>
          <p style="margin: 5px 0 0; font-size: 13px; color: #93c5fd;">Immediate Booking / Enquiry Alert</p>
        </div>

        <div style="padding: 24px; color: #1e293b;">
          <p style="font-size: 16px;"><strong>A new diagnostic booking inquiry has been received:</strong></p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;"><strong>Reference ID:</strong></td>
              <td style="padding: 8px 0; color: #143566; font-weight: bold;">${enquiry.referenceId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;"><strong>Patient Name:</strong></td>
              <td style="padding: 8px 0;">${enquiry.patientName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
              <td style="padding: 8px 0;"><a href="tel:${enquiry.patientPhone}" style="color: #009960; text-decoration: none; font-weight: bold;">${enquiry.patientPhone}</a></td>
            </tr>
            ${
              enquiry.patientEmail
                ? `<tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0;">${enquiry.patientEmail}</td>
                  </tr>`
                : ''
            }
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;"><strong>Booking Type:</strong></td>
              <td style="padding: 8px 0; text-transform: capitalize;">${enquiry.enquiryType || 'General Consultation'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;"><strong>Preferred Date:</strong></td>
              <td style="padding: 8px 0;">${enquiry.preferredDate || 'Earliest Available'} (${enquiry.preferredTimeSlot || 'Morning'})</td>
            </tr>
            ${
              enquiry.patientAddress
                ? `<tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; color: #64748b;"><strong>Patient Address:</strong></td>
                    <td style="padding: 8px 0;">${enquiry.patientAddress}</td>
                  </tr>`
                : ''
            }
            ${
              enquiry.notes
                ? `<tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 8px 0; color: #64748b;"><strong>Symptoms / Notes:</strong></td>
                    <td style="padding: 8px 0;">${enquiry.notes}</td>
                  </tr>`
                : ''
            }
          </table>

          <div style="background-color: #f8fafc; border-radius: 6px; padding: 12px; margin-top: 16px; text-align: center;">
            <p style="margin: 0; font-size: 13px; color: #475569;">
              <strong>Centre Address:</strong> 235/G1, Gali No. 4, Shyam Park Main, Sahibabad, Ghaziabad, UP
            </p>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8;">
          Sent automatically by Shyam Diagnostic Centre & MediNextGen Notification Service
        </div>
      </div>
    `;

    const info = await mailer.sendMail({
      from: `"Shyam Diagnostic Centre" <${env.SMTP_USER}>`,
      to: env.ADMIN_EMAIL,
      subject,
      html,
    });

    logger.info({ messageId: info.messageId, ref: enquiry.referenceId }, 'Owner email alert sent successfully');
    return info;
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to send owner booking email alert');
  }
}

/**
 * Send booking receipt email to the Patient/Client
 */
export async function sendClientBookingConfirmation(enquiry) {
  if (!enquiry.patientEmail) return;

  try {
    const mailer = getTransporter();

    const subject = `Confirmation: Your Diagnostic Booking with Shyam Diagnostic [${enquiry.referenceId}]`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #143566, #009960); color: #ffffff; padding: 24px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px;">Shyam Diagnostic Centre</h2>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">MediNextGen Healthcare • 2,000+ Tests Catalogue</p>
        </div>

        <div style="padding: 24px; color: #1e293b;">
          <h3 style="color: #143566; margin-top: 0;">Dear ${enquiry.patientName},</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Thank you for scheduling with Shyam Diagnostic Centre. We have received your booking details and our laboratory desk is preparing your test slot.
          </p>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #166534;">Your Booking Reference Number:</p>
            <p style="margin: 4px 0 0; font-size: 20px; font-weight: bold; color: #14532d; letter-spacing: 0.05em;">
              ${enquiry.referenceId}
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Preferred Appointment Date:</td>
              <td style="padding: 8px 0; font-weight: bold;">${enquiry.preferredDate || 'Earliest Slot'} (${enquiry.preferredTimeSlot || 'Morning'})</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Laboratory Hotline:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #009960;">+91 8320740996</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Laboratory Address:</td>
              <td style="padding: 8px 0;">235/G1, Gali No. 4, Shyam Park Main, Sahibabad, Ghaziabad, UP - 201005</td>
            </tr>
          </table>

          <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-top: 16px; font-size: 12px; color: #92400e;">
            <strong>Important Preparation:</strong> If your booking includes Blood Glucose (Fasting) or Lipid Profile, please maintain 10-12 hours of overnight fasting (water is permitted).
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
            Need to change your time slot? Please WhatsApp or call our desk directly at <strong>+91 8320740996</strong> with your reference number <strong>${enquiry.referenceId}</strong>.
          </p>
        </div>

        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px; text-align: center; font-size: 11px; color: #64748b;">
          © ${new Date().getFullYear()} Shyam Diagnostic Centre & MediNextGen Healthcare • All Rights Reserved
        </div>
      </div>
    `;

    const info = await mailer.sendMail({
      from: `"Shyam Diagnostic Centre" <${env.SMTP_USER}>`,
      to: enquiry.patientEmail,
      subject,
      html,
    });

    logger.info({ messageId: info.messageId, to: enquiry.patientEmail }, 'Client confirmation email sent successfully');
    return info;
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to send client confirmation email');
  }
}
