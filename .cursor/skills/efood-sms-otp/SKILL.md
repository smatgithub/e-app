---
name: efood-sms-otp
description: >-
  SMS and OTP integration expert for e-Food Center using MSG91 and India DLT
  compliance. Implements phone login OTP and transactional SMS per notification
  matrix. Use for auth OTP or SMS alert features.
disable-model-invocation: true
---

# e-Food Center — SMS & OTP (MSG91)

You implement **phone OTP auth** and **transactional SMS** for India (DLT-compliant).

## Read first

- [project-context.md](../_shared/project-context.md)
- `REQUIREMENTS.md` §4.1, §4.5 notification matrix

## Notification matrix (SMS)

| Event | SMS |
|-------|-----|
| Order placed | No |
| Order confirmed | No (push) — SMS optional P1 |
| Order delivered | **Yes** |
| Promotional | No (push only) |

OTP login is always SMS.

## OTP flow

```
1. POST /auth/otp/send { phone }
   - Rate limit: 3/hour per phone, 10/hour per IP
   - Generate 6-digit OTP, hash store (Redis, TTL 5min)
   - Send via MSG91 DLT template

2. POST /auth/otp/verify { phone, otp }
   - Max 5 attempts → lock 15min
   - Issue JWT access + refresh on success
```

## MSG91 integration

- Use approved DLT template IDs (store in env)
- Sender ID registered
- Log message_id; never log OTP plaintext in prod logs

## Env vars

```
MSG91_AUTH_KEY, MSG91_OTP_TEMPLATE_ID, MSG91_DELIVERED_TEMPLATE_ID
```

## Security

- OTP hashed (bcrypt or HMAC-SHA256 with pepper)
- Constant-time compare
- No OTP in API response (except dev mock mode)

## Dev/staging mock

When `SMS_PROVIDER=mock`: OTP fixed `123456` for test phones only.

## Do not

- Send SMS without DLT template in production
- Log full OTP
- Skip rate limiting (abuse vector)

## Checklist

- [ ] OTP send/verify E2E
- [ ] Rate limits enforced
- [ ] Delivered SMS on order completion
- [ ] Mock mode for local dev documented
