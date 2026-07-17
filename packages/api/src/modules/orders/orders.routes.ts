import { Router } from 'express';
import { pool } from '../../db/pool';
import { requireAuth, requireRoles } from '../../middleware/auth';
import { notifyOrderStatus } from '../../utils/notify';
import { fail, ok } from '../../utils/response';

export const ordersRouter = Router();
export const adminOrdersRouter = Router();

function nextOrderNumber(): string {
  const n = Date.now().toString().slice(-8);
  return `EF-${n}`;
}

function shouldAutoConfirm(now = new Date()): boolean {
  // Default window 6:00–15:00 local server time (Lean configurable later)
  const hour = now.getHours();
  return hour >= 6 && hour < 15;
}

async function getOrderDetail(orderId: string, userId?: string) {
  const orderRes = await pool.query(
    `SELECT
       o.id,
       o.order_number AS "orderNumber",
       o.status,
       o.fulfillment_type AS "fulfillmentType",
       o.payment_method AS "paymentMethod",
       o.subtotal::float8 AS subtotal,
       o.delivery_fee::float8 AS "deliveryFee",
       o.discount::float8 AS discount,
       o.total::float8 AS total,
       o.placed_at AS "placedAt",
       o.user_id AS "userId"
     FROM orders o
     WHERE o.id = $1`,
    [orderId],
  );
  if (!orderRes.rowCount) return null;
  const order = orderRes.rows[0];
  if (userId && order.userId !== userId) return null;

  const items = await pool.query(
    `SELECT
       product_id AS "productId",
       name_snapshot AS name,
       unit_price::float8 AS "unitPrice",
       qty,
       line_total::float8 AS "lineTotal"
     FROM order_items WHERE order_id = $1`,
    [orderId],
  );
  const timeline = await pool.query(
    `SELECT status, at FROM order_events WHERE order_id = $1 ORDER BY at ASC`,
    [orderId],
  );

  const ageMs = Date.now() - new Date(order.placedAt).getTime();
  const canCancel =
    ['placed', 'confirmed'].includes(order.status) && ageMs <= 5 * 60 * 1000;

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    fulfillmentType: order.fulfillmentType,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    discount: order.discount,
    total: order.total,
    items: items.rows,
    timeline: timeline.rows,
    placedAt: order.placedAt,
    canCancel,
  };
}

