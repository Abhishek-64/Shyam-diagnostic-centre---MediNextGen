/**
 * reference.js — Unique enquiry reference generator.
 * Format: SDC-YYYYMMDD-XXXX
 */
import { customAlphabet } from 'nanoid';

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const generateSuffix = customAlphabet(alphabet, 4);

export function generateEnquiryReference() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `SDC-${dateStr}-${generateSuffix()}`;
}
