import { Request, Response, NextFunction } from 'express';
import { OrderStatus, CustomOrderStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { sendSuccess, sendPaginated, getPaginationParams, paginate } from '../utils/response';

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
