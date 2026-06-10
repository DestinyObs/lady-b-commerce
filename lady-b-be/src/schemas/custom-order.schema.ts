import { z } from 'zod';
import { CustomProductType, CustomOrderStatus } from '@prisma/client';

export const createCustomOrderSchema = z.object({
  productType: z.nativeEnum(CustomProductType),
  title: z.string().max(200).optional(),
  description: z.string().min(20, 'Please describe your vision in at least 20 characters').max(2000),
  colorPreferences: z.string().max(500).optional(),
  materialPreferences: z.string().max(500).optional(),
  measurements: z.string().max(500).optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  preferredTimeline: z.string().max(200).optional(),
  specialRequirements: z.string().max(1000).optional(),
}).refine(
  (data) => !data.budgetMin || !data.budgetMax || data.budgetMin <= data.budgetMax,
  { message: 'Budget minimum cannot exceed maximum', path: ['budgetMin'] },
);

export const sendQuoteSchema = z.object({
  amount: z.number().positive('Quote amount required'),
  depositAmount: z.number().positive('Deposit amount required'),
  finalAmount: z.number().positive('Final amount required'),
  details: z.string().min(20, 'Quote details required').max(2000),
  validUntil: z.string().datetime('Valid until date required'),
  estimatedCompletion: z.string().datetime().optional(),
});

export const updateCustomOrderStatusSchema = z.object({
  status: z.nativeEnum(CustomOrderStatus),
  adminNotes: z.string().max(1000).optional(),
  reason: z.string().max(500).optional(),
});

export type CreateCustomOrderInput = z.infer<typeof createCustomOrderSchema>;
export type SendQuoteInput = z.infer<typeof sendQuoteSchema>;
export type UpdateCustomOrderStatusInput = z.infer<typeof updateCustomOrderStatusSchema>;
