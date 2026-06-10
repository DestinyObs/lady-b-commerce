import { z } from 'zod';
import { ProductStatus } from '@prisma/client';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name required').max(200).trim(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  story: z.string().optional(),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  careInstructions: z.string().optional(),
  craftDetails: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  compareAtPrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  taxable: z.boolean().default(true),
  weight: z.number().positive().optional(),
  weightUnit: z.string().default('oz'),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isMadeToOrder: z.boolean().default(false),
  isCustomizable: z.boolean().default(false),
  madeToOrderLeadDays: z.number().int().positive().optional(),
  lowStockThreshold: z.number().int().min(0).default(5),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords: z.string().optional(),
  categoryId: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  featured: z.string().optional(),
  bestSeller: z.string().optional(),
  newArrival: z.string().optional(),
  madeToOrder: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  sortBy: z.enum(['price', 'name', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const createVariantSchema = z.object({
  name: z.string().min(1).max(100),
  sku: z.string().optional(),
  color: z.string().optional(),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  inventoryCount: z.number().int().min(0).default(0),
  isAvailable: z.boolean().default(true),
  weight: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
