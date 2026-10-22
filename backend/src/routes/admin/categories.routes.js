import { Router } from 'express';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../../controllers/admin/categories.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { categorySchema } from '../../validators/catalogue.validator.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/', getAdminCategories);
router.post('/', validate(categorySchema), createAdminCategory);
router.put('/:id', validate(categorySchema), updateAdminCategory);
router.delete('/:id', deleteAdminCategory);

export default router;
