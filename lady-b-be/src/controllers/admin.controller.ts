import { Request, Response, NextFunction } from 'express';
import { OrderStatus, CustomOrderStatus, UserRole } from '@prisma/client';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendNotFound, sendError, sendPaginated, getPaginationParams, paginate } from '../utils/response';
import { sendEmail } from '../utils/email';
import { generateUniqueCollectionSlug } from '../utils/slug';
import { cacheDel } from '../config/redis';
import { env } from '../config/env';
import type { CreateCollectionInput, UpdateCollectionInput } from '../schemas/collection.schema';
import type { CreateCouponInput, UpdateCouponInput } from '../schemas/coupon.schema';
import { AuthRequest } from '../middlewares/auth.middleware';

export async function getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,
      totalOrders,
      monthOrders,
      pendingOrders,
      totalCustomers,
      newCustomers,
      pendingCustomOrders,
      lowStockProducts,
      recentOrders,
      bestSellers,
    ] = await Promise.all([
      prisma.payment.aggregate({ where: { status: 'CAPTURED' }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: 'CAPTURED', capturedAt: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: 'CAPTURED', capturedAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { amount: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count({ where: { status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING] } } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'CUSTOMER', createdAt: { gte: startOfMonth } } }),
      prisma.customOrder.count({ where: { status: { in: [CustomOrderStatus.SUBMITTED, CustomOrderStatus.REVIEWING, CustomOrderStatus.QUOTED] } } }),
      prisma.productVariant.count({ where: { inventoryCount: { lte: 5 }, isAvailable: true } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    const revenueGrowth = lastMonthRevenue._sum.amount
      ? ((Number(monthRevenue._sum.amount) - Number(lastMonthRevenue._sum.amount)) / Number(lastMonthRevenue._sum.amount)) * 100
      : 0;

    sendSuccess(res, {
      revenue: {
        total: totalRevenue._sum.amount ?? 0,
        thisMonth: monthRevenue._sum.amount ?? 0,
        growth: revenueGrowth.toFixed(1),
      },
      orders: {
        total: totalOrders,
        thisMonth: monthOrders,
        pending: pendingOrders,
      },
      customers: {
        total: totalCustomers,
        newThisMonth: newCustomers,
      },
      customOrders: { pending: pendingCustomOrders },
      inventory: { lowStockCount: lowStockProducts },
      recentOrders,
      bestSellers,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSalesAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { period = '30' } = req.query as { period?: string };
    const days = parseInt(period, 10);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const orders = await prisma.order.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: startDate }, status: { not: 'CANCELLED' } },
      _sum: { total: true },
      _count: { id: true },
    });

    sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
}

export async function getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count(),
    ]);
    sendPaginated(res, logs, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
}

export async function getAdminSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const settings = await prisma.siteSetting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] });
    sendSuccess(res, settings);
  } catch (error) {
    next(error);
  }
}

export async function updateAdminSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const updates = req.body as Array<{ key: string; value: string }>;
    await Promise.all(
      updates.map(({ key, value }) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
    sendSuccess(res, null, 'Settings updated');
  } catch (error) {
    next(error);
  }
}

// ─── Customers ────────────────────────────────────────────────────────────────

export async function adminGetUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { q, role } = req.query as { q?: string; role?: string };

    const where: Record<string, unknown> = { deletedAt: null };
    if (role) where.role = role;
    else where.role = { not: UserRole.SUPER_ADMIN };
    if (q) {
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip, take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, firstName: true, lastName: true, phone: true,
          role: true, isActive: true, isEmailVerified: true, avatarUrl: true,
          lastLoginAt: true, createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    sendPaginated(res, users, paginate(page, limit, total), 'Users retrieved');
  } catch (err) { next(err); }
}

export async function adminGetUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.params.id, deletedAt: null },
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        role: true, isActive: true, isEmailVerified: true, avatarUrl: true,
        lastLoginAt: true, createdAt: true,
        orders: {
          take: 10, orderBy: { createdAt: 'desc' },
          select: { id: true, orderNumber: true, status: true, total: true, createdAt: true },
        },
        addresses: true,
        _count: { select: { orders: true, reviews: true } },
      },
    });
    if (!user) { sendNotFound(res, 'User'); return; }
    sendSuccess(res, user, 'User retrieved');
  } catch (err) { next(err); }
}

