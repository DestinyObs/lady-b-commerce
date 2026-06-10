import { Request, Response, NextFunction } from 'express';
import { ProductStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { cacheGet, cacheSet, cacheDel, cacheDelPattern, CACHE_TTL } from '../config/redis';
import { sendSuccess, sendCreated, sendPaginated, sendNotFound, getPaginationParams, paginate } from '../utils/response';
import { generateUniqueProductSlug } from '../utils/slug';
import { AuthRequest } from '../middlewares/auth.middleware';
import { NotFoundError } from '../middlewares/error.middleware';
import type { CreateProductInput, UpdateProductInput, ProductQuery } from '../schemas/product.schema';

const PRODUCT_SELECT = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  description: true,
  longDescription: true,
  story: true,
  materials: true,
  dimensions: true,
  careInstructions: true,
  craftDetails: true,
  price: true,
  compareAtPrice: true,
  taxable: true,
  weight: true,
  weightUnit: true,
  status: true,
  isFeatured: true,
  isBestSeller: true,
  isNewArrival: true,
  isMadeToOrder: true,
  isCustomizable: true,
  madeToOrderLeadDays: true,
  lowStockThreshold: true,
  seoTitle: true,
  seoDescription: true,
  seoKeywords: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { sortOrder: 'asc' as const }, select: { id: true, url: true, altText: true, isPrimary: true, sortOrder: true } },
  variants: { orderBy: { sortOrder: 'asc' as const } },
  _count: { select: { reviews: true } },
};

export async function getProducts(
  req: Request<{}, {}, {}, ProductQuery>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page, req.query.limit);
    const { search, categoryId, status, featured, bestSeller, newArrival, madeToOrder, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const where = {
      deletedAt: null,
      ...(status ? { status } : { status: ProductStatus.ACTIVE }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(categoryId && { categoryId }),
      ...(featured === 'true' && { isFeatured: true }),
      ...(bestSeller === 'true' && { isBestSeller: true }),
      ...(newArrival === 'true' && { isNewArrival: true }),
      ...(madeToOrder === 'true' && { isMadeToOrder: true }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: parseFloat(minPrice) }),
          ...(maxPrice && { lte: parseFloat(maxPrice) }),
        },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: PRODUCT_SELECT,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.product.count({ where }),
    ]);

    sendPaginated(res, products, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) { sendSuccess(res, cached); return; }

    const product = await prisma.product.findFirst({
      where: { id, deletedAt: null },
      select: PRODUCT_SELECT,
    });

    if (!product) { sendNotFound(res, 'Product'); return; }

    await cacheSet(cacheKey, product, CACHE_TTL.MEDIUM);
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const cacheKey = `product:slug:${slug}`;
    const cached = await cacheGet(cacheKey);
    if (cached) { sendSuccess(res, cached); return; }

    const product = await prisma.product.findFirst({
      where: { slug, deletedAt: null, status: ProductStatus.ACTIVE },
      select: PRODUCT_SELECT,
    });

    if (!product) { sendNotFound(res, 'Product'); return; }

    await cacheSet(cacheKey, product, CACHE_TTL.MEDIUM);
    sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(
  req: AuthRequest & { body: CreateProductInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { price, compareAtPrice, costPrice, ...rest } = req.body;
    const slug = await generateUniqueProductSlug(rest.name);

    const product = await prisma.product.create({
      data: {
        ...rest,
        slug,
        price,
        ...(compareAtPrice !== undefined && { compareAtPrice }),
        ...(costPrice !== undefined && { costPrice }),
      },
      select: PRODUCT_SELECT,
    });

    await cacheDelPattern('products:*');
    sendCreated(res, product, 'Product created');
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: AuthRequest & { body: UpdateProductInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findFirst({ where: { id, deletedAt: null } });
    if (!existing) { sendNotFound(res, 'Product'); return; }

    const updates: Record<string, unknown> = { ...req.body };
    if (req.body.name && req.body.name !== existing.name) {
      updates.slug = await generateUniqueProductSlug(req.body.name, id);
    }

    const product = await prisma.product.update({
      where: { id },
      data: updates,
      select: PRODUCT_SELECT,
    });

    await Promise.all([
      cacheDel(`product:${id}`),
      cacheDel(`product:slug:${existing.slug}`),
      cacheDelPattern('products:*'),
    ]);

    sendSuccess(res, product, 'Product updated');
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({ where: { id, deletedAt: null } });
    if (!product) { sendNotFound(res, 'Product'); return; }

    await prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
    await Promise.all([
      cacheDel(`product:${id}`),
      cacheDel(`product:slug:${product.slug}`),
      cacheDelPattern('products:*'),
    ]);

    sendSuccess(res, null, 'Product deleted');
  } catch (error) {
    next(error);
  }
}

export async function publishProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: { status: ProductStatus.ACTIVE, publishedAt: new Date() },
      select: { id: true, status: true, publishedAt: true },
    });
    await cacheDel(`product:${id}`);
    sendSuccess(res, product, 'Product published');
  } catch (error) {
    next(error);
  }
}

export async function archiveProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: { status: ProductStatus.ARCHIVED },
      select: { id: true, status: true },
    });
    await cacheDel(`product:${id}`);
    sendSuccess(res, product, 'Product archived');
  } catch (error) {
    next(error);
  }
}
