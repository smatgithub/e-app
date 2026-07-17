-- Expanded food catalog seed for Main Branch

INSERT INTO categories (id, name, sort_order, is_active) VALUES
  ('00000000-0000-4000-8000-000000000203', 'Rolls', 3, TRUE),
  ('00000000-0000-4000-8000-000000000204', 'Beverages', 4, TRUE),
  ('00000000-0000-4000-8000-000000000205', 'Combos', 5, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, sku, name, description, category_id, price, min_qty, is_active) VALUES
  (
    '00000000-0000-4000-8000-000000000103',
    'BIR-MUTTON',
    'Mutton Biryani',
    'Slow-cooked mutton biryani. Serves 1.',
    '00000000-0000-4000-8000-000000000201',
    240,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000104',
    'BIR-EGG',
    'Egg Biryani',
    'Spiced egg biryani. Serves 1.',
    '00000000-0000-4000-8000-000000000201',
    150,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000105',
    'MOMO-CHICKEN',
    'Chicken Momos',
    'Steamed chicken momos (6 pcs).',
    '00000000-0000-4000-8000-000000000202',
    120,
    2,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000106',
    'MOMO-FRIED',
    'Fried Momos',
    'Crispy fried veg momos (6 pcs).',
    '00000000-0000-4000-8000-000000000202',
    110,
    2,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000107',
    'ROLL-EGG',
    'Egg Roll',
    'Classic egg roll with onion and sauce.',
    '00000000-0000-4000-8000-000000000203',
    60,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000108',
    'ROLL-CHICKEN',
    'Chicken Roll',
    'Chicken roll with spicy masala.',
    '00000000-0000-4000-8000-000000000203',
    90,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000109',
    'BEV-COKE',
    'Cold Drink',
    'Chilled soft drink 250ml.',
    '00000000-0000-4000-8000-000000000204',
    30,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000110',
    'BEV-LASSI',
    'Sweet Lassi',
    'Fresh sweet lassi.',
    '00000000-0000-4000-8000-000000000204',
    50,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000111',
    'COMBO-BIR-DRINK',
    'Biryani + Drink Combo',
    'Chicken biryani with cold drink.',
    '00000000-0000-4000-8000-000000000205',
    200,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000112',
    'COMBO-MOMO-ROLL',
    'Momo + Roll Combo',
    'Veg momos (min 2) style combo with egg roll pricing pack.',
    '00000000-0000-4000-8000-000000000205',
    140,
    1,
    TRUE
  )
ON CONFLICT (sku) DO NOTHING;

INSERT INTO inventory (branch_id, product_id, available_qty, is_available)
SELECT
  '00000000-0000-4000-8000-000000000010',
  p.id,
  CASE
    WHEN p.sku LIKE 'BEV-%' THEN 100
    WHEN p.sku LIKE 'COMBO-%' THEN 25
    ELSE 40
  END,
  TRUE
FROM products p
WHERE p.sku IN (
  'BIR-MUTTON', 'BIR-EGG', 'MOMO-CHICKEN', 'MOMO-FRIED',
  'ROLL-EGG', 'ROLL-CHICKEN', 'BEV-COKE', 'BEV-LASSI',
  'COMBO-BIR-DRINK', 'COMBO-MOMO-ROLL',
  'BIR-CHICKEN', 'MOMO-VEG'
)
ON CONFLICT (branch_id, product_id) DO UPDATE
SET available_qty = GREATEST(inventory.available_qty, EXCLUDED.available_qty),
    is_available = TRUE;
