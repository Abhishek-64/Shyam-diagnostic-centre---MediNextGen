import { Router } from 'express';
import { getPublicSiteSettings } from '../../controllers/public/settings.controller.js';

const router = Router();

router.get('/', getPublicSiteSettings);

export default router;
