import slugify from 'slugify';
import { prisma } from '../config/database';

export function createSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export async function generateUniqueProductSlug(name: string, excludeId?: string): Promise<string> {
  const base = createSlug(name);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: { slug, ...(excludeId && { id: { not: excludeId } }) },
    });
    if (!existing) return slug;
    slug = `${base}-${counter++}`;
  }
}

export async function generateUniqueCollectionSlug(name: string, excludeId?: string): Promise<string> {
  const base = createSlug(name);
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.collection.findFirst({
      where: { slug, ...(excludeId && { id: { not: excludeId } }) },
    });
    if (!existing) return slug;
    slug = `${base}-${counter++}`;
  }
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LB-${timestamp}-${random}`;
}

export function generateCustomOrderReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LBCO-${timestamp}-${random}`;
}
