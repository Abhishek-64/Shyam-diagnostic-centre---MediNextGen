import { Router } from 'express';
import {
  getAdminPackages,
  getAdminPackageById,
  createAdminPackage,
  updateAdminPackage,
  verifyAdminPackage,
  publishAdminPackage,
  deleteAdminPackage,
  bulkImportPackagesFromCsv,
  getSamplePackagesCsv,
} from '../../controllers/admin/packages.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { packageSchema } from '../../validators/package.validator.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/sample-csv', getSamplePackagesCsv);
router.post('/bulk-csv', bulkImportPackagesFromCsv);

router.get('/', getAdminPackages);
router.get('/:id', getAdminPackageById);
router.post('/', validate(packageSchema), createAdminPackage);
router.put('/:id', validate(packageSchema), updateAdminPackage);
router.patch('/:id/verify', verifyAdminPackage);
router.patch('/:id/publish', publishAdminPackage);
router.delete('/:id', deleteAdminPackage);

export default router;
