import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Category name is required').max(100),
  description: z.string().trim().optional().or(z.literal('')),
  iconName: z.string().trim().max(50).optional().or(z.literal('')),
  displayOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const offerSchema = z.object({
  title: z.string().trim().min(2, 'Offer title is required').max(200),
  code: z.string().trim().max(50).optional().or(z.literal('')),
  description: z.string().trim().optional().or(z.literal('')),
  discountPercentage: z.coerce.number().int().min(1).max(100).optional().nullable(),
  discountAmountInPaise: z.coerce.number().int().min(0).optional().nullable(),
  validFrom: z.string().optional().or(z.literal('')),
  validUntil: z.string().optional().or(z.literal('')),
  bannerText: z.string().trim().max(255).optional().or(z.literal('')),
  isVerified: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export const serviceAreaSchema = z.object({
  pinCode: z.string().trim().regex(/^\d{6}$/, 'PIN code must be exactly 6 digits'),
  areaName: z.string().trim().min(2, 'Area name is required').max(150),
  city: z.string().trim().min(2, 'City is required').max(100),
  state: z.string().trim().min(2).max(100).default('Gujarat'),
  isHomeCollectionActive: z.boolean().default(true),
  isAllIndiaPartner: z.boolean().default(false),
  notes: z.string().trim().optional().or(z.literal('')),
});
