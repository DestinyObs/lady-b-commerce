import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendNotFound, getPaginationParams, sendPaginated, paginate } from '../utils/response';
import { cacheGet, cacheSet, CACHE_TTL } from '../config/redis';

const PRODUCT_SELECT = {
  id: true, name: true, slug: true, price: true, compareAtPrice: true, status: true,
  isFeatured: true, isBestSeller: true, isNewArrival: true, isMadeToOrder: true, stockQuantity: true,
  images: { where: { isPrimary: true }, take: 1, select: { url: true, altText: true } },
  category: { select: { name: true, slug: true } },
};

export async function getCollections(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cacheKey = 'collections:all';
    const cached = await cacheGet<unknown[]>(cacheKey);
    if (cached) { sendSuccess(res, cached, 'Collections retrieved'); return; }

    const collections = await prisma.collection.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: { _count: { select: { collectionProducts: true } } },
    });

    const data = collections.map((c) => ({ ...c, productCount: c._count.collectionProducts }));
    await cacheSet(cacheKey, data, CACHE_TTL.LONG);
    sendSuccess(res, data, 'Collections retrieved');
  } catch (err) { next(err); }
}

export async function getCollectionBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);

    const collection = await prisma.collection.findFirst({
      where: { slug, isActive: true },
      select: {
        id: true, name: true, slug: true, description: true, longDescription: true,
        imageUrl: true, bannerUrl: true, seoTitle: true, seoDescription: true, isFeatured: true,
      },
    });
    if (!collection) { sendNotFound(res, 'Collection'); return; }

    const productWhere = {
      collectionProducts: { some: { collectionId: collection.id } },
      status: 'ACTIVE' as const,
      deletedAt: null,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: productWhere,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: PRODUCT_SELECT,
      }),
      prisma.product.count({ where: productWhere }),
    ]);

    sendSuccess(res, { collection, products, pagination: paginate(page, limit, total) }, 'Collection retrieved');
  } catch (err) { next(err); }
}
