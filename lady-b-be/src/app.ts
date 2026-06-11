import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { globalRateLimit } from './middlewares/rate-limit.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { logger } from './utils/logger';
import { env } from './config/env';
import { swaggerSpec } from './swagger';

// Routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import customOrderRoutes from './routes/custom-order.routes';
import reviewRoutes from './routes/review.routes';
import uploadRoutes from './routes/upload.routes';
import contactRoutes from './routes/contact.routes';
import adminRoutes from './routes/admin.routes';
import accountRoutes from './routes/account.routes';
import collectionRoutes from './routes/collection.routes';
import couponRoutes from './routes/coupon.routes';
import categoriesRoutes from './routes/categories.routes';
import faqRoutes from './routes/faq.routes';
import journalRoutes from './routes/journal.routes';
import giftCardsRoutes from './routes/gift-cards.routes';
import checkoutRoutes from './routes/checkout.routes';

const app = express();

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production',
    crossOriginEmbedderPolicy: false,
  }),
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
  }),
);

// ─── Body parsers (raw for Stripe webhook, must come before JSON parser) ──────
app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Compression + cookies ────────────────────────────────────────────────────
app.use(compression());
app.use(cookieParser());

// ─── Global rate limit ────────────────────────────────────────────────────────
app.use('/api', globalRateLimit);

// ─── Health check (with real DB + Redis status) ───────────────────────────────
app.get('/api/health', async (_req, res) => {
  const status: Record<string, 'ok' | 'error'> = { database: 'error', redis: 'error' };

  try {
    const { prisma } = await import('./config/database');
    await prisma.$queryRaw`SELECT 1`;
    status.database = 'ok';
  } catch {}

  try {
    const { redis } = await import('./config/redis');
    await redis.ping();
    status.redis = 'ok';
  } catch {}

  const healthy = Object.values(status).every((s) => s === 'ok');

  res.status(healthy ? 200 : 503).json({
    success: healthy,
    message: healthy ? 'Lady B Commerce API is running' : 'Degraded — check services',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: status,
  });
});

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/custom-orders', customOrderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/gift-cards', giftCardsRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api', contactRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/admin', adminRoutes);

// ─── API docs (Swagger UI) ────────────────────────────────────────────────────
if (env.NODE_ENV !== 'production') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { background-color: #1C1917; }',
    customSiteTitle: 'Lady B Commerce API Docs',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  }));
}

// ─── 404 + error handlers ─────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Request logging ──────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

export default app;
