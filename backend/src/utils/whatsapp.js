/**
 * whatsapp.js — Generates WhatsApp click-to-chat links.
 */

export function sanitizePhoneNumber(phone) {
  if (!phone) return '';
  // Strip non-digits
  const digits = String(phone).replace(/\D/g, '');
  // If 10 digits (India domestic), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function buildWhatsAppLink(phone, messageText) {
  const cleanPhone = sanitizePhoneNumber(phone);
  const encodedText = encodeURIComponent(messageText.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function formatPackageWhatsAppMessage({ packageName, price, pinCode, customerName }) {
  let msg = `Hello Shyam Diagnostic Centre & MediNextGen,\nI am interested in booking/enquiring about: *${packageName}*`;
  if (price) msg += ` (₹${price})`;
  if (customerName) msg += `\nName: ${customerName}`;
  if (pinCode) msg += `\nPIN Code / Area: ${pinCode}`;
  msg += `\nPlease share available slots and home collection details.`;
  return msg;
}

export function formatHomeCollectionWhatsAppMessage({ pinCode, testOrPackage, customerName, address }) {
  let msg = `Hello Shyam Diagnostic Centre & MediNextGen,\nI would like to request *Home Sample Collection*.`;
  if (customerName) msg += `\nName: ${customerName}`;
  if (testOrPackage) msg += `\nTest/Package: ${testOrPackage}`;
  if (pinCode) msg += `\nPIN Code: ${pinCode}`;
  if (address) msg += `\nAddress: ${address}`;
  msg += `\nPlease confirm technician availability and timing.`;
  return msg;
}
