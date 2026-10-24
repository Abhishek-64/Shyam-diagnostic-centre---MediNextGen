import { Router } from 'express';
import {
  getAdminTests,
  getAdminTestById,
  createAdminTest,
  updateAdminTest,
  deleteAdminTest,
  bulkImportTestsFromCsv,
  getSampleTestsCsv,
} from '../../controllers/admin/tests.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { testSchema } from '../../validators/test.validator.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/sample-csv', getSampleTestsCsv);
router.post('/bulk-csv', bulkImportTestsFromCsv);

router.get('/', getAdminTests);
router.get('/:id', getAdminTestById);
router.post('/', validate(testSchema), createAdminTest);
router.put('/:id', validate(testSchema), updateAdminTest);
router.delete('/:id', deleteAdminTest);

export default router;
