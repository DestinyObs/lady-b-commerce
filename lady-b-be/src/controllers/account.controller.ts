import { Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendError,
  sendPaginated,
  getPaginationParams,
  paginate,
} from '../utils/response';
import { uploadImage, CLOUDINARY_FOLDERS } from '../config/cloudinary';
import { AuthRequest } from '../middlewares/auth.middleware';
import type {
  UpdateProfileInput,
  CreateAddressInput,
  UpdateAddressInput,
  UpdateSettingsInput,
} from '../schemas/account.schema';

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        avatarUrl: true, role: true, isEmailVerified: true, preferences: true,
        lastLoginAt: true, createdAt: true,
      },
    });
    if (!user) { sendNotFound(res, 'User'); return; }
    sendSuccess(res, user, 'Profile retrieved');
  } catch (err) { next(err); }
}

export async function updateProfile(
  req: AuthRequest & { body: UpdateProfileInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data: Record<string, unknown> = {};
    if (req.body.firstName !== undefined) data.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) data.lastName = req.body.lastName;
    if (req.body.phone !== undefined) data.phone = req.body.phone;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: {
        id: true, email: true, firstName: true, lastName: true, phone: true,
        avatarUrl: true, role: true, isEmailVerified: true, preferences: true,
      },
    });
    sendSuccess(res, user, 'Profile updated');
  } catch (err) { next(err); }
}

export async function uploadAvatar(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) { sendError(res, 'No image provided', 400); return; }

    const result = await uploadImage(req.file.buffer, CLOUDINARY_FOLDERS.AVATARS, {
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatarUrl: result.url },
      select: { id: true, avatarUrl: true },
    });
    sendSuccess(res, user, 'Avatar updated');
  } catch (err) { next(err); }
}

// ─── Account Settings ─────────────────────────────────────────────────────────

export async function getAccountSettings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { preferences: true },
    });

    const defaults = {
      notifications: { orderUpdates: true, promotions: false, newArrivals: false, newsletter: true },
      theme: 'system',
    };

    const prefs = (user?.preferences as Record<string, unknown>) ?? {};
    sendSuccess(res, { ...defaults, ...prefs }, 'Settings retrieved');
  } catch (err) { next(err); }
}

export async function updateAccountSettings(
  req: AuthRequest & { body: UpdateSettingsInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const current = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { preferences: true },
    });

    const existing = (current?.preferences as Record<string, unknown>) ?? {};
    const updated = { ...existing, ...req.body };

    await prisma.user.update({ where: { id: req.user!.id }, data: { preferences: updated } });
    sendSuccess(res, updated, 'Settings updated');
  } catch (err) { next(err); }
}

// ─── Account Dashboard ────────────────────────────────────────────────────────

export async function getAccountDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    const [totalOrders, wishlistCount, customOrdersCount, recentOrders] = await Promise.all([
      prisma.order.count({ where: { userId, status: { not: 'CANCELLED' } } }),
      prisma.wishlistItem.count({ where: { wishlist: { userId } } }),
      prisma.customOrder.count({ where: { userId } }),
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true, orderNumber: true, status: true, total: true, createdAt: true,
          _count: { select: { items: true } },
        },
      }),
    ]);

    sendSuccess(res, {
      totalOrders,
      wishlistCount,
      customOrdersCount,
      recentOrders: recentOrders.map((o) => ({
        id: o.id, orderNumber: o.orderNumber, status: o.status,
        total: Number(o.total), createdAt: o.createdAt, itemCount: o._count.items,
      })),
    }, 'Dashboard retrieved');
  } catch (err) { next(err); }
}

// ─── Addresses ───────────────────────────────────────────────────────────────

export async function getAddresses(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });
    sendSuccess(res, addresses, 'Addresses retrieved');
  } catch (err) { next(err); }
}

export async function createAddress(
  req: AuthRequest & { body: CreateAddressInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;

    if (req.body.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    const existingCount = await prisma.address.count({ where: { userId } });
    const isDefault = req.body.isDefault ?? existingCount === 0;

    const address = await prisma.address.create({ data: { ...req.body, userId, isDefault } });
    sendCreated(res, address, 'Address created');
  } catch (err) { next(err); }
}

export async function getAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const address = await prisma.address.findFirst({ where: { id: req.params.id, userId: req.user!.id } });
    if (!address) { sendNotFound(res, 'Address'); return; }
    sendSuccess(res, address);
  } catch (err) { next(err); }
}

export async function updateAddress(
  req: AuthRequest & { body: UpdateAddressInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const existing = await prisma.address.findFirst({ where: { id: req.params.id, userId } });
    if (!existing) { sendNotFound(res, 'Address'); return; }

    if (req.body.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: req.params.id } },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({ where: { id: req.params.id }, data: req.body });
    sendSuccess(res, address, 'Address updated');
  } catch (err) { next(err); }
}

export async function deleteAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const existing = await prisma.address.findFirst({ where: { id: req.params.id, userId } });
    if (!existing) { sendNotFound(res, 'Address'); return; }

    await prisma.address.delete({ where: { id: req.params.id } });

    if (existing.isDefault) {
      const next = await prisma.address.findFirst({ where: { userId }, orderBy: { createdAt: 'asc' } });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }

    sendSuccess(res, null, 'Address deleted');
  } catch (err) { next(err); }
}

