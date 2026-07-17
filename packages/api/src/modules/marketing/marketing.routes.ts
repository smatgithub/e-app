import { Router } from 'express';
import { pool } from '../../db/pool';
import { requireAuth } from '../../middleware/auth';
import { fail, ok } from '../../utils/response';

export const marketingRouter = Router();

marketingRouter.get('/banners', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, body, sort_order AS "sortOrder"
       FROM banners WHERE is_active = TRUE
       ORDER BY sort_order, created_at`,
    );
    res.json(ok(rows, { requestId: res.locals.requestId }));
  } catch (err) {
    next(err);
  }
});

marketingRouter.post('/coupons/validate', requireAuth, async (req, res, next) => {
  try {
    const code = String(req.body?.code ?? '')
      .trim()
      .toUpperCase();
    const itemCount = Number(req.body?.itemCount ?? 0);
    const subtotal = Number(req.body?.subtotal ?? 0);
    if (!code) {
      const err = fail('VALIDATION_ERROR', 'code required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }
    const { rows } = await pool.query(
      `SELECT id, code, description, discount_type AS "discountType",
              discount_value::float8 AS "discountValue",
              min_items AS "minItems", min_subtotal::float8 AS "minSubtotal"
       FROM coupons WHERE code = $1 AND is_active = TRUE LIMIT 1`,
      [code],
    );
    if (!rows[0]) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'COUPON_INVALID', message: 'Coupon not found or inactive' },
        meta: { requestId: res.locals.requestId },
      });
    }
    const c = rows[0];
    if (itemCount < c.minItems) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'COUPON_MIN_ITEMS',
          message: `Need at least ${c.minItems} items`,
        },
        meta: { requestId: res.locals.requestId },
      });
    }
    if (subtotal < c.minSubtotal) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'COUPON_MIN_SUBTOTAL',
          message: `Need subtotal of at least ₹${c.minSubtotal}`,
        },
        meta: { requestId: res.locals.requestId },
      });
    }
    const discount = Math.min(Number(c.discountValue), subtotal);
    return res.json(
      ok(
        { ...c, discount, applicable: true },
        { requestId: res.locals.requestId },
      ),
    );
  } catch (err) {
    return next(err);
  }
});

marketingRouter.post('/me/device-tokens', requireAuth, async (req, res, next) => {
  try {
    const token = String(req.body?.token ?? '').trim();
    const platform = String(req.body?.platform ?? 'android');
    if (!token) {
      const err = fail('VALIDATION_ERROR', 'token required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }
    await pool.query(
      `INSERT INTO device_tokens (user_id, token, platform)
       VALUES ($1,$2,$3)
       ON CONFLICT (user_id, token) DO UPDATE SET platform = EXCLUDED.platform`,
      [res.locals.user!.id, token, platform],
    );
    return res.status(201).json(
      ok({ registered: true }, { requestId: res.locals.requestId }),
    );
  } catch (err) {
    return next(err);
  }
});
