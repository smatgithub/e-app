import { Router } from 'express';
import { pool } from '../../db/pool';
import { requireAuth } from '../../middleware/auth';
import { fail, ok } from '../../utils/response';

export const profileRouter = Router();

profileRouter.get('/me', requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, phone, email, role, preferred_language AS "preferredLanguage"
       FROM users WHERE id = $1`,
      [res.locals.user!.id],
    );
    return res.json(ok(rows[0], { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});

profileRouter.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : null;
    const preferredLanguage =
      typeof req.body?.preferredLanguage === 'string'
        ? req.body.preferredLanguage.trim()
        : null;
    if (!name && !preferredLanguage) {
      const err = fail('VALIDATION_ERROR', 'name or preferredLanguage required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }
    const { rows } = await pool.query(
      `UPDATE users SET
         name = COALESCE($2, name),
         preferred_language = COALESCE($3, preferred_language)
       WHERE id = $1
       RETURNING id, name, phone, email, role, preferred_language AS "preferredLanguage"`,
      [res.locals.user!.id, name, preferredLanguage],
    );
    return res.json(ok(rows[0], { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});

profileRouter.post('/me/addresses', requireAuth, async (req, res, next) => {
  try {
    const line1 = String(req.body?.line1 ?? '').trim();
    if (!line1) {
      const err = fail('VALIDATION_ERROR', 'line1 is required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }
    const { rows } = await pool.query(
      `INSERT INTO addresses (user_id, line1, landmark, pincode, is_default)
       VALUES ($1, $2, $3, $4, COALESCE($5, FALSE))
       RETURNING id, line1, landmark, pincode, is_default AS "isDefault"`,
      [
        res.locals.user!.id,
        line1,
        req.body?.landmark ?? null,
        req.body?.pincode ?? null,
        req.body?.isDefault ?? false,
      ],
    );
    return res.status(201).json(ok(rows[0], { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});

profileRouter.get('/me/addresses', requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, line1, landmark, pincode, is_default AS "isDefault"
       FROM addresses WHERE user_id = $1 ORDER BY created_at DESC`,
      [res.locals.user!.id],
    );
    return res.json(ok(rows, { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});
