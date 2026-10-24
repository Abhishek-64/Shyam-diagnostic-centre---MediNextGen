import { z } from 'zod';

export const packageSchema = z.object({
  name: z.string().trim().min(2, 'Package name is required').max(200),
  subtitle: z.string().trim().max(255).optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
  parametersCovered: z.coerce.number().int().min(0).default(0),
  fastDuration: z.string().trim().max(100).optional().or(z.literal('')),
  reportTime: z.string().trim().max(100).optional().or(z.literal('')),
  priceInPaise: z.coerce.number().int().min(0, 'Price must be positive'),
  originalPriceInPaise: z.coerce.number().int().min(0).optional().nullable(),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  hasOfferBadge: z.boolean().default(false),
  isHomeCollectionAvailable: z.boolean().default(true),
  priceVerified: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
  showPriceOnWebsite: z.boolean().default(true),
  showOriginalPrice: z.boolean().default(true),
  showFastDuration: z.boolean().default(true),
  showReportTime: z.boolean().default(true),
  testIds: z.array(z.coerce.number().int().positive()).optional(),
}).refine((data) => {
  // RULE: cannot be published if priceVerified is false
  if (data.isPublished && !data.priceVerified) {
    return false;
  }
  return true;
}, {
  message: 'Package cannot be published until prices and included parameters have been verified.',
  path: ['isPublished'],
});
