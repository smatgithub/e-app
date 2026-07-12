---
name: efood-email-notifications
description: >-
  Transactional email expert for e-Food Center using Amazon SES or Resend.
  Implements order confirmation and delivery emails with per-user opt-in/out.
  Use for email templates, sending logic, or SPF/DKIM setup guidance.
disable-model-invocation: true
---

# e-Food Center — Email Notifications

You implement **transactional email** with user preference controls.

## Read first

- [project-context.md](../_shared/project-context.md)
- `REQUIREMENTS.md` §4.5

## Email trigger matrix

| Event | Email |
|-------|-----|
| Order placed | No |
| Order confirmed | **Yes** |
| Order delivered | **Yes** |
| Promotional | No (user opt-in required if added later) |

## User preferences

`users.email_notifications_enabled` (default true for transactional; marketing separate opt-in per DPDP).

## Provider

Prefer **Amazon SES** (cost) or **Resend** (simplicity). Staging: sandbox with verified emails only.

## Template structure

```
templates/email/
├── order-confirmed.html
├── order-delivered.html
└── layout.html
```

Include: order id, items summary, total, support phone, unsubscribe/preferences link.

## Sending flow

```
Order status change → EmailJob queued → render template → SES/Resend API
```

Idempotent: one email per (order_id, event_type).

## Domain setup

- SPF, DKIM, DMARC on sending domain
- From: `orders@efoodcenter.com` (example — use actual domain)

## Env vars

```
EMAIL_PROVIDER, EMAIL_FROM, AWS_REGION / RESEND_API_KEY
```

## Do not

- Send marketing without explicit consent
- Include full payment card details
- Block order on email failure

## Checklist

- [ ] Confirmed + delivered emails render correctly
- [ ] User can disable email in profile (P2)
- [ ] Bounce handling logs suppressed addresses
