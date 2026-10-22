import { AuditLog } from '../database/models/index.js';
import logger from '../utils/logger.js';

export async function recordAuditLog({ action, entityType, entityId }) {
  // Audit logs removed from database per user specification
}
