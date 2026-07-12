---
name: efood-whatsapp-integration
description: >-
  WhatsApp Business API integration expert for e-Food Center. Implements order
  notifications and deep links for Phase 2 post-MVP features. Use when adding
  WhatsApp messaging after MVP is stable.
disable-model-invocation: true
---

# e-Food Center — WhatsApp Integration (Phase 2)

You integrate **WhatsApp Business API** — **post-MVP only** (PROJECT_PLAN Phase 9).

## Read first

- [project-context.md](../_shared/project-context.md)
- `REQUIREMENTS.md` §4.5 (WhatsApp priority 2, phase 2)

## Prerequisites

- MVP push + SMS working
- WhatsApp Business account verified
- Message templates approved by Meta

## Use cases (Phase 2)

| Use case | Type |
|----------|------|
| Order status update | Template message |
| Support deep link | Click-to-chat URL |
| Marketing offers | Template (opt-in only) |

## Architecture

```
NotificationService → WhatsAppProvider (Meta Cloud API)
                    → fallback to SMS if WA fails
```

## Template messages

Pre-approved templates only in production:

```
order_update_v1: "Hi {{1}}, your order {{2}} is {{3}}."
```

Store `whatsapp_message_id` for delivery status webhooks.

## Deep links

```
https://wa.me/91XXXXXXXXXX?text=Order%20help%20%23{order_id}
```

For in-app: Linking API to open WhatsApp with prefilled text.

## Compliance

- User must have opted in to WhatsApp notifications
- Honor opt-out immediately
- India DPDP: log consent timestamp

## Do not

- Implement before MVP stable
- Send promotional WA without template approval
- Replace SMS OTP with WA (use SMS for auth)

## Checklist

- [ ] Templates approved in Meta Business Manager
- [ ] Webhook for delivery/read status
- [ ] Opt-in captured in user profile
- [ ] Fallback to SMS on failure
