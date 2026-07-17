import { Router } from 'express';
import { pool } from '../../db/pool';
import { ok } from '../../utils/response';

export const catalogRouter = Router();

catalogRouter.get('/branches', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, code, vertical, is_active AS "isActive"
       FROM branches
       WHERE is_active = TRUE
       ORDER BY name`,
    );
    res.json(ok(rows, { requestId: res.locals.requestId }));
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/categories', async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, sort_order AS "sortOrder"
       FROM categories
       WHERE is_active = TRUE
       ORDER BY sort_order, name`,
    );
    res.json(ok(rows, { requestId: res.locals.requestId }));
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/products', async (req, res, next) => {
  try {
    const branchId = typeof req.query.branchId === 'string' ? req.query.branchId : null;
    const categoryId =
      typeof req.query.categoryId === 'string' ? req.query.categoryId : null;
    const q =
      typeof req.query.q === 'string' && req.query.q.trim()
        ? `%${req.query.q.trim()}%`
        : null;

    const { rows } = await pool.query(
      `SELECT
         p.id,
         p.sku,
         p.name,
         p.description,
         p.category_id AS "categoryId",
         c.name AS "categoryName",
         p.price::float8 AS price,
         p.min_qty AS "minQty",
         p.image_url AS "imageUrl",
         COALESCE(i.is_available, p.is_active) AS "isAvailable",
         i.available_qty AS "availableQty"
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN inventory i
         ON i.product_id = p.id
        AND ($1::uuid IS NULL OR i.branch_id = $1::uuid)
       WHERE p.is_active = TRUE
         AND ($2::uuid IS NULL OR p.category_id = $2::uuid)
         AND ($3::text IS NULL OR p.name ILIKE $3 OR p.description ILIKE $3 OR p.sku ILIKE $3)
       ORDER BY c.sort_order NULLS LAST, p.name`,
      [branchId, categoryId, q],
    );
    res.json(
      ok(rows, {
        requestId: res.locals.requestId,
        page: 1,
        pageSize: rows.length,
        total: rows.length,
      }),
    );
  } catch (err) {
    next(err);
  }
});

catalogRouter.get('/products/:productId', async (req, res, next) => {
  try {
    const branchId = typeof req.query.branchId === 'string' ? req.query.branchId : null;
    const { rows } = await pool.query(
      `SELECT
         p.id,
         p.sku,
         p.name,
         p.description,
         p.category_id AS "categoryId",
         c.name AS "categoryName",
         p.price::float8 AS price,
         p.min_qty AS "minQty",
         p.image_url AS "imageUrl",
         COALESCE(i.is_available, p.is_active) AS "isAvailable",
         i.available_qty AS "availableQty"
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN inventory i
         ON i.product_id = p.id
        AND ($2::uuid IS NULL OR i.branch_id = $2::uuid)
       WHERE p.id = $1::uuid
       LIMIT 1`,
      [req.params.productId, branchId],
    );
    if (!rows[0]) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Product not found' },
        meta: { requestId: res.locals.requestId },
      });
    }
    return res.json(ok(rows[0], { requestId: res.locals.requestId }));
  } catch (err) {
    return next(err);
  }
});
