import { z } from 'zod';

export const testSchema = z.object({
  name: z.string().trim().min(2, 'Test name is required').max(200),
  categoryId: z.coerce.number().int().positive().optional().nullable(),
  code: z.string().trim().max(50).optional().or(z.literal('')),
  shortDescription: z.string().trim().max(500).optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
  preparationInstructions: z.string().trim().optional().or(z.literal('')),
  sampleType: z.string().trim().max(100).optional().or(z.literal('')),
  reportingTime: z.string().trim().max(100).optional().or(z.literal('')),
  priceInPaise: z.coerce.number().int().min(0).default(0),
  discountPriceInPaise: z.coerce.number().int().min(0).optional().nullable(),
  isPopular: z.boolean().default(false),
  hasOfferBadge: z.boolean().default(false),
  isHomeCollectionAvailable: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  showPriceOnWebsite: z.boolean().default(true),
  showSampleType: z.boolean().default(true),
  showReportingTime: z.boolean().default(true),
  showPreparationInstructions: z.boolean().default(true),
});
