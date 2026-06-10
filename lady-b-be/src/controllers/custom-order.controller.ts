import { Request, Response, NextFunction } from 'express';
import { CustomOrderStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { sendSuccess, sendCreated, sendPaginated, sendNotFound, sendError, getPaginationParams, paginate } from '../utils/response';
import { generateCustomOrderReference } from '../utils/slug';
import { uploadImage, CLOUDINARY_FOLDERS } from '../config/cloudinary';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendCustomOrderConfirmation } from '../utils/email';
import type { CreateCustomOrderInput, SendQuoteInput } from '../schemas/custom-order.schema';

export async function createCustomOrder(
  req: AuthRequest & { body: CreateCustomOrderInput },
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const customOrder = await prisma.customOrder.create({
      data: {
        ...req.body,
        referenceNumber: generateCustomOrderReference(),
        userId: req.user!.id,
      },
    });

    await sendCustomOrderConfirmation(
      req.user!.email,
      req.user!.firstName,
      customOrder.referenceNumber,
    ).catch(() => {});

    sendCreated(res, customOrder, 'Custom order submitted successfully');
  } catch (error) {
    next(error);
  }
}

export async function uploadCustomOrderImages(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      sendError(res, 'No images provided', 400);
      return;
    }

    const customOrder = await prisma.customOrder.findFirst({
      where: { id, userId: req.user!.id },
    });
    if (!customOrder) { sendNotFound(res, 'Custom order'); return; }

    const uploadedImages = await Promise.all(
      files.map((file) =>
        uploadImage(file.buffer, CLOUDINARY_FOLDERS.CUSTOM_ORDERS, {
          folder: `${CLOUDINARY_FOLDERS.CUSTOM_ORDERS}/${id}`,
        }),
      ),
    );

    const images = await prisma.$transaction(
      uploadedImages.map((img) =>
        prisma.customOrderImage.create({
          data: {
            customOrderId: id,
            url: img.url,
            publicId: img.publicId,
            uploadedBy: req.user!.id,
          },
        }),
      ),
    );

    sendSuccess(res, images, 'Images uploaded');
  } catch (error) {
    next(error);
  }
}

export async function getUserCustomOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const [orders, total] = await Promise.all([
      prisma.customOrder.findMany({
        where: { userId: req.user!.id },
        include: { images: true, quotes: { orderBy: { createdAt: 'desc' }, take: 1 } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customOrder.count({ where: { userId: req.user!.id } }),
    ]);
    sendPaginated(res, orders, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
}

export async function getUserCustomOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await prisma.customOrder.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: { images: true, quotes: { orderBy: { createdAt: 'desc' } } },
    });
    if (!order) { sendNotFound(res, 'Custom order'); return; }
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}

export async function adminGetCustomOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { status } = req.query as { status?: CustomOrderStatus };

    const where = { ...(status && { status }) };
    const [orders, total] = await Promise.all([
      prisma.customOrder.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          images: { take: 3 },
          quotes: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customOrder.count({ where }),
    ]);
    sendPaginated(res, orders, paginate(page, limit, total));
  } catch (error) {
    next(error);
  }
}

export async function adminGetCustomOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await prisma.customOrder.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        images: true,
        quotes: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!order) { sendNotFound(res, 'Custom order'); return; }
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
}

export async function sendQuote(
  req: Request<{ id: string }, {}, SendQuoteInput>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const quote = await prisma.$transaction(async (tx) => {
      const newQuote = await tx.customOrderQuote.create({
        data: { customOrderId: req.params.id, ...req.body, validUntil: new Date(req.body.validUntil) },
      });
      await tx.customOrder.update({
        where: { id: req.params.id },
        data: {
          status: CustomOrderStatus.QUOTED,
          depositAmount: req.body.depositAmount,
          finalAmount: req.body.finalAmount,
          estimatedCompletion: req.body.estimatedCompletion ? new Date(req.body.estimatedCompletion) : undefined,
        },
      });
      return newQuote;
    });
    sendCreated(res, quote, 'Quote sent to customer');
  } catch (error) {
    next(error);
  }
}

export async function approveQuote(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const order = await prisma.customOrder.findFirst({ where: { id, userId: req.user!.id, status: CustomOrderStatus.QUOTED } });
    if (!order) { sendNotFound(res, 'Custom order'); return; }

    await prisma.$transaction([
      prisma.customOrder.update({ where: { id }, data: { status: CustomOrderStatus.APPROVED_BY_CUSTOMER } }),
      prisma.customOrderQuote.updateMany({ where: { customOrderId: id }, data: { isAccepted: true, acceptedAt: new Date() } }),
    ]);

    sendSuccess(res, null, 'Quote approved. Please proceed with deposit payment.');
  } catch (error) {
    next(error);
  }
}

export async function rejectCustomOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    await prisma.customOrder.update({
      where: { id },
      data: { status: CustomOrderStatus.REJECTED, rejectedAt: new Date(), rejectReason: reason },
    });
    sendSuccess(res, null, 'Custom order rejected');
  } catch (error) {
    next(error);
  }
}

export async function updateCustomOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const order = await prisma.customOrder.update({
      where: { id },
      data: { status, ...(adminNotes && { adminNotes }) },
    });
    sendSuccess(res, order, 'Status updated');
  } catch (error) {
    next(error);
  }
}
