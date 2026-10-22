import { Router } from 'express';
import { getPublicTests, getPublicTestBySlug } from '../../controllers/public/tests.controller.js';

const router = Router();

router.get('/', getPublicTests);
router.get('/:slug', getPublicTestBySlug);

export default router;
