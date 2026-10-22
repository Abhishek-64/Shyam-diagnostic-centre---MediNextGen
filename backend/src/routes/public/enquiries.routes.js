import { Router } from 'express';
import { createPublicEnquiry } from '../../controllers/public/enquiries.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createEnquirySchema } from '../../validators/enquiry.validator.js';
import { enquiryLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();

router.post('/', enquiryLimiter, validate(createEnquirySchema), createPublicEnquiry);

export default router;
