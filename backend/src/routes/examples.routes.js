import { Router } from 'express';
import {
  listExamples,
  getExample,
  createExample,
  updateExample,
  deleteExample,
} from '../controllers/exampleRecord.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createExampleRecordSchema,
  updateExampleRecordSchema,
  listQuerySchema,
  idParamSchema,
} from '../validators/exampleRecord.validator.js';

const router = Router();

// GET /api/v1/examples
router.get('/', validate(listQuerySchema, 'query'), listExamples);

// GET /api/v1/examples/:id
router.get('/:id', validate(idParamSchema, 'params'), getExample);

// POST /api/v1/examples
router.post('/', validate(createExampleRecordSchema, 'body'), createExample);

// PATCH /api/v1/examples/:id
router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateExampleRecordSchema, 'body'),
  updateExample
);

// DELETE /api/v1/examples/:id
router.delete('/:id', validate(idParamSchema, 'params'), deleteExample);

export default router;
