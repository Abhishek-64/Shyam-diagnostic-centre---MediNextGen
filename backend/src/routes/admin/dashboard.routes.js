import { Router } from 'express';
import { getDashboardStats } from '../../controllers/admin/dashboard.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/stats', authenticateAdmin, getDashboardStats);

export default router;
