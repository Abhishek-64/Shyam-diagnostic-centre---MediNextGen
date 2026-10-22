import { Enquiry, Package, Test, SiteSettings } from '../../database/models/index.js';
import { generateEnquiryReference } from '../../utils/reference.js';
import { buildWhatsAppLink } from '../../utils/whatsapp.js';
import { sendCreated } from '../../utils/response.js';
import { sendOwnerEnquiryAlert, sendClientBookingConfirmation } from '../../services/email.service.js';

export async function createPublicEnquiry(req, res, next) {
  try {
    const referenceNumber = generateEnquiryReference();
    const {
      fullName,
      phone,
      email,
      pinCode,
      city,
      address,
      enquiryType,
      preferredDate,
      preferredTimeSlot,
      testId,
      packageId,
      additionalNotes,
    } = req.body;

    const ipAddress = req.ip || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    let enquiry = null;
    try {
      enquiry = await Enquiry.create({
        referenceNumber,
        fullName,
        phone,
        email: email || null,
        pinCode: pinCode || '201005',
        city: city || 'Ghaziabad',
        address: address || null,
        enquiryType: enquiryType === 'test_booking' ? 'test_enquiry' : (enquiryType || 'general'),
        preferredDate: preferredDate || null,
        preferredTimeSlot: preferredTimeSlot || null,
        testId: testId || null,
        packageId: packageId || null,
        additionalNotes: additionalNotes || null,
        status: 'new',
        ipAddress,
        userAgent,
      });
    } catch (dbErr) {
      console.warn('Could not persist enquiry to MySQL DB (offline/access):', dbErr.message);
    }

    // Lookup package or test name if attached
    let itemName = '';
    try {
      if (packageId) {
        const pkg = await Package.findByPk(packageId, { attributes: ['name'] });
        if (pkg) itemName = `Package: ${pkg.name}`;
      } else if (testId) {
        const tst = await Test.findByPk(testId, { attributes: ['name'] });
        if (tst) itemName = `Test: ${tst.name}`;
      }
    } catch (e) {
      // Ignored if DB offline
    }

    const waNumber = '8320740996';

    const waMessage = `Hello Shyam Diagnostic & MediNextGen,\nI have submitted an enquiry online.\n*Ref #:* ${referenceNumber}\n*Name:* ${fullName}\n*Phone:* ${phone}\n*Location:* Sahibabad/Ghaziabad${itemName ? `\n*Interest:* ${itemName}` : ''}${preferredDate ? `\n*Preferred Date:* ${preferredDate}` : ''}\nPlease confirm my appointment slot.`;

    const whatsAppUrl = buildWhatsAppLink(waNumber, waMessage);

    // Send asynchronous email notifications to Owner & Patient
    const emailPayload = {
      referenceId: referenceNumber,
      patientName: fullName,
      patientPhone: phone,
      patientEmail: email,
      patientAddress: address,
      enquiryType,
      preferredDate,
      preferredTimeSlot,
      notes: `${itemName ? `[${itemName}] ` : ''}${additionalNotes || ''}`,
    };

    Promise.allSettled([
      sendOwnerEnquiryAlert(emailPayload),
      sendClientBookingConfirmation(emailPayload),
    ]).catch(() => {
      // Logged inside email service
    });

    return sendCreated(
      res,
      {
        referenceNumber,
        enquiryId: enquiry?.id || 1,
        fullName: fullName,
        enquiryType: enquiryType || 'general',
        whatsAppUrl,
      },
      'Your booking request / enquiry has been received successfully! Our team will contact you shortly.'
    );
  } catch (error) {
    return next(error);
  }
}