export async function adminUpdateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { isActive, role } = req.body as { isActive?: boolean; role?: string };
    const data: Record<string, unknown> = {};
    if (isActive !== undefined) data.isActive = isActive;
    if (role) data.role = role;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, role: true, isActive: true },
    });
    sendSuccess(res, user, 'User updated');
  } catch (err) { next(err); }
}

export async function adminDeleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.user.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date(), isActive: false },
    });
    sendSuccess(res, null, 'User deleted');
  } catch (err) { next(err); }
}

// ─── Admin Products (aliased from product routes) ────────────────────────────

export async function adminGetProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { q, status, lowStock } = req.query as { q?: string; status?: string; lowStock?: string };

    const where: Record<string, unknown> = { deletedAt: null };
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (lowStock === 'true') {
      where.OR = [
        { stockQuantity: { lte: 5 } },
        { variants: { some: { inventoryCount: { lte: 5 }, isAvailable: true } } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, slug: true, sku: true, status: true, price: true,
          compareAtPrice: true, stockQuantity: true, isFeatured: true, isBestSeller: true,
          createdAt: true, updatedAt: true,
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { id: true, name: true, slug: true } },
          collectionProducts: { include: { collection: { select: { id: true, name: true } } }, take: 1 },
          _count: { select: { variants: true, reviews: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    sendPaginated(res, products, paginate(page, limit, total), 'Products retrieved');
  } catch (err) { next(err); }
}

export async function adminGetProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, deletedAt: null },
      include: {
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
        variants: { orderBy: { sortOrder: 'asc' } },
        category: true,
        collectionProducts: { include: { collection: true } },
      },
    });
    if (!product) { sendNotFound(res, 'Product'); return; }
    sendSuccess(res, product);
  } catch (err) { next(err); }
}

export async function adminUpdateProductStock(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { stockQuantity, reason } = req.body as { stockQuantity: number; reason?: string };
    if (typeof stockQuantity !== 'number' || stockQuantity < 0) {
      sendError(res, 'stockQuantity must be a non-negative number', 400); return;
    }

    const product = await prisma.product.findFirst({ where: { id: req.params.id, deletedAt: null } });
    if (!product) { sendNotFound(res, 'Product'); return; }

    await prisma.$transaction([
      prisma.product.update({ where: { id: req.params.id }, data: { stockQuantity } }),
      prisma.inventoryLog.create({
        data: {
          productId: req.params.id,
          action: 'ADJUSTMENT',
          quantityBefore: product.stockQuantity,
          quantityChange: stockQuantity - product.stockQuantity,
          quantityAfter: stockQuantity,
          reason: reason ?? 'Manual admin adjustment',
        },
      }),
    ]);

    sendSuccess(res, { id: req.params.id, stockQuantity }, 'Stock updated');
  } catch (err) { next(err); }
}

// ─── Product Images ───────────────────────────────────────────────────────────

export async function adminAddProductImages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { uploadImage: upload, CLOUDINARY_FOLDERS } = await import('../config/cloudinary');
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) { sendError(res, 'No images provided', 400); return; }

    const product = await prisma.product.findFirst({ where: { id: req.params.id, deletedAt: null } });
    if (!product) { sendNotFound(res, 'Product'); return; }

    const hasPrimary = await prisma.productImage.findFirst({
      where: { productId: req.params.id, isPrimary: true },
    });

    const uploads = await Promise.all(
      files.map((f, idx) =>
        upload(f.buffer, CLOUDINARY_FOLDERS.PRODUCTS).then((r) => ({
          productId: req.params.id,
          url: r.url,
          publicId: r.publicId,
          width: r.width,
          height: r.height,
          isPrimary: !hasPrimary && idx === 0,
          sortOrder: idx,
        })),
      ),
    );

    const images = await prisma.$transaction(
      uploads.map((img) => prisma.productImage.create({ data: img })),
    );

    sendCreated(res, images, 'Images uploaded');
  } catch (err) { next(err); }
}

export async function adminUpdateProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { altText, isPrimary, sortOrder } = req.body as { altText?: string; isPrimary?: boolean; sortOrder?: number };

    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId: req.params.id },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.productImage.update({
      where: { id: req.params.imageId },
      data: { ...(altText !== undefined && { altText }), ...(isPrimary !== undefined && { isPrimary }), ...(sortOrder !== undefined && { sortOrder }) },
    });
    sendSuccess(res, image, 'Image updated');
  } catch (err) { next(err); }
}

