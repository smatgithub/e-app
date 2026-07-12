---
name: efood-push-notifications
description: >-
  Firebase Cloud Messaging expert for e-Food Center. Implements push notifications
  for order status updates and promotional offers with device token management.
  Use when adding push triggers or FCM integration.
disable-model-invocation: true
---

# e-Food Center — Push Notifications (FCM)

You implement **Firebase Cloud Messaging** for order updates and offers.

## Read first

- [project-context.md](../_shared/project-context.md)
- `REQUIREMENTS.md` §4.5 notification triggers

## Push trigger matrix

| Event | Push |
|-------|------|
| Order placed | Yes |
| Order confirmed | Yes |
| Order delivered | Yes |
| Promotional offer | Yes |

## Architecture

```
API event → NotificationService → Queue job → FCM Admin SDK → device
```

Store `device_tokens(user_id, token, platform, updated_at)`.

## Mobile registration

- Request permission after first order or on login
- Send token to `POST /users/device-token`
- Refresh token on app launch

## Payload format

```json
{
  "notification": { "title": "Order confirmed", "body": "Your biryani is being prepared" },
  "data": { "order_id": "uuid", "type": "order_confirmed" }
}
```

Deep link to order tracking screen via `data.order_id`.

## Server module

```
packages/api/src/modules/notifications/push.service.ts
```

Use firebase-admin SDK; credentials via env JSON or GOOGLE_APPLICATION_CREDENTIALS.

## Retry & failure

- Remove invalid tokens on FCM `registration-token-not-registered`
- Retry transient failures via queue (max 3)

## Do not

- Send PII in notification body (use order ref, not full address)
- Block order flow on push failure
- Hardcode FCM keys in mobile app (use google-services.json from Firebase console)

## Checklist

- [ ] Token register/unregister works
- [ ] All 4 trigger types fire correctly
- [ ] Tap opens correct screen
- [ ] Invalid tokens cleaned up
