import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendNotFound, sendCreated } from '../utils/response';
import { cacheGet, cacheSet, cacheDel, CACHE_TTL } from '../config/redis';
import { AuthRequest } from '../middlewares/auth.middleware';

export async function getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cacheKey = 'categories:all';
    const cached = await cacheGet<unknown[]>(cacheKey);
    if (cached) { sendSuccess(res, cached, 'Categories retrieved'); return; }

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true, name: true, slug: true, description: true,
        imageUrl: true, parentId: true, sortOrder: true,
        _count: { select: { products: true } },
      },
    });

    await cacheSet(cacheKey, categories, CACHE_TTL.LONG);
    sendSuccess(res, categories, 'Categories retrieved');
  } catch (err) { next(err); }
}

export async function adminGetCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
    sendSuccess(res, categories, 'Categories retrieved');
  } catch (err) { next(err); }
}

export async function adminCreateCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, slug, description, imageUrl, parentId, sortOrder, isActive } = req.body as {
      name: string; slug?: string; description?: string; imageUrl?: string;
      parentId?: string; sortOrder?: number; isActive?: boolean;
    };

    const finalSlug = slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const category = await prisma.category.create({
      data: { name, slug: finalSlug, description, imageUrl, parentId, sortOrder: sortOrder ?? 0, isActive: isActive ?? true },
    });
    await cacheDel('categories:all');
    sendCreated(res, category, 'Category created');
  } catch (err) { next(err); }
}

export async function adminUpdateCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });
    await cacheDel('categories:all');
    sendSuccess(res, category, 'Category updated');
  } catch (err) { next(err); }
}

export async function adminDeleteCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id }, select: { _count: { select: { products: true } } } });
    if (!existing) { sendNotFound(res, 'Category'); return; }
    if (existing._count.products > 0) {
      sendSuccess(res, null, 'Cannot delete category with associated products');
      return;
    }
    await prisma.category.delete({ where: { id: req.params.id } });
    await cacheDel('categories:all');
    sendSuccess(res, null, 'Category deleted');
  } catch (err) { next(err); }
}
