import { Router } from 'express';
import { pool } from '../../db/pool';
import { requireAuth } from '../../middleware/auth';
import { fail, ok } from '../../utils/response';

export const cartRouter = Router();

async function loadCart(userId: string, branchId: string) {
  const cartRes = await pool.query(
    `SELECT id, branch_id AS "branchId" FROM carts WHERE user_id = $1 AND branch_id = $2`,
    [userId, branchId],
  );
  if (!cartRes.rowCount) {
    return { branchId, items: [], subtotal: 0 };
  }
  const cartId = cartRes.rows[0].id;
  const items = await pool.query(
    `SELECT
       ci.product_id AS "productId",
       p.name,
       p.price::float8 AS "unitPrice",
       ci.qty,
       (p.price * ci.qty)::float8 AS "lineTotal",
       p.min_qty AS "minQty"
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1
     ORDER BY p.name`,
    [cartId],
  );
  const subtotal = items.rows.reduce(
    (sum: number, row: { lineTotal: number }) => sum + Number(row.lineTotal),
    0,
  );
  return { branchId, items: items.rows, subtotal };
}

cartRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const branchId = String(req.query.branchId ?? '');
    if (!branchId) {
      const err = fail('VALIDATION_ERROR', 'branchId is required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }
    const cart = await loadCart(res.locals.user!.id, branchId);
    return res.json(ok(cart, { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});

cartRouter.put('/', requireAuth, async (req, res, next) => {
  try {
    const branchId = String(req.query.branchId ?? '');
    const items = Array.isArray(req.body?.items) ? req.body.items : null;
    if (!branchId || !items) {
      const err = fail('VALIDATION_ERROR', 'branchId and items[] are required');
      return res.status(err.status).json({
        ...err.body,
        meta: { requestId: res.locals.requestId },
      });
    }

    for (const item of items) {
      const productId = String(item.productId ?? '');
      const qty = Number(item.qty);
      if (!productId || !Number.isInteger(qty) || qty < 1) {
        const err = fail('VALIDATION_ERROR', 'Each item needs productId and qty >= 1');
        return res.status(err.status).json({
          ...err.body,
          meta: { requestId: res.locals.requestId },
        });
      }
      const product = await pool.query(
        `SELECT min_qty AS "minQty", is_active AS "isActive" FROM products WHERE id = $1`,
        [productId],
      );
      if (!product.rowCount || !product.rows[0].isActive) {
        const err = fail('VALIDATION_ERROR', `Product not available: ${productId}`);
        return res.status(err.status).json({
          ...err.body,
          meta: { requestId: res.locals.requestId },
        });
      }
      if (qty < product.rows[0].minQty) {
        const err = fail(
          'MIN_QTY',
          `Minimum quantity for product is ${product.rows[0].minQty}`,
          400,
          { productId, minQty: product.rows[0].minQty },
        );
        return res.status(err.status).json({
          ...err.body,
          meta: { requestId: res.locals.requestId },
        });
      }
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const cartUpsert = await client.query(
        `INSERT INTO carts (user_id, branch_id, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id, branch_id)
         DO UPDATE SET updated_at = NOW()
         RETURNING id`,
        [res.locals.user!.id, branchId],
      );
      const cartId = cartUpsert.rows[0].id;
      await client.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);
      for (const item of items) {
        await client.query(
          `INSERT INTO cart_items (cart_id, product_id, qty) VALUES ($1, $2, $3)`,
          [cartId, item.productId, item.qty],
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    const cart = await loadCart(res.locals.user!.id, branchId);
    return res.json(ok(cart, { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});
