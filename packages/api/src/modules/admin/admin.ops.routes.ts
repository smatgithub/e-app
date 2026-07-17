import { Router } from 'express';
import { pool } from '../../db/pool';
import { requireAuth, requireRoles } from '../../middleware/auth';
import { fail, ok } from '../../utils/response';

export const adminOpsRouter = Router();

const staff = ['staff', 'manager', 'admin'] as const;
const managers = ['manager', 'admin'] as const;

function autoConfirmWindow() {
  const start = Number(process.env.AUTO_CONFIRM_START_HOUR ?? 6);
  const end = Number(process.env.AUTO_CONFIRM_END_HOUR ?? 15);
  const hour = new Date().getHours();
  return {
    startHour: start,
    endHour: end,
    currentlyAutoConfirm: hour >= start && hour < end,
    serverHour: hour,
  };
}

adminOpsRouter.get(
  '/dashboard',
  requireAuth,
  requireRoles(...staff),
  async (req, res, next) => {
    try {
      const branchId =
        typeof req.query.branchId === 'string'
          ? req.query.branchId
          : '00000000-0000-4000-8000-000000000010';
      const { rows } = await pool.query(
        `SELECT
           COUNT(*)::int AS "ordersToday",
           COUNT(*) FILTER (WHERE status = 'placed')::int AS pending,
           COUNT(*) FILTER (WHERE status IN ('confirmed','in_progress'))::int AS inKitchen,
           COUNT(*) FILTER (WHERE status IN ('completed','closed'))::int AS completedToday,
           COALESCE(SUM(total) FILTER (WHERE payment_method = 'cod'
             AND status NOT IN ('cancelled','payment_failed')), 0)::float8 AS "codTotalToday"
         FROM orders
         WHERE branch_id = $1::uuid
           AND placed_at::date = CURRENT_DATE`,
        [branchId],
      );
      return res.json(
        ok(
          { ...rows[0], autoConfirm: autoConfirmWindow(), branchId },
          { requestId: res.locals.requestId },
        ),
      );
    } catch (err) {
      return next(err);
    }
  },
);

