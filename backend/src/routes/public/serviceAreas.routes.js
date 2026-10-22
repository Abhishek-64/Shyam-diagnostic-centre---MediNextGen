import { Router } from 'express';
import { checkPinCodeAvailability } from '../../controllers/public/serviceAreas.controller.js';

const router = Router();

router.get('/check', checkPinCodeAvailability);

export default router;
