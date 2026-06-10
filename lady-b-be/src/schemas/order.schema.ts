import { z } from 'zod';
import { OrderStatus, PaymentProvider } from '@prisma/client';

export const createOrderSchema = z.object({
  shippingAddressId: z.string().min(1, 'Shipping address is required'),
  billingAddressId: z.string().optional(),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
  giftMessage: z.string().max(300).optional(),
  paymentProvider: z.nativeEnum(PaymentProvider),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  reason: z.string().optional(),
});

export const updateTrackingSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number required'),
  trackingUrl: z.string().url().optional(),
  shippingCarrier: z.string().optional(),
  estimatedDelivery: z.string().datetime().optional(),
});

export const refundOrderSchema = z.object({
  amount: z.number().positive('Refund amount must be positive'),
  reason: z.string().min(5, 'Reason required').max(500),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateTrackingInput = z.infer<typeof updateTrackingSchema>;
export type RefundOrderInput = z.infer<typeof refundOrderSchema>;
