import { Router } from 'express';
import { getPublicOffers } from '../../controllers/public/offers.controller.js';

const router = Router();

router.get('/', getPublicOffers);

export default router;
