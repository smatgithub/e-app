import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { runMigrations } from './db/migrate';
import { authRouter } from './modules/auth/auth.routes';
import { catalogRouter } from './modules/catalog/catalog.routes';
import { healthRouter } from './modules/health/health.routes';

async function main() {
  await runMigrations();

  const app = express();
  const port = Number(process.env.PORT ?? 4000);
  const corsOrigin = process.env.CORS_ORIGIN ?? '*';

  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((s) => s.trim()),
    }),
  );
  app.use(express.json());
  app.use(morgan('dev'));

  app.use((req, res, next) => {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    res.setHeader('x-request-id', requestId);
    res.locals.requestId = requestId;
    next();
  });

  app.use('/api/v1', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1', catalogRouter);

  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      res.status(500).json({
        success: false,
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: err.message || 'Unexpected error',
        },
        meta: { requestId: res.locals.requestId },
      });
    },
  );

  app.listen(port, () => {
    console.log(
      `e-Food API v${process.env.APP_VERSION ?? '0.0.1'} listening on http://localhost:${port}/api/v1`,
    );
  });
}

main().catch((err) => {
  console.error('Failed to start API', err);
  process.exit(1);
});
