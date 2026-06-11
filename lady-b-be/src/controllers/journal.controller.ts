import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import {
  sendSuccess, sendCreated, sendNotFound, sendPaginated, sendError,
  getPaginationParams, paginate,
} from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';

const PUBLIC_SELECT = {
  id: true, slug: true, title: true, excerpt: true, coverImage: true,
  category: true, tags: true, readTimeMinutes: true, publishedAt: true,
  authorName: true, authorRole: true, authorAvatar: true,
};

export async function getJournalPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { category } = req.query as { category?: string };

    const where: Record<string, unknown> = { status: 'PUBLISHED', publishedAt: { lte: new Date() } };
    if (category) where.category = category;

    const [posts, total] = await Promise.all([
      prisma.journalPost.findMany({
        where,
        select: PUBLIC_SELECT,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.journalPost.count({ where }),
    ]);

    sendPaginated(res, posts, paginate(page, limit, total), 'Posts retrieved');
  } catch (err) { next(err); }
}

export async function getJournalPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.journalPost.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
    });
    if (!post) { sendNotFound(res, 'Post'); return; }

    const relatedPosts = await prisma.journalPost.findMany({
      where: {
        status: 'PUBLISHED',
        category: post.category,
        id: { not: post.id },
      },
      select: PUBLIC_SELECT,
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });

    sendSuccess(res, {
      ...post,
      author: { name: post.authorName, role: post.authorRole, avatar: post.authorAvatar },
      relatedPosts,
    }, 'Post retrieved');
  } catch (err) { next(err); }
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

export async function adminGetPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, skip } = getPaginationParams(req.query.page as string, req.query.limit as string);
    const { status } = req.query as { status?: string };
    const where = status ? { status } : {};
    const [posts, total] = await Promise.all([
      prisma.journalPost.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.journalPost.count({ where }),
    ]);
    sendPaginated(res, posts, paginate(page, limit, total), 'Posts retrieved');
  } catch (err) { next(err); }
}

export async function adminGetPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.journalPost.findUnique({ where: { id: req.params.id } });
    if (!post) { sendNotFound(res, 'Post'); return; }
    sendSuccess(res, post);
  } catch (err) { next(err); }
}

export async function adminCreatePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { title, slug, ...rest } = req.body as { title: string; slug?: string; [k: string]: unknown };
    const finalSlug = slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const existing = await prisma.journalPost.findUnique({ where: { slug: finalSlug } });
    if (existing) { sendError(res, 'A post with this slug already exists', 409); return; }

    const post = await prisma.journalPost.create({ data: { title, slug: finalSlug, ...rest } as Parameters<typeof prisma.journalPost.create>[0]['data'] });
    sendCreated(res, post, 'Post created');
  } catch (err) { next(err); }
}

export async function adminUpdatePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.journalPost.findUnique({ where: { id: req.params.id } });
    if (!post) { sendNotFound(res, 'Post'); return; }
    const updated = await prisma.journalPost.update({ where: { id: req.params.id }, data: req.body });
    sendSuccess(res, updated, 'Post updated');
  } catch (err) { next(err); }
}

export async function adminDeletePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.journalPost.findUnique({ where: { id: req.params.id } });
    if (!post) { sendNotFound(res, 'Post'); return; }
    await prisma.journalPost.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Post deleted');
  } catch (err) { next(err); }
}

export async function adminPublishPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.journalPost.update({
      where: { id: req.params.id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });
    sendSuccess(res, post, 'Post published');
  } catch (err) { next(err); }
}

export async function adminUnpublishPost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const post = await prisma.journalPost.update({
      where: { id: req.params.id },
      data: { status: 'DRAFT', publishedAt: null },
    });
    sendSuccess(res, post, 'Post reverted to draft');
  } catch (err) { next(err); }
}
