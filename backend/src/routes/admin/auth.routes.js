import { Router } from 'express';
import { adminLogin, adminLogout, getAdminMe, updateAdminProfile } from '../../controllers/admin/auth.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginSchema, updateProfileSchema } from '../../validators/auth.validator.js';
import { authLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), adminLogin);
router.post('/logout', adminLogout);
router.get('/me', authenticateAdmin, getAdminMe);
router.patch('/profile', authenticateAdmin, validate(updateProfileSchema), updateAdminProfile);

export default router;
