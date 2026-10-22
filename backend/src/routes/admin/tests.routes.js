import { Router } from 'express';
import {
  getAdminTests,
  getAdminTestById,
  createAdminTest,
  updateAdminTest,
  deleteAdminTest,
} from '../../controllers/admin/tests.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { testSchema } from '../../validators/test.validator.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/', getAdminTests);
router.get('/:id', getAdminTestById);
router.post('/', validate(testSchema), createAdminTest);
router.put('/:id', validate(testSchema), updateAdminTest);
router.delete('/:id', deleteAdminTest);

export default router;