export async function adminDeleteProductImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const image = await prisma.productImage.findFirst({
      where: { id: req.params.imageId, productId: req.params.id },
    });
    if (!image) { sendNotFound(res, 'Image'); return; }

    if (image.publicId) {
      const { deleteImage } = await import('../config/cloudinary');
      await deleteImage(image.publicId).catch(() => null);
    }

    await prisma.productImage.delete({ where: { id: image.id } });

    if (image.isPrimary) {
      const next = await prisma.productImage.findFirst({ where: { productId: req.params.id }, orderBy: { sortOrder: 'asc' } });
      if (next) await prisma.productImage.update({ where: { id: next.id }, data: { isPrimary: true } });
    }

    sendSuccess(res, null, 'Image deleted');
  } catch (err) { next(err); }
}

// ─── Product Variants ─────────────────────────────────────────────────────────

export async function adminGetProductVariants(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productId: req.params.id },
      orderBy: { sortOrder: 'asc' },
    });
    sendSuccess(res, variants, 'Variants retrieved');
  } catch (err) { next(err); }
}

export async function adminCreateProductVariant(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await prisma.product.findFirst({ where: { id: req.params.id, deletedAt: null } });
    if (!product) { sendNotFound(res, 'Product'); return; }

    const variant = await prisma.productVariant.create({
      data: { ...req.body, productId: req.params.id },
    });
    sendCreated(res, variant, 'Variant created');
  } catch (err) { next(err); }
}

export async function adminUpdateProductVariant(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const variant = await prisma.productVariant.findFirst({
      where: { id: req.params.variantId, productId: req.params.id },
    });
    if (!variant) { sendNotFound(res, 'Variant'); return; }

    const updated = await prisma.productVariant.update({ where: { id: variant.id }, data: req.body });
    sendSuccess(res, updated, 'Variant updated');
  } catch (err) { next(err); }
}

export async function adminDeleteProductVariant(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const variant = await prisma.productVariant.findFirst({
      where: { id: req.params.variantId, productId: req.params.id },
    });
    if (!variant) { sendNotFound(res, 'Variant'); return; }
    await prisma.productVariant.delete({ where: { id: variant.id } });
    sendSuccess(res, null, 'Variant deleted');
  } catch (err) { next(err); }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function adminGetCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
    sendSuccess(res, categories.map((c) => ({ ...c, productCount: c._count.products })), 'Categories retrieved');
  } catch (err) { next(err); }
}

export async function adminCreateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { createSlug } = await import('../utils/slug');
    const slug = req.body.slug ?? createSlug(req.body.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) { sendError(res, 'Slug already in use', 409); return; }

    const category = await prisma.category.create({ data: { ...req.body, slug } });
    sendCreated(res, category, 'Category created');
  } catch (err) { next(err); }
}

export async function adminUpdateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
    sendSuccess(res, category, 'Category updated');
  } catch (err) { next(err); }
}

export async function adminDeleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const count = await prisma.product.count({ where: { categoryId: req.params.id } });
    if (count > 0) { sendError(res, `Cannot delete — ${count} products use this category`, 409); return; }
    await prisma.category.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Category deleted');
  } catch (err) { next(err); }
}

// ─── Admin Collections ────────────────────────────────────────────────────────

export async function adminGetCollections(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const [collections, total] = await Promise.all([
      prisma.collection.findMany({
        skip, take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: { _count: { select: { collectionProducts: true } } },
      }),
      prisma.collection.count(),
    ]);
    sendPaginated(res, collections.map((c) => ({ ...c, productCount: c._count.collectionProducts })), paginate(page, limit, total), 'Collections retrieved');
  } catch (err) { next(err); }
}

export async function adminCreateCollection(
  req: Request & { body: CreateCollectionInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const slug = req.body.slug ?? await generateUniqueCollectionSlug(req.body.name);
    const collection = await prisma.collection.create({ data: { ...req.body, slug } });
    await cacheDel('collections:all');
    sendCreated(res, collection, 'Collection created');
  } catch (err) { next(err); }
}

export async function adminGetCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: req.params.id },
      include: {
        collectionProducts: {
          include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!collection) { sendNotFound(res, 'Collection'); return; }
    sendSuccess(res, collection);
  } catch (err) { next(err); }
}

