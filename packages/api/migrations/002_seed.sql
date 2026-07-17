-- v0 seed data

INSERT INTO branches (id, name, code, vertical, is_active)
VALUES (
  '00000000-0000-4000-8000-000000000010',
  'Main Branch',
  'MAIN',
  'food',
  TRUE
)
ON CONFLICT (code) DO NOTHING;

INSERT INTO categories (id, name, sort_order, is_active) VALUES
  ('00000000-0000-4000-8000-000000000201', 'Biryani', 1, TRUE),
  ('00000000-0000-4000-8000-000000000202', 'Momos', 2, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, sku, name, description, category_id, price, min_qty, is_active) VALUES
  (
    '00000000-0000-4000-8000-000000000101',
    'BIR-CHICKEN',
    'Chicken Biryani',
    'Fragrant rice with chicken. Serves 1.',
    '00000000-0000-4000-8000-000000000201',
    180,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    'MOMO-VEG',
    'Veg Momos',
    'Steamed vegetable momos.',
    '00000000-0000-4000-8000-000000000202',
    90,
    2,
    TRUE
  )
ON CONFLICT (sku) DO NOTHING;

INSERT INTO inventory (branch_id, product_id, available_qty, is_available) VALUES
  (
    '00000000-0000-4000-8000-000000000010',
    '00000000-0000-4000-8000-000000000101',
    40,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000010',
    '00000000-0000-4000-8000-000000000102',
    12,
    TRUE
  )
ON CONFLICT (branch_id, product_id) DO NOTHING;
