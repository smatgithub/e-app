-- Demo staff/manager for admin queue testing (OTP stub: 123456)

INSERT INTO users (id, name, phone, role, preferred_language)
VALUES (
  '00000000-0000-4000-8000-000000000002',
  'Branch Manager',
  '919999999999',
  'manager',
  'en'
)
ON CONFLICT (phone) DO UPDATE
SET role = 'manager', name = EXCLUDED.name;
