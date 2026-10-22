import { Router } from 'express';
import {
  getAdminPartners,
  createAdminPartner,
  updateAdminPartner,
  deleteAdminPartner,
} from '../../controllers/admin/partners.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/', getAdminPartners);
router.post('/', createAdminPartner);
router.put('/:id', updateAdminPartner);
router.delete('/:id', deleteAdminPartner);

export default router;
