import { Router } from 'express';
import { getAdminSettings, updateAdminSetting } from '../../controllers/admin/settings.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/', getAdminSettings);
router.put('/:key', updateAdminSetting);

export default router;
