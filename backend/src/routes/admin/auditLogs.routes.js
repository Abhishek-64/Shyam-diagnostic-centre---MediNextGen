import { Router } from 'express';
import { getAdminAuditLogs } from '../../controllers/admin/auditLogs.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/', getAdminAuditLogs);

export default router;
