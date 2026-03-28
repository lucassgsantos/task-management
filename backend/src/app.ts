import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import { errorHandler } from './middleware/errorHandler';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    cors({
      origin: env.allowAllCorsOrigins ? true : env.corsOrigins,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use(errorHandler);

  return app;
};
