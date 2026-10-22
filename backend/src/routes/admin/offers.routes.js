import { Router } from 'express';
import {
  getAdminOffers,
  createAdminOffer,
  updateAdminOffer,
  deleteAdminOffer,
} from '../../controllers/admin/offers.controller.js';
import { authenticateAdmin } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { offerSchema } from '../../validators/catalogue.validator.js';

const router = Router();

router.use(authenticateAdmin);

router.get('/', getAdminOffers);
router.post('/', validate(offerSchema), createAdminOffer);
router.put('/:id', validate(offerSchema), updateAdminOffer);
router.delete('/:id', deleteAdminOffer);

export default router;