export async function setDefaultAddress(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const existing = await prisma.address.findFirst({ where: { id: req.params.id, userId } });
    if (!existing) { sendNotFound(res, 'Address'); return; }

    await prisma.$transaction([
      prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
      prisma.address.update({ where: { id: req.params.id }, data: { isDefault: true } }),
    ]);
    sendSuccess(res, null, 'Default address updated');
  } catch (err) { next(err); }
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

async function getOrCreateWishlist(userId: string) {
  const include = {
    items: {
      orderBy: { createdAt: 'desc' as const },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            category: { select: { name: true, slug: true } },
          },
        },
      },
    },
  };

  return prisma.wishlist.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include,
  });
}

export async function getWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const wishlist = await getOrCreateWishlist(req.user!.id);
    const limitParam = req.query.limit ? Number(req.query.limit) : undefined;
    const items = limitParam ? wishlist.items.slice(0, limitParam) : wishlist.items;

    sendSuccess(res, {
      items: items.map((item) => ({
        id: item.id, productId: item.productId, product: item.product, addedAt: item.createdAt,
      })),
      total: wishlist.items.length,
    }, 'Wishlist retrieved');
  } catch (err) { next(err); }
}

export async function addToWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId } = req.body as { productId: string };
    if (!productId) { sendError(res, 'productId is required', 400); return; }

    const product = await prisma.product.findFirst({
      where: { id: productId, status: 'ACTIVE', deletedAt: null },
      select: { id: true },
    });
    if (!product) { sendNotFound(res, 'Product'); return; }

    const wishlist = await prisma.wishlist.upsert({
      where: { userId: req.user!.id },
      create: { userId: req.user!.id },
      update: {},
    });

    const existing = await prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId },
    });
    if (existing) { sendSuccess(res, { productId }, 'Already in wishlist'); return; }

    await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
    sendCreated(res, { productId }, 'Added to wishlist');
  } catch (err) { next(err); }
}

export async function removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user!.id } });
    if (!wishlist) { sendNotFound(res, 'Wishlist'); return; }

    const item = await prisma.wishlistItem.findFirst({
      where: {
        wishlistId: wishlist.id,
        OR: [{ id: req.params.itemId }, { productId: req.params.itemId }],
      },
    });
    if (!item) { sendNotFound(res, 'Item'); return; }

    await prisma.wishlistItem.delete({ where: { id: item.id } });
    sendSuccess(res, null, 'Removed from wishlist');
  } catch (err) { next(err); }
}

export async function checkWishlistItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user!.id }, select: { id: true },
    });
    if (!wishlist) { sendSuccess(res, { inWishlist: false }); return; }

    const item = await prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId: req.params.productId },
      select: { id: true },
    });
    sendSuccess(res, { inWishlist: !!item, itemId: item?.id ?? null });
  } catch (err) { next(err); }
}

// ─── Account Orders ───────────────────────────────────────────────────────────

export async function getAccountOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { status, q } = req.query as { status?: string; q?: string };

    const where: Record<string, unknown> = { userId: req.user!.id };
    if (status) where.status = status;
    if (q) where.orderNumber = { contains: q, mode: 'insensitive' };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            take: 3,
            include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } },
          },
          _count: { select: { items: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    sendPaginated(res, orders, paginate(page, limit, total), 'Orders retrieved');
  } catch (err) { next(err); }
}

export async function getAccountOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: {
        items: {
          include: {
            product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
            variant: true,
          },
        },
        payments: { orderBy: { createdAt: 'desc' }, take: 1 },
        shippingAddress: true,
      },
    });
    if (!order) { sendNotFound(res, 'Order'); return; }
    sendSuccess(res, order, 'Order retrieved');
  } catch (err) { next(err); }
}

// ─── Payment Methods (Stripe — scaffolded) ────────────────────────────────────

export async function getPaymentMethods(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, [], 'Payment methods retrieved');
  } catch (err) { next(err); }
}

export async function createSetupIntent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { stripe } = await import('../config/stripe');
    const intent = await stripe.setupIntents.create({
      usage: 'off_session',
      metadata: { userId: req.user!.id },
    });
    sendCreated(res, { clientSecret: intent.client_secret }, 'Setup intent created');
  } catch (err) { next(err); }
}

export async function deletePaymentMethod(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { stripe } = await import('../config/stripe');
    await stripe.paymentMethods.detach(req.params.id);
    sendSuccess(res, null, 'Payment method removed');
  } catch (err) { next(err); }
}

// ─── Invoices (order receipts) ────────────────────────────────────────────────

export async function getInvoices(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user!.id,
        status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, orderNumber: true, total: true, status: true, createdAt: true },
    });

    sendSuccess(res, orders.map((o) => ({
      id: o.id,
      invoiceNumber: `INV-${o.orderNumber}`,
      amount: Number(o.total),
      status: 'paid',
      createdAt: o.createdAt,
      pdfUrl: null,
    })), 'Invoices retrieved');
  } catch (err) { next(err); }
}
