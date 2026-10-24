import { Router } from 'express';
import { getAnalyticsOverview } from '../../controllers/analytics.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/overview', authenticateAdmin, getAnalyticsOverview);

export default router;
