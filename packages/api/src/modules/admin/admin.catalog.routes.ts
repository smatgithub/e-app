import { Router } from 'express';
import { pool } from '../../db/pool';
import { requireAuth, requireRoles } from '../../middleware/auth';
import { fail, ok } from '../../utils/response';

export const adminCatalogRouter = Router();

const staffRoles = ['staff', 'manager', 'admin'] as const;

adminCatalogRouter.get(
  '/products',
  requireAuth,
  requireRoles(...staffRoles),
  async (req, res, next) => {
    try {
      const branchId =
        typeof req.query.branchId === 'string'
          ? req.query.branchId
          : '00000000-0000-4000-8000-000000000010';
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
           p.is_active AS "isActive",
           COALESCE(i.available_qty, 0) AS "availableQty",
           COALESCE(i.is_available, FALSE) AS "isAvailable"
         FROM products p
         LEFT JOIN categories c ON c.id = p.category_id
         LEFT JOIN inventory i ON i.product_id = p.id AND i.branch_id = $1::uuid
         ORDER BY c.sort_order NULLS LAST, p.name`,
        [branchId],
      );
      return res.json(ok(rows, { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminCatalogRouter.post(
  '/products',
  requireAuth,
  requireRoles('manager', 'admin'),
  async (req, res, next) => {
    try {
      const {
        sku,
        name,
        description,
        categoryId,
        price,
        minQty,
        imageUrl,
        isActive = true,
        branchId = '00000000-0000-4000-8000-000000000010',
        availableQty = 0,
      } = req.body ?? {};

      if (!sku || !name || price == null || !minQty) {
        const err = fail('VALIDATION_ERROR', 'sku, name, price, minQty are required');
        return res.status(err.status).json({
          ...err.body,
          meta: { requestId: res.locals.requestId },
        });
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const product = await client.query(
          `INSERT INTO products (sku, name, description, category_id, price, min_qty, image_url, is_active)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           RETURNING id, sku, name, description, category_id AS "categoryId",
                     price::float8 AS price, min_qty AS "minQty",
                     image_url AS "imageUrl", is_active AS "isActive"`,
          [
            String(sku).trim(),
            String(name).trim(),
            description ?? null,
            categoryId || null,
            Number(price),
            Number(minQty),
            imageUrl ?? null,
            Boolean(isActive),
          ],
        );
        await client.query(
          `INSERT INTO inventory (branch_id, product_id, available_qty, is_available)
           VALUES ($1,$2,$3,$4)
           ON CONFLICT (branch_id, product_id)
           DO UPDATE SET available_qty = EXCLUDED.available_qty, is_available = EXCLUDED.is_available`,
          [branchId, product.rows[0].id, Number(availableQty), Boolean(isActive)],
        );
        await client.query('COMMIT');
        return res.status(201).json(
          ok(
            { ...product.rows[0], availableQty: Number(availableQty), branchId },
            { requestId: res.locals.requestId },
          ),
        );
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      const e = err as { code?: string };
      if (e.code === '23505') {
        return res.status(400).json({
          success: false,
          data: null,
          error: { code: 'DUPLICATE_SKU', message: 'SKU already exists' },
          meta: { requestId: res.locals.requestId },
        });
      }
      return next(err);
    }
  },
);

adminCatalogRouter.patch(
  '/products/:productId',
  requireAuth,
  requireRoles('manager', 'admin'),
  async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const {
        name,
        description,
        categoryId,
        price,
        minQty,
        imageUrl,
        isActive,
        branchId = '00000000-0000-4000-8000-000000000010',
        availableQty,
        isAvailable,
      } = req.body ?? {};

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const updated = await client.query(
          `UPDATE products SET
             name = COALESCE($2, name),
             description = COALESCE($3, description),
             category_id = COALESCE($4, category_id),
             price = COALESCE($5, price),
             min_qty = COALESCE($6, min_qty),
             image_url = COALESCE($7, image_url),
             is_active = COALESCE($8, is_active)
           WHERE id = $1
           RETURNING id, sku, name, description, category_id AS "categoryId",
                     price::float8 AS price, min_qty AS "minQty",
                     image_url AS "imageUrl", is_active AS "isActive"`,
          [
            productId,
            name ?? null,
            description ?? null,
            categoryId ?? null,
            price != null ? Number(price) : null,
            minQty != null ? Number(minQty) : null,
            imageUrl ?? null,
            typeof isActive === 'boolean' ? isActive : null,
          ],
        );
        if (!updated.rowCount) {
          await client.query('ROLLBACK');
          return res.status(404).json({
            success: false,
            data: null,
            error: { code: 'NOT_FOUND', message: 'Product not found' },
            meta: { requestId: res.locals.requestId },
          });
        }

        if (availableQty != null || typeof isAvailable === 'boolean') {
          await client.query(
            `INSERT INTO inventory (branch_id, product_id, available_qty, is_available)
             VALUES ($1,$2,COALESCE($3,0),COALESCE($4,TRUE))
             ON CONFLICT (branch_id, product_id)
             DO UPDATE SET
               available_qty = COALESCE($3, inventory.available_qty),
               is_available = COALESCE($4, inventory.is_available)`,
            [
              branchId,
              productId,
              availableQty != null ? Number(availableQty) : null,
              typeof isAvailable === 'boolean' ? isAvailable : null,
            ],
          );
        }
        await client.query('COMMIT');
        return res.json(ok(updated.rows[0], { requestId: res.locals.requestId }));
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } catch (err) {
      return next(err);
    }
  },
);

adminCatalogRouter.get(
  '/categories',
  requireAuth,
  requireRoles(...staffRoles),
  async (_req, res, next) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, name, sort_order AS "sortOrder", is_active AS "isActive"
         FROM categories
         ORDER BY sort_order, name`,
      );
      return res.json(ok(rows, { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);

adminCatalogRouter.post(
  '/categories',
  requireAuth,
  requireRoles('manager', 'admin'),
  async (req, res, next) => {
    try {
      const name = String(req.body?.name ?? '').trim();
      const sortOrder = Number(req.body?.sortOrder ?? 99);
      if (!name) {
        const err = fail('VALIDATION_ERROR', 'name is required');
        return res.status(err.status).json({
          ...err.body,
          meta: { requestId: res.locals.requestId },
        });
      }
      const { rows } = await pool.query(
        `INSERT INTO categories (name, sort_order, is_active)
         VALUES ($1, $2, TRUE)
         RETURNING id, name, sort_order AS "sortOrder", is_active AS "isActive"`,
        [name, sortOrder],
      );
      return res.status(201).json(ok(rows[0], { requestId: res.locals.requestId }));
    } catch (err) {
      return next(err);
    }
  },
);