adminOpsRouter.get(
  '/users',
  requireAuth,
  requireRoles(...managers),
  async (_req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, name, phone, email, role, preferred_language AS "preferredLanguage",
                created_at AS "createdAt"
         FROM users
         ORDER BY created_at DESC
         LIMIT 200`,
      );
      return res.json(ok(rows, { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminOpsRouter.patch(
  '/users/:userId/role',
  requireAuth,
  requireRoles(...managers),
  async (req, res, next) => {
    try {
      const role = String(req.body?.role ?? '');
      if (!['customer', 'staff', 'manager', 'admin'].includes(role)) {
        const err = fail('VALIDATION_ERROR', 'Invalid role');
        return res.status(err.status).json({
          ...err.body,
          meta: { requestId: res.locals.requestId },
        });
      }
      const { rows } = await pool.query(
        `UPDATE users SET role = $2 WHERE id = $1
         RETURNING id, name, phone, role`,
        [req.params.userId, role],
      );
      if (!rows[0]) {
        return res.status(404).json({
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'User not found' },
          meta: { requestId: res.locals.requestId },
        });
      }
      return res.json(ok(rows[0], { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminOpsRouter.get(
  '/reports/cod-day',
  requireAuth,
  requireRoles(...staff),
  async (req, res, next) => {
    try {
      const branchId =
        typeof req.query.branchId === 'string'
          ? req.query.branchId
          : '00000000-0000-4000-8000-000000000010';
      const day =
        typeof req.query.day === 'string' ? req.query.day : new Date().toISOString().slice(0, 10);
      const { rows } = await pool.query(
        `SELECT
           o.id,
           o.order_number AS "orderNumber",
           o.status,
           o.total::float8 AS total,
           o.placed_at AS "placedAt",
           u.name AS "customerName",
           u.phone AS "customerPhone"
         FROM orders o
         JOIN users u ON u.id = o.user_id
         WHERE o.branch_id = $1::uuid
           AND o.payment_method = 'cod'
           AND o.placed_at::date = $2::date
           AND o.status NOT IN ('cancelled', 'payment_failed')
         ORDER BY o.placed_at ASC`,
        [branchId, day],
      );
      const collected = rows
        .filter((r) => ['completed', 'closed'].includes(r.status))
        .reduce((s, r) => s + Number(r.total), 0);
      const outstanding = rows
        .filter((r) => !['completed', 'closed'].includes(r.status))
        .reduce((s, r) => s + Number(r.total), 0);
      return res.json(
        ok(
          {
            day,
            branchId,
            orders: rows,
            collected,
            outstanding,
            orderCount: rows.length,
          },
          { requestId: res.locals.requestId },
        ),
      );
    } catch (err) {
      return next(err);
    }
  },
);

adminOpsRouter.get(
  '/settings/auto-confirm',
  requireAuth,
  requireRoles(...staff),
  async (_req, res, next) => {
    try {
      return res.json(ok(autoConfirmWindow(), { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminOpsRouter.get(
  '/coupons',
  requireAuth,
  requireRoles(...staff),
  async (_req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, code, description, discount_type AS "discountType",
                discount_value::float8 AS "discountValue",
                min_items AS "minItems", min_subtotal::float8 AS "minSubtotal",
                is_active AS "isActive"
         FROM coupons ORDER BY created_at DESC`,
      );
      return res.json(ok(rows, { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminOpsRouter.post(
  '/coupons',
  requireAuth,
  requireRoles(...managers),
  async (req, res, next) => {
    try {
      const code = String(req.body?.code ?? '')
        .trim()
        .toUpperCase();
      const discountValue = Number(req.body?.discountValue);
      if (!code || !(discountValue > 0)) {
        const err = fail('VALIDATION_ERROR', 'code and discountValue required');
        return res.status(err.status).json({
          ...err.body,
          meta: { requestId: res.locals.requestId },
        });
      }
      const { rows } = await pool.query(
        `INSERT INTO coupons (code, description, discount_value, min_items, min_subtotal, is_active)
         VALUES ($1,$2,$3,$4,$5,COALESCE($6,TRUE))
         RETURNING id, code, description, discount_type AS "discountType",
                   discount_value::float8 AS "discountValue",
                   min_items AS "minItems", min_subtotal::float8 AS "minSubtotal",
                   is_active AS "isActive"`,
        [
          code,
          req.body?.description ?? null,
          discountValue,
          Number(req.body?.minItems ?? 0),
          Number(req.body?.minSubtotal ?? 0),
          req.body?.isActive,
        ],
      );
      return res.status(201).json(ok(rows[0], { requestId: res.locals.requestId }));
    } catch (err) {
      const e = err as { code?: string };
      if (e.code === '23505') {
        return res.status(400).json({
          success: false,
          data: null,
          error: { code: 'DUPLICATE', message: 'Coupon code exists' },
          meta: { requestId: res.locals.requestId },
        });
      }
      return next(err);
    }
  },
);

adminOpsRouter.patch(
  '/coupons/:couponId',
  requireAuth,
  requireRoles(...managers),
  async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `UPDATE coupons SET
           description = COALESCE($2, description),
           discount_value = COALESCE($3, discount_value),
           min_items = COALESCE($4, min_items),
           min_subtotal = COALESCE($5, min_subtotal),
           is_active = COALESCE($6, is_active)
         WHERE id = $1
         RETURNING id, code, description, discount_type AS "discountType",
                   discount_value::float8 AS "discountValue",
                   min_items AS "minItems", min_subtotal::float8 AS "minSubtotal",
                   is_active AS "isActive"`,
        [
          req.params.couponId,
          req.body?.description ?? null,
          req.body?.discountValue != null ? Number(req.body.discountValue) : null,
          req.body?.minItems != null ? Number(req.body.minItems) : null,
          req.body?.minSubtotal != null ? Number(req.body.minSubtotal) : null,
          typeof req.body?.isActive === 'boolean' ? req.body.isActive : null,
        ],
      );
      if (!rows[0]) {
        return res.status(404).json({
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Coupon not found' },
          meta: { requestId: res.locals.requestId },
        });
      }
      return res.json(ok(rows[0], { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminOpsRouter.get(
  '/banners',
  requireAuth,
  requireRoles(...staff),
  async (_req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, title, body, sort_order AS "sortOrder", is_active AS "isActive"
         FROM banners ORDER BY sort_order, created_at`,
      );
      return res.json(ok(rows, { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminOpsRouter.post(
  '/banners',
  requireAuth,
  requireRoles(...managers),
  async (req, res, next) => {
    try {
      const title = String(req.body?.title ?? '').trim();
      if (!title) {
        const err = fail('VALIDATION_ERROR', 'title required');
        return res.status(err.status).json({
          ...err.body,
          meta: { requestId: res.locals.requestId },
        });
      }
      const { rows } = await pool.query(
        `INSERT INTO banners (title, body, sort_order, is_active)
         VALUES ($1,$2,COALESCE($3,0),COALESCE($4,TRUE))
         RETURNING id, title, body, sort_order AS "sortOrder", is_active AS "isActive"`,
        [title, req.body?.body ?? null, req.body?.sortOrder, req.body?.isActive],
      );
      return res.status(201).json(ok(rows[0], { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminOpsRouter.patch(
  '/banners/:bannerId',
  requireAuth,
  requireRoles(...managers),
  async (req, res, next) => {
    try {
      const { rows } = await pool.query(
        `UPDATE banners SET
           title = COALESCE($2, title),
           body = COALESCE($3, body),
           sort_order = COALESCE($4, sort_order),
           is_active = COALESCE($5, is_active)
         WHERE id = $1
         RETURNING id, title, body, sort_order AS "sortOrder", is_active AS "isActive"`,
        [
          req.params.bannerId,
          req.body?.title ?? null,
          req.body?.body ?? null,
          req.body?.sortOrder != null ? Number(req.body.sortOrder) : null,
          typeof req.body?.isActive === 'boolean' ? req.body.isActive : null,
        ],
      );
      if (!rows[0]) {
        return res.status(404).json({
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Banner not found' },
          meta: { requestId: res.locals.requestId },
        });
      }
      return res.json(ok(rows[0], { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);
