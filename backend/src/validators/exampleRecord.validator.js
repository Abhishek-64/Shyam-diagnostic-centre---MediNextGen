/**
 * exampleRecord.validator.js
 *
 * Zod schemas for ExampleRecord request validation.
 */

import { z } from 'zod';

export const createExampleRecordSchema = z.object({
  title: z
    .string({ required_error: 'Title is required.' })
    .min(1, 'Title must not be empty.')
    .max(255, 'Title must be at most 255 characters.'),
  description: z
    .string()
    .max(5000, 'Description must be at most 5000 characters.')
    .nullish()
    .transform((v) => v ?? null),
  status: z
    .enum(['active', 'inactive', 'archived'], {
      errorMap: () => ({ message: 'Status must be one of: active, inactive, archived.' }),
    })
    .default('active'),
});

export const updateExampleRecordSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must not be empty.')
    .max(255, 'Title must be at most 255 characters.')
    .optional(),
  description: z
    .string()
    .max(5000, 'Description must be at most 5000 characters.')
    .nullish()
    .transform((v) => v ?? null)
    .optional(),
  status: z
    .enum(['active', 'inactive', 'archived'], {
      errorMap: () => ({ message: 'Status must be one of: active, inactive, archived.' }),
    })
    .optional(),
});

export const listQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1, 'Page must be at least 1.')),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .pipe(z.number().int().min(1).max(100, 'Limit must be at most 100.')),
  status: z
    .enum(['active', 'inactive', 'archived'])
    .optional(),
});

export const idParamSchema = z.object({
  id: z
    .string({ required_error: 'ID is required.' })
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().positive('ID must be a positive integer.')),
});
