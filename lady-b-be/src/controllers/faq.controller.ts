import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess, sendNotFound, sendCreated } from '../utils/response';
import { cacheGet, cacheSet, cacheDel, CACHE_TTL } from '../config/redis';
import { AuthRequest } from '../middlewares/auth.middleware';

export async function getFaqs(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cacheKey = 'faqs:all';
    const cached = await cacheGet<unknown[]>(cacheKey);
    if (cached) { sendSuccess(res, cached, 'FAQs retrieved'); return; }

    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      select: { id: true, question: true, answer: true, category: true, sortOrder: true },
    });

    await cacheSet(cacheKey, faqs, CACHE_TTL.LONG);
    sendSuccess(res, faqs, 'FAQs retrieved');
  } catch (err) { next(err); }
}

export async function adminGetFaqs(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] });
    sendSuccess(res, faqs, 'FAQs retrieved');
  } catch (err) { next(err); }
}

export async function adminCreateFaq(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const faq = await prisma.faq.create({ data: req.body });
    await cacheDel('faqs:all');
    sendCreated(res, faq, 'FAQ created');
  } catch (err) { next(err); }
}

export async function adminUpdateFaq(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const faq = await prisma.faq.update({ where: { id: req.params.id }, data: req.body });
    await cacheDel('faqs:all');
    sendSuccess(res, faq, 'FAQ updated');
  } catch (err) { next(err); }
}

export async function adminDeleteFaq(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await prisma.faq.findUnique({ where: { id: req.params.id } });
    if (!existing) { sendNotFound(res, 'FAQ'); return; }
    await prisma.faq.delete({ where: { id: req.params.id } });
    await cacheDel('faqs:all');
    sendSuccess(res, null, 'FAQ deleted');
  } catch (err) { next(err); }
}
