-- Soft-launch tables: coupons, banners, device tokens, notification log, OTP rate limit

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'flat'
    CHECK (discount_type IN ('flat')),
  discount_value NUMERIC(12, 2) NOT NULL CHECK (discount_value > 0),
  min_items INT NOT NULL DEFAULT 0,
  min_subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'android',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, token)
);

CREATE TABLE IF NOT EXISTS notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  channel TEXT NOT NULL CHECK (channel IN ('push', 'sms', 'in_app')),
  title TEXT NOT NULL,
  body TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otp_request_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_request_log_phone_time
  ON otp_request_log (phone, requested_at DESC);

INSERT INTO coupons (id, code, description, discount_type, discount_value, min_items, min_subtotal, is_active)
VALUES (
  '00000000-0000-4000-8000-000000000501',
  'WELCOME20',
  'Flat ₹20 off when cart has 3+ items',
  'flat',
  20,
  3,
  0,
  TRUE
)
ON CONFLICT (code) DO NOTHING;

INSERT INTO banners (id, title, body, sort_order, is_active) VALUES
  (
    '00000000-0000-4000-8000-000000000601',
    'Welcome to e-Food Center',
    'Order Kolkata favourites · Cash on Delivery · Fast kitchen confirm',
    1,
    TRUE
  ),
  (
    '00000000-0000-4000-8000-000000000602',
    'Try WELCOME20',
    'Add 3+ items and apply WELCOME20 for ₹20 off at checkout.',
    2,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;
