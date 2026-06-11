import { z } from 'zod';
import { DiscountType } from '@prisma/client';

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(32)
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, 'Code may only contain letters, numbers, dashes and underscores'),
  description: z.string().optional(),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().positive(),
  minimumOrderAmount: z.number().min(0).optional(),
  maximumDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  applicableProducts: z.array(z.string()).default([]),
  applicableCategories: z.array(z.string()).default([]),
});

export const updateCouponSchema = createCouponSchema.partial();

export const validateCouponSchema = z.object({
  code: z.string().min(1).trim().toUpperCase(),
  subtotal: z.number().positive(),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
