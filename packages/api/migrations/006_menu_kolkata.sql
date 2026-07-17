-- Real menu seed: Mughlai, Bengali, Indo-Chinese, Continental, Desserts
-- Prices use mid-range of provided approx. bands (INR).

-- Soft-deactivate earlier demo SKUs so the customer menu shows this list cleanly
UPDATE products
SET is_active = FALSE
WHERE sku IN (
  'BIR-CHICKEN', 'BIR-MUTTON', 'BIR-EGG',
  'MOMO-VEG', 'MOMO-CHICKEN', 'MOMO-FRIED',
  'ROLL-EGG', 'ROLL-CHICKEN',
  'BEV-COKE', 'BEV-LASSI',
  'COMBO-BIR-DRINK', 'COMBO-MOMO-ROLL',
  'TEST-SNACK'
);

INSERT INTO categories (id, name, sort_order, is_active) VALUES
  ('00000000-0000-4000-8000-000000000301', 'Mughlai & Biryani', 1, TRUE),
  ('00000000-0000-4000-8000-000000000302', 'Traditional Bengali', 2, TRUE),
  ('00000000-0000-4000-8000-000000000303', 'Indo-Chinese', 3, TRUE),
  ('00000000-0000-4000-8000-000000000304', 'Continental Specials', 4, TRUE),
  ('00000000-0000-4000-8000-000000000305', 'Desserts & Drinks', 5, TRUE)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    sort_order = EXCLUDED.sort_order,
    is_active = TRUE;

-- Keep older demo categories but push them down / inactive for browse clarity
UPDATE categories
SET is_active = FALSE
WHERE id IN (
  '00000000-0000-4000-8000-000000000201',
  '00000000-0000-4000-8000-000000000202',
  '00000000-0000-4000-8000-000000000203',
  '00000000-0000-4000-8000-000000000204',
  '00000000-0000-4000-8000-000000000205'
);

INSERT INTO products (id, sku, name, description, category_id, price, min_qty, is_active) VALUES
  (
    '00000000-0000-4000-8000-000000000401',
    'MUG-MUT-BIR',
    'Kolkata Mutton Biryani',
    'Fragrant long-grain rice with tender meat, a soft boiled egg, and the signature slow-cooked potato.',
    '00000000-0000-4000-8000-000000000301',
    435,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000402',
    'MUG-CH-CHAAP',
    'Chicken Chaap',
    'A rich, slow-cooked, oil-based Mughlai chicken gravy infused with mace and nutmeg.',
    '00000000-0000-4000-8000-000000000301',
    200,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000403',
    'MUG-RESHMI',
    'Chicken Reshmi Kebab',
    'Skewered chicken chunks marinated in a creamy, mild spice yogurt blend.',
    '00000000-0000-4000-8000-000000000301',
    290,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000404',
    'BEN-KOSHA',
    'Kosha Mangsho',
    'A thick, dark, slow-roasted spicy mutton gravy that is a Sunday institution.',
    '00000000-0000-4000-8000-000000000302',
    300,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000405',
    'BEN-BHETKI',
    'Bhetki Fish Fry',
    'Fresh Asian Seabass (Bhetki) fillet crumb-coated and deep-fried; served with sharp kasundi (mustard) sauce.',
    '00000000-0000-4000-8000-000000000302',
    170,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000406',
    'BEN-LUCHI',
    'Luchi',
    'Fluffy, deep-fried flatbreads regularly paired with cholar dal or alur dom.',
    '00000000-0000-4000-8000-000000000302',
    30,
    2,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000407',
    'BEN-RADHA',
    'Radhaballavi',
    'Fluffy, deep-fried stuffed flatbreads regularly paired with cholar dal or alur dom.',
    '00000000-0000-4000-8000-000000000302',
    40,
    2,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000408',
    'CHI-HAKKA-VEG',
    'Hakka Noodles (Veg)',
    'Wok-tossed noodles with soy sauce, garlic, green chilies, and vegetables.',
    '00000000-0000-4000-8000-000000000303',
    220,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000409',
    'CHI-HAKKA-CHK',
    'Hakka Noodles (Chicken)',
    'Wok-tossed noodles with soy sauce, garlic, green chilies, and shredded chicken.',
    '00000000-0000-4000-8000-000000000303',
    280,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000410',
    'CHI-CHILLI',
    'Chilli Chicken',
    'The quintessential sweet, spicy, and tangy dark-sauce gravy using boneless cubes.',
    '00000000-0000-4000-8000-000000000303',
    285,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000411',
    'CHI-MOMO-VEG',
    'Steamed Momos (Veg)',
    'Soft dough wrappers filled with seasoned vegetables.',
    '00000000-0000-4000-8000-000000000303',
    120,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000412',
    'CHI-MOMO-CHK',
    'Steamed Momos (Chicken)',
    'Soft dough wrappers filled with seasoned minced chicken.',
    '00000000-0000-4000-8000-000000000303',
    150,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000413',
    'CON-CHELO',
    'Chelo Kebab Platter',
    'Legendary Park Street staple: buttered rice topped with a fried egg, accompanied by chicken and mutton kebabs.',
    '00000000-0000-4000-8000-000000000304',
    575,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000414',
    'CON-SIZZLER',
    'Mixed Sizzler',
    'Sizzling hot platter stacked with proteins, vegetables, french fries, and a rich brown glaze sauce.',
    '00000000-0000-4000-8000-000000000304',
    500,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000415',
    'DES-PHIRNI',
    'Phirni (Firni)',
    'Creamy, chilled ground rice pudding flavored with saffron and served in small earthen pots (bhaanr).',
    '00000000-0000-4000-8000-000000000305',
    105,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000416',
    'DES-DOI',
    'Mishti Doi',
    'The globally famous, thick, sweetened fermented caramelised milk yogurt.',
    '00000000-0000-4000-8000-000000000305',
    70,
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000417',
    'DES-LIME',
    'Fresh Lime Soda',
    'The go-to fizzy refresher served sweet, salted, or mixed to beat the city''s humidity.',
    '00000000-0000-4000-8000-000000000305',
    80,
    1,
    TRUE
  )
ON CONFLICT (sku) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    category_id = EXCLUDED.category_id,
    price = EXCLUDED.price,
    min_qty = EXCLUDED.min_qty,
    is_active = TRUE;

INSERT INTO inventory (branch_id, product_id, available_qty, is_available)
SELECT
  '00000000-0000-4000-8000-000000000010',
  p.id,
  CASE
    WHEN p.sku LIKE 'DES-%' THEN 80
    WHEN p.sku LIKE 'BEN-LUCHI' OR p.sku LIKE 'BEN-RADHA' THEN 100
    WHEN p.sku LIKE 'CON-%' THEN 20
    ELSE 40
  END,
  TRUE
FROM products p
WHERE p.sku IN (
  'MUG-MUT-BIR', 'MUG-CH-CHAAP', 'MUG-RESHMI',
  'BEN-KOSHA', 'BEN-BHETKI', 'BEN-LUCHI', 'BEN-RADHA',
  'CHI-HAKKA-VEG', 'CHI-HAKKA-CHK', 'CHI-CHILLI', 'CHI-MOMO-VEG', 'CHI-MOMO-CHK',
  'CON-CHELO', 'CON-SIZZLER',
  'DES-PHIRNI', 'DES-DOI', 'DES-LIME'
)
ON CONFLICT (branch_id, product_id) DO UPDATE
SET available_qty = EXCLUDED.available_qty,
    is_available = TRUE;
