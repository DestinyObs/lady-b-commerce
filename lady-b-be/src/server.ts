import 'dotenv/config';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { redis } from './config/redis';
import { logger } from './utils/logger';
import app from './app';

async function bootstrap() {
  try {
    await connectDatabase();
    logger.info('Database connected');

    await redis.ping();
    logger.info('Redis connected');

    const server = app.listen(env.PORT, () => {
      logger.info(`
╔══════════════════════════════════════════════════╗
║      Lady B Designs and Handcraft API            ║
║      Global Luxury Fashion Ecommerce             ║
╠══════════════════════════════════════════════════╣
║  Environment: ${env.NODE_ENV.padEnd(34)}║
║  Port:        ${String(env.PORT).padEnd(34)}║
║  API:         http://localhost:${env.PORT}/api           ║
${env.NODE_ENV !== 'production' ? `║  Docs:        http://localhost:${env.PORT}/api/docs      ║` : ''}
╚══════════════════════════════════════════════════╝
      `);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        await disconnectDatabase();
        await redis.quit();
        logger.info('Graceful shutdown complete');
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection', { reason });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

bootstrap();
