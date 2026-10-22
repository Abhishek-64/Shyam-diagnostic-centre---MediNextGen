import { Router } from 'express';
import {
  getAdminEnquiries,
  getAdminEnquiryById,
  updateAdminEnquiryStatus,
  addAdminEnquiryNote,
} from '../../controllers/admin/enquiries.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateEnquiryStatusSchema } from '../../validators/enquiry.validator.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/', getAdminEnquiries);
router.get('/:id', getAdminEnquiryById);
router.patch('/:id/status', validate(updateEnquiryStatusSchema), updateAdminEnquiryStatus);
router.post('/:id/notes', addAdminEnquiryNote);

export default router;