ordersRouter.get('/', requireAuth, async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         o.id,
         o.order_number AS "orderNumber",
         o.status,
         o.total::float8 AS total,
         o.placed_at AS "placedAt",
         (SELECT COUNT(*)::int FROM order_items oi WHERE oi.order_id = o.id) AS "itemCount"
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.placed_at DESC
       LIMIT 50`,
      [res.locals.user!.id],
    );
    return res.json(ok(rows, { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});

ordersRouter.get('/:orderId', requireAuth, async (req, res, next) => {
  try {
    const detail = await getOrderDetail(req.params.orderId, res.locals.user!.id);
    if (!detail) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
        meta: { requestId: res.locals.requestId },
      });
    }
    return res.json(ok(detail, { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});

ordersRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const idempotencyKey = req.headers['idempotency-key'];
    if (!idempotencyKey) {
      const err = fail('VALIDATION_ERROR', 'Idempotency-Key header is required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }

    const {
      branchId,
      fulfillmentType,
      paymentMethod,
      addressId,
      items,
      couponCode,
    } = req.body ?? {};

    if (!branchId || !Array.isArray(items) || items.length < 1) {
      const err = fail('VALIDATION_ERROR', 'branchId and items are required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }
    if (!['delivery', 'pickup'].includes(fulfillmentType)) {
      const err = fail('VALIDATION_ERROR', 'fulfillmentType must be delivery or pickup');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }
    // Lean Launch: COD only
    if (paymentMethod !== 'cod') {
      const err = fail(
        'PAYMENT_NOT_ENABLED',
        'Only COD is enabled at launch. Razorpay comes later.',
      );
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }
    if (fulfillmentType === 'delivery' && !addressId) {
      const err = fail('VALIDATION_ERROR', 'addressId required for delivery');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let subtotal = 0;
      const lineRows: Array<{
        productId: string;
        name: string;
        unitPrice: number;
        qty: number;
        lineTotal: number;
      }> = [];

      for (const item of items) {
        const productId = String(item.productId);
        const qty = Number(item.qty);
        const product = await client.query(
          `SELECT p.id, p.name, p.price::float8 AS price, p.min_qty AS "minQty",
                  COALESCE(i.is_available, p.is_active) AS "isAvailable",
                  COALESCE(i.available_qty, 0) AS "availableQty"
           FROM products p
           LEFT JOIN inventory i ON i.product_id = p.id AND i.branch_id = $2
           WHERE p.id = $1`,
          [productId, branchId],
        );
        if (!product.rowCount || !product.rows[0].isAvailable) {
          throw Object.assign(new Error(`Product unavailable: ${productId}`), {
            status: 400,
            code: 'UNAVAILABLE',
          });
        }
        if (qty < product.rows[0].minQty) {
          throw Object.assign(
            new Error(`Min qty ${product.rows[0].minQty} for ${product.rows[0].name}`),
            { status: 400, code: 'MIN_QTY' },
          );
        }
        if (product.rows[0].availableQty < qty) {
          throw Object.assign(new Error(`Insufficient stock for ${product.rows[0].name}`), {
            status: 400,
            code: 'OUT_OF_STOCK',
          });
        }
        const unitPrice = Number(product.rows[0].price);
        const lineTotal = unitPrice * qty;
        subtotal += lineTotal;
        lineRows.push({
          productId,
          name: product.rows[0].name,
          unitPrice,
          qty,
          lineTotal,
        });
      }

      const deliveryFee = fulfillmentType === 'delivery' ? 30 : 0;
      let discount = 0;
      if (couponCode) {
        const code = String(couponCode).trim().toUpperCase();
        const coupon = await client.query(
          `SELECT discount_value::float8 AS "discountValue",
                  min_items AS "minItems", min_subtotal::float8 AS "minSubtotal"
           FROM coupons WHERE code = $1 AND is_active = TRUE LIMIT 1`,
          [code],
        );
        if (!coupon.rowCount) {
          throw Object.assign(new Error('Invalid coupon'), {
            status: 400,
            code: 'COUPON_INVALID',
          });
        }
        const c = coupon.rows[0];
        const itemCount = lineRows.reduce((n, l) => n + l.qty, 0);
        if (itemCount < c.minItems || subtotal < c.minSubtotal) {
          throw Object.assign(new Error('Coupon conditions not met'), {
            status: 400,
            code: 'COUPON_NOT_APPLICABLE',
          });
        }
        discount = Math.min(Number(c.discountValue), subtotal);
      }
      const total = Math.max(0, subtotal + deliveryFee - discount);
      const status = shouldAutoConfirm() ? 'confirmed' : 'placed';
      const orderNumber = nextOrderNumber();

      const orderIns = await client.query(
        `INSERT INTO orders (
           order_number, user_id, branch_id, status, fulfillment_type,
           payment_method, address_id, subtotal, delivery_fee, discount, total
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING id`,
        [
          orderNumber,
          res.locals.user!.id,
          branchId,
          status,
          fulfillmentType,
          'cod',
          addressId || null,
          subtotal,
          deliveryFee,
          discount,
          total,
        ],
      );
      const orderId = orderIns.rows[0].id;

      for (const line of lineRows) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name_snapshot, unit_price, qty, line_total)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [orderId, line.productId, line.name, line.unitPrice, line.qty, line.lineTotal],
        );
        await client.query(
          `UPDATE inventory
           SET available_qty = available_qty - $1
           WHERE branch_id = $2 AND product_id = $3`,
          [line.qty, branchId, line.productId],
        );
      }

      await client.query(
        `INSERT INTO order_events (order_id, status, note) VALUES ($1, 'placed', 'Order created')`,
        [orderId],
      );
      if (status === 'confirmed') {
        await client.query(
          `INSERT INTO order_events (order_id, status, note)
           VALUES ($1, 'confirmed', 'Auto-confirmed within window')`,
          [orderId],
        );
      }

      // Clear cart for branch after successful order
      await client.query(
        `DELETE FROM cart_items
         WHERE cart_id IN (
           SELECT id FROM carts WHERE user_id = $1 AND branch_id = $2
         )`,
        [res.locals.user!.id, branchId],
      );

      await client.query('COMMIT');
      const detail = await getOrderDetail(orderId, res.locals.user!.id);
      return res.status(201).json(ok(detail, { requestId: res.locals.requestId }));
    } catch (err) {
      await client.query('ROLLBACK');
      const e = err as { status?: number; code?: string; message?: string };
      if (e.status) {
        return res.status(e.status).json({
          success: false,
          data: null,
          error: { code: e.code || 'ORDER_ERROR', message: e.message || 'Order failed' },
          meta: { requestId: res.locals.requestId },
        });
      }
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    return next(err);
  }
});

ordersRouter.post('/:orderId/cancel', requireAuth, async (req, res, next) => {
  try {
    const detail = await getOrderDetail(req.params.orderId, res.locals.user!.id);
    if (!detail) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
        meta: { requestId: res.locals.requestId },
      });
    }
    if (!detail.canCancel) {
      return res.status(409).json({
        success: false,
        data: null,
        error: { code: 'CANCEL_WINDOW_CLOSED', message: 'Outside cancel window' },
        meta: { requestId: res.locals.requestId },
      });
    }
    await pool.query(`UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1`, [
      detail.id,
    ]);
    await pool.query(
      `INSERT INTO order_events (order_id, status, note) VALUES ($1, 'cancelled', $2)`,
      [detail.id, String(req.body?.reason ?? 'customer_cancel')],
    );
    return res.json(ok({ cancelled: true }, { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});

adminOrdersRouter.get(
  '/',
  requireAuth,
  requireRoles('staff', 'manager', 'admin'),
  async (req, res, next) => {
    try {
      const branchId = typeof req.query.branchId === 'string' ? req.query.branchId : null;
      const status = typeof req.query.status === 'string' ? req.query.status : null;
      const { rows } = await pool.query(
        `SELECT
           o.id,
           o.order_number AS "orderNumber",
           o.status,
           o.fulfillment_type AS "fulfillmentType",
           o.payment_method AS "paymentMethod",
           o.total::float8 AS total,
           o.placed_at AS "placedAt",
           u.name AS "customerName",
           u.phone AS "customerPhone"
         FROM orders o
         JOIN users u ON u.id = o.user_id
         WHERE ($1::uuid IS NULL OR o.branch_id = $1::uuid)
           AND ($2::text IS NULL OR o.status = $2::text)
         ORDER BY o.placed_at DESC
         LIMIT 100`,
        [branchId, status],
      );
      return res.json(ok(rows, { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminOrdersRouter.get(
  '/:orderId',
  requireAuth,
  requireRoles('staff', 'manager', 'admin'),
  async (req, res, next) => {
    try {
      const orderRes = await pool.query(
        `SELECT
           o.id,
           o.order_number AS "orderNumber",
           o.status,
           o.fulfillment_type AS "fulfillmentType",
           o.payment_method AS "paymentMethod",
           o.subtotal::float8 AS subtotal,
           o.delivery_fee::float8 AS "deliveryFee",
           o.discount::float8 AS discount,
           o.total::float8 AS total,
           o.placed_at AS "placedAt",
           o.user_id AS "userId",
           u.name AS "customerName",
           u.phone AS "customerPhone",
           a.line1 AS "addressLine1"
         FROM orders o
         JOIN users u ON u.id = o.user_id
         LEFT JOIN addresses a ON a.id = o.address_id
         WHERE o.id = $1`,
        [req.params.orderId],
      );
      if (!orderRes.rowCount) {
        return res.status(404).json({
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Order not found' },
          meta: { requestId: res.locals.requestId },
        });
      }
      const items = await pool.query(
        `SELECT product_id AS "productId", name_snapshot AS name,
                unit_price::float8 AS "unitPrice", qty, line_total::float8 AS "lineTotal"
         FROM order_items WHERE order_id = $1`,
        [req.params.orderId],
      );
      const timeline = await pool.query(
        `SELECT status, at, note FROM order_events WHERE order_id = $1 ORDER BY at ASC`,
        [req.params.orderId],
      );
      return res.json(
        ok(
          { ...orderRes.rows[0], items: items.rows, timeline: timeline.rows },
          { requestId: res.locals.requestId },
        ),
      );
    } catch (err) {
      return next(err);
    }
  },
);

adminOrdersRouter.post(
  '/:orderId/status',
  requireAuth,
  requireRoles('staff', 'manager', 'admin'),
  async (req, res, next) => {
    try {
      const status = String(req.body?.status ?? '');
      const allowed = [
        'placed',
        'confirmed',
        'in_progress',
        'completed',
        'closed',
        'cancelled',
      ];
      if (!allowed.includes(status)) {
        const err = fail('VALIDATION_ERROR', 'Invalid status');
        return res.status(err.status).json({
          ...err.body,
          meta: { requestId: res.locals.requestId },
        });
      }
      const updated = await pool.query(
        `UPDATE orders SET status = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, order_number AS "orderNumber", user_id AS "userId", status`,
        [status, req.params.orderId],
      );
      if (!updated.rowCount) {
        return res.status(404).json({
          success: false,
          data: null,
          error: { code: 'NOT_FOUND', message: 'Order not found' },
          meta: { requestId: res.locals.requestId },
        });
      }
      await pool.query(
        `INSERT INTO order_events (order_id, status, note) VALUES ($1, $2, $3)`,
        [req.params.orderId, status, String(req.body?.note ?? 'admin update')],
      );
      await notifyOrderStatus({
        userId: updated.rows[0].userId,
        orderNumber: updated.rows[0].orderNumber,
        status,
      });
      return res.json(ok({ updated: true, status }, { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);