export async function adminUpdateCollection(
  req: Request & { body: UpdateCollectionInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const collection = await prisma.collection.update({ where: { id: req.params.id }, data: req.body });
    await cacheDel('collections:all');
    sendSuccess(res, collection, 'Collection updated');
  } catch (err) { next(err); }
}

export async function adminDeleteCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.collection.delete({ where: { id: req.params.id } });
    await cacheDel('collections:all');
    sendSuccess(res, null, 'Collection deleted');
  } catch (err) { next(err); }
}

export async function adminAddProductToCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId, sortOrder = 0 } = req.body as { productId: string; sortOrder?: number };
    const entry = await prisma.collectionProduct.create({
      data: { collectionId: req.params.id, productId, sortOrder },
    });
    await cacheDel('collections:all');
    sendCreated(res, entry, 'Product added to collection');
  } catch (err) { next(err); }
}

export async function adminRemoveProductFromCollection(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.collectionProduct.deleteMany({
      where: { collectionId: req.params.id, productId: req.params.productId },
    });
    await cacheDel('collections:all');
    sendSuccess(res, null, 'Product removed from collection');
  } catch (err) { next(err); }
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function adminGetCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.coupon.count(),
    ]);
    sendPaginated(res, coupons, paginate(page, limit, total), 'Coupons retrieved');
  } catch (err) { next(err); }
}

export async function adminCreateCoupon(
  req: Request & { body: CreateCouponInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const existing = await prisma.coupon.findUnique({ where: { code: req.body.code } });
    if (existing) { sendError(res, 'Coupon code already exists', 409); return; }

    const coupon = await prisma.coupon.create({
      data: {
        ...req.body,
        startsAt: req.body.startsAt ? new Date(req.body.startsAt) : null,
        expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : null,
      },
    });
    sendCreated(res, coupon, 'Coupon created');
  } catch (err) { next(err); }
}

export async function adminGetCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } });
    if (!coupon) { sendNotFound(res, 'Coupon'); return; }
    sendSuccess(res, coupon);
  } catch (err) { next(err); }
}

export async function adminUpdateCoupon(
  req: Request & { body: UpdateCouponInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = {
      ...req.body,
      ...(req.body.startsAt && { startsAt: new Date(req.body.startsAt) }),
      ...(req.body.expiresAt && { expiresAt: new Date(req.body.expiresAt) }),
    };
    const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data });
    sendSuccess(res, coupon, 'Coupon updated');
  } catch (err) { next(err); }
}

export async function adminDeleteCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Coupon deleted');
  } catch (err) { next(err); }
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function adminGetSubscribers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { q } = req.query as { q?: string };

    const where: Record<string, unknown> = {};
    if (q) where.OR = [{ email: { contains: q, mode: 'insensitive' } }, { firstName: { contains: q, mode: 'insensitive' } }];

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({ where, skip, take: limit, orderBy: { subscribedAt: 'desc' } }),
      prisma.newsletterSubscriber.count({ where }),
    ]);
    sendPaginated(res, subscribers, paginate(page, limit, total), 'Subscribers retrieved');
  } catch (err) { next(err); }
}

export async function adminDeleteSubscriber(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.newsletterSubscriber.update({ where: { id: req.params.id }, data: { isActive: false } });
    sendSuccess(res, null, 'Subscriber unsubscribed');
  } catch (err) { next(err); }
}

