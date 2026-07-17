import { Router } from 'express';
import { checkDb } from '../../db/pool';
import { ok } from '../../utils/response';

export const healthRouter = Router();

healthRouter.get('/health', async (_req, res) => {
  const db = await checkDb();
  const payload = {
    status: db.ok ? 'ok' : 'degraded',
    version: process.env.APP_VERSION ?? '0.0.1',
    db: db.ok ? 'up' : 'down',
    ...(db.error ? { dbError: db.error } : {}),
  };
  res.status(db.ok ? 200 : 503).json(
    ok(payload, { requestId: res.locals.requestId }),
  );
});
