import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(50).trim().optional(),
  lastName: z.string().min(2).max(50).trim().optional(),
  phone: z.string().optional().nullable(),
});

export const createAddressSchema = z.object({
  label: z.string().max(50).optional(),
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  company: z.string().max(100).optional(),
  addressLine1: z.string().min(3).max(200).trim(),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1).max(100).trim(),
  state: z.string().min(1).max(100).trim(),
  postalCode: z.string().min(1).max(20).trim(),
  country: z.string().length(2).default('US'),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export const updateSettingsSchema = z.object({
  notifications: z
    .object({
      orderUpdates: z.boolean().optional(),
      promotions: z.boolean().optional(),
      newArrivals: z.boolean().optional(),
      newsletter: z.boolean().optional(),
    })
    .optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
