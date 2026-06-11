import { z } from 'zod';

export const createCollectionSchema = z.object({
  name: z.string().min(2).max(200).trim(),
  slug: z.string().min(2).max(200).trim().optional(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  imageUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

export const updateCollectionSchema = createCollectionSchema.partial();

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