export async function adminBroadcastNewsletter(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { subject, body } = req.body as { subject: string; body: string };
    if (!subject || !body) { sendError(res, 'subject and body are required', 400); return; }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true, firstName: true },
    });

    if (subscribers.length === 0) { sendSuccess(res, { sent: 0 }, 'No active subscribers'); return; }

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1C1917;">${subject}</h2>
        <div style="color: #44403C; line-height: 1.7;">${body}</div>
        <hr style="border-color: #D4AF72; margin: 32px 0;" />
        <p style="font-size: 12px; color: #78716C;">
          ${env.BRAND_NAME} · You're receiving this because you subscribed.
        </p>
      </div>`;

    // Send in batches of 50 to avoid SMTP overload
    const BATCH = 50;
    let sent = 0;
    for (let i = 0; i < subscribers.length; i += BATCH) {
      const batch = subscribers.slice(i, i + BATCH);
      await Promise.allSettled(
        batch.map((sub) =>
          sendEmail({ to: sub.email, subject, html }).then(() => { sent++; }).catch(() => null),
        ),
      );
    }

    sendSuccess(res, { sent, total: subscribers.length }, 'Broadcast sent');
  } catch (err) { next(err); }
}

export async function adminExportSubscribers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true, firstName: true, subscribedAt: true, source: true },
      orderBy: { subscribedAt: 'desc' },
    });

    const rows = ['Email,First Name,Subscribed At,Source'];
    subscribers.forEach((s) => {
      rows.push(`${s.email},${s.firstName ?? ''},${s.subscribedAt.toISOString()},${s.source ?? ''}`);
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');
    res.send(rows.join('\n'));
  } catch (err) { next(err); }
}

// ─── Wholesale & Press ────────────────────────────────────────────────────────

export async function adminGetWholesaleInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { q, status } = req.query as { q?: string; status?: string };

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { businessName: { contains: q, mode: 'insensitive' } },
        { contactName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.wholesaleInquiry.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.wholesaleInquiry.count({ where }),
    ]);
    sendPaginated(res, items, paginate(page, limit, total), 'Wholesale inquiries retrieved');
  } catch (err) { next(err); }
}

export async function adminUpdateWholesaleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, notes } = req.body as { status: string; notes?: string };
    const item = await prisma.wholesaleInquiry.update({
      where: { id: req.params.id },
      data: { status: status as Parameters<typeof prisma.wholesaleInquiry.update>[0]['data']['status'], ...(notes && { notes }) },
    });
    sendSuccess(res, item, 'Status updated');
  } catch (err) { next(err); }
}

export async function adminGetPressInquiries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { q, status } = req.query as { q?: string; status?: string };

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { contactName: { contains: q, mode: 'insensitive' } },
        { publication: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.pressInquiry.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.pressInquiry.count({ where }),
    ]);
    sendPaginated(res, items, paginate(page, limit, total), 'Press inquiries retrieved');
  } catch (err) { next(err); }
}

export async function adminUpdatePressStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, notes } = req.body as { status: string; notes?: string };
    const item = await prisma.pressInquiry.update({
      where: { id: req.params.id },
      data: { status: status as Parameters<typeof prisma.pressInquiry.update>[0]['data']['status'], ...(notes && { notes }) },
    });
    sendSuccess(res, item, 'Status updated');
  } catch (err) { next(err); }
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export async function adminReplyContactMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = req.body as { body: string };
    if (!body) { sendError(res, 'Reply body is required', 400); return; }

    const message = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!message) { sendNotFound(res, 'Message'); return; }

    await sendEmail({
      to: message.email,
      subject: `Re: ${message.subject}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px;">
          <p>Dear ${message.name},</p>
          <div style="white-space: pre-wrap; line-height: 1.7; color: #44403C;">${body}</div>
          <hr style="border-color: #D4AF72; margin: 24px 0;" />
          <p style="font-size: 12px; color: #78716C;">${env.BRAND_NAME}</p>
        </div>`,
    });

    await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status: 'RESPONDED', isRead: true, readAt: new Date(), notes: `Replied: ${new Date().toISOString()}` },
    });

    sendSuccess(res, null, 'Reply sent');
  } catch (err) { next(err); }
}

export async function adminDeleteContactMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Message deleted');
  } catch (err) { next(err); }
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function adminDeleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Review deleted');
  } catch (err) { next(err); }
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export async function adminGetInventory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { q } = req.query as { q?: string };

    const where: Record<string, unknown> = { deletedAt: null, status: { not: 'ARCHIVED' } };
    if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { sku: { contains: q, mode: 'insensitive' } }];

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, skip, take: limit, orderBy: { name: 'asc' },
        select: {
          id: true, name: true, slug: true, sku: true, status: true,
          stockQuantity: true, lowStockThreshold: true,
          images: { where: { isPrimary: true }, take: 1 },
          variants: { select: { id: true, name: true, sku: true, inventoryCount: true, isAvailable: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    sendPaginated(res, products, paginate(page, limit, total), 'Inventory retrieved');
  } catch (err) { next(err); }
}

export async function adminGetInventoryLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const [logs, total] = await Promise.all([
      prisma.inventoryLog.findMany({
        where: { productId: req.params.id },
        skip, take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.inventoryLog.count({ where: { productId: req.params.id } }),
    ]);
    sendPaginated(res, logs, paginate(page, limit, total), 'Inventory logs retrieved');
  } catch (err) { next(err); }
}
