import { Router } from 'express';
import { getPublicPackages, getPublicPackageBySlug } from '../../controllers/public/packages.controller.js';

const router = Router();

router.get('/', getPublicPackages);
router.get('/:slug', getPublicPackageBySlug);

export default router;
