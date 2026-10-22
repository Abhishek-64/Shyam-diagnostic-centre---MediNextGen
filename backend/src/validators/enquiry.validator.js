import { z } from 'zod';

export const createEnquirySchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(150, 'Name must not exceed 150 characters'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  pinCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'PIN code must be exactly 6 digits')
    .optional()
    .or(z.literal('')),
  city: z.string().trim().max(100).optional().or(z.literal('')),
  address: z.string().trim().max(1000).optional().or(z.literal('')),
  enquiryType: z.enum(
    ['home_collection', 'package_booking', 'test_booking', 'test_enquiry', 'all_india_service', 'general'],
    { invalid_type_error: 'Invalid enquiry type' }
  ).default('general'),
  preferredDate: z.string().optional().or(z.literal('')),
  preferredTimeSlot: z.string().trim().max(50).optional().or(z.literal('')),
  testId: z.coerce.number().int().positive().optional().nullable(),
  packageId: z.coerce.number().int().positive().optional().nullable(),
  additionalNotes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'scheduled', 'completed', 'cancelled']),
  note: z.string().trim().max(1000).optional(),
});
