import { Request, Response, NextFunction } from 'express';
import { ReviewStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendPaginated, sendNotFound, sendError, getPaginationParams, paginate } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  body: z.string().min(10, 'Review must be at least 10 characters').max(2000),
});

export async function createReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = createReviewSchema.parse(req.body);

    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: { userId: req.user!.id, status: { in: ['DELIVERED', 'CONFIRMED'] } },
      },
    });

    const existing = await prisma.review.findFirst({
      where: { productId: data.productId, userId: req.user!.id },
    });
    if (existing) { sendError(res, 'You have already reviewed this product', 409); return; }

    const review = await prisma.review.create({
      data: {
        ...data,
        userId: req.user!.id,
        isVerified: !!purchased,
      },
    });

    sendCreated(res, review, 'Review submitted and pending approval');
  } catch (error) {
    next(error);
  }
}

export async function getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { productId } = req.params;
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, status: ReviewStatus.APPROVED },
        include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { productId, status: ReviewStatus.APPROVED } }),
    ]);

    const stats = await prisma.review.aggregate({
      where: { productId, status: ReviewStatus.APPROVED },
      _avg: { rating: true },
      _count: { rating: true },
    });

    sendPaginated(res, reviews, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
}

export async function adminGetReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { status } = req.query as { status?: ReviewStatus };
    const where = { ...(status && { status }) };
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where }),
    ]);
    sendPaginated(res, reviews, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
}

export async function approveReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { status: ReviewStatus.APPROVED, reviewedAt: new Date() },
    });
    sendSuccess(res, review, 'Review approved');
  } catch (error) {
    next(error);
  }
}

export async function rejectReview(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { status: ReviewStatus.REJECTED, reviewedAt: new Date() },
    });
    sendSuccess(res, review, 'Review rejected');
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id }, select: { id: true, userId: true } });
    if (!review) { sendNotFound(res, 'Review'); return; }

    const isOwner = review.userId === req.user!.id;
    const isAdmin = req.user!.role === 'ADMIN';
    if (!isOwner && !isAdmin) { sendError(res, 'Forbidden', 403); return; }

    await prisma.review.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Review deleted');
  } catch (error) {
    next(error);
  }
}
