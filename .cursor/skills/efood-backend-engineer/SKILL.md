---
name: efood-backend-engineer
description: >-
  Node.js backend engineer for e-Food Center. Builds REST APIs for auth,
  catalog, cart, orders, coupons, RBAC, and admin operations with business
  rules from REQUIREMENTS.md. Use for any server-side feature or order lifecycle work.
disable-model-invocation: true
---

# e-Food Center — Backend Engineer

You build the **Node.js API** — the system of record for e-Food Center.

## Read first

- [project-context.md](../_shared/project-context.md)
- `docs/openapi.yaml`
- `REQUIREMENTS.md` §4, §7

## Project structure

```
packages/api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── payments/      → delegate to efood-payment-gateway
│   │   ├── notifications/ → delegate to push/sms/email skills
│   │   └── admin/
│   ├── middleware/        # auth, rbac, audit, error
│   ├── jobs/              # queue workers
│   └── utils/
├── tests/
└── migrations/
```

## API response format

```json
{ "success": true, "data": {}, "error": null, "meta": { "page": 1 } }
```

## Auth & RBAC

| Role | Key permissions |
|------|-----------------|
| customer | browse, order |
| staff | view orders, update status |
| manager | approve/reject, products, reports |
| admin | users, platform config |

- Phone OTP via `efood-sms-otp`
- JWT access (15m) + refresh (7d)
- MFA for admin routes

## Order engine rules

1. **Min qty** — validate per product (`min_qty` field)
2. **Auto-confirm** — if enabled + within window + before prep started → auto `confirmed`
3. **Manager override** — manual approve/cancel even if auto-confirmed
4. **Edit window** — 5 min from `created_at` OR before `in_progress`
5. **Cancel** — capture reason enum + optional text; refund per policy
6. **Idempotency** — `Idempotency-Key` header on POST `/orders`

## Coupon rules (FR-MKT-01)

- Example: qty > 3 → flat ₹20 off
- Validate at checkout; store applied coupon on order

## Delegation

| Touching | Invoke skill |
|----------|--------------|
| Razorpay | `efood-payment-gateway` |
| OTP/SMS | `efood-sms-otp` |
| FCM | `efood-push-notifications` |
| Email | `efood-email-notifications` |
| Maps/zones | `efood-maps-delivery` |
| Receipt print | `efood-pos-printer` |

## Error handling

- Validation → 400 with field errors
- Auth → 401; RBAC → 403
- Not found → 404
- Conflict (stock) → 409 with substitute offer flag
- Never leak stack traces in production

## Tests required

- Unit: business rules (min qty, auto-confirm window)
- Integration: order lifecycle happy path + cancel + payment fail hold 15min

## Do not

- Implement payment logic inline — use payment skill module
- Skip audit log on price/product/order changes
- Hardcode branch — always filter by `branch_id`

## Exit checklist

- [ ] Matches OpenAPI spec
- [ ] RBAC enforced on admin routes
- [ ] Order state machine tested
- [ ] `efood-code-review` + `efood-security-review` if auth touched
