import 'reflect-metadata';
import express from 'express';
import { env } from './shared/config/env';
import { logger } from './shared/logger';
import { errorHandler } from './shared/errors/errorHandler';
import { configureSecurityMiddleware } from './shared/middlewares/security';
import { setupSwagger } from './docs/swagger';
import { AppDataSource } from './infrastructure/database/sqlite/connection';
import authRoutes from './infrastructure/web/express/routes/auth.routes';
import storeRoutes from './infrastructure/web/express/routes/store.routes';

const app = express();

// Segurança e performance
configureSecurityMiddleware(app);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger
setupSwagger(app);

// Health Check detalhado
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);

// Middleware de erro (sempre por último)
app.use(errorHandler);

// Inicialização do banco de dados e servidor
AppDataSource.initialize()
  .then(() => {
    logger.info('📦 Database connected successfully');
    const server = app.listen(env.PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server running at http://0.0.0.0:${env.PORT}`);
      logger.info(`📚 Swagger docs available at http://0.0.0.0:${env.PORT}/api-docs`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
        logger.info('HTTP server closed');
        AppDataSource.destroy().then(() => {
          logger.info('Database connection closed');
          process.exit(0);
        });
      });
      setTimeout(() => process.exit(1), 10000);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  })
  .catch((error) => {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  });
