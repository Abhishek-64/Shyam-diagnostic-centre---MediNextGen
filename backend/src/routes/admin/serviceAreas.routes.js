import { Router } from 'express';
import {
  getAdminServiceAreas,
  createAdminServiceArea,
  updateAdminServiceArea,
  deleteAdminServiceArea,
} from '../../controllers/admin/serviceAreas.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { serviceAreaSchema } from '../../validators/catalogue.validator.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/', getAdminServiceAreas);
router.post('/', validate(serviceAreaSchema), createAdminServiceArea);
router.put('/:id', validate(serviceAreaSchema), updateAdminServiceArea);
router.delete('/:id', deleteAdminServiceArea);

export default router;
