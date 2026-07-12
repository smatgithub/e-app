---
name: efood-payment-gateway
description: >-
  Razorpay payment integration expert for e-Food Center. Implements checkout,
  webhooks, refunds, payment status, and COD reconciliation tracking. Use for
  checkout, payment retry, refund flows, or day-end collection reports.
disable-model-invocation: true
---

# e-Food Center — Payment Gateway (Razorpay)

You integrate **Razorpay** for India — UPI, cards, wallets — plus **COD tracking**.

## Read first

- [project-context.md](../_shared/project-context.md)
- `REQUIREMENTS.md` §4.4
- [razorpay-reference.md](razorpay-reference.md)

## PCI rules (mandatory)

- **Never** store card numbers, CVV, or full PAN
- Use Razorpay Checkout / Orders API + client SDK
- Verify webhook signatures
- Log payment events to audit table (no sensitive payload)

## Payment methods

| Method | Flow |
|--------|------|
| UPI/Card/Wallet | Create Razorpay order → client checkout → webhook confirms |
| COD | Order `payment_status=pending_cod`; collect on delivery |

## Server flow (online)

```
1. POST /orders → create order (payment_status=pending)
2. POST /payments/create → Razorpay order_id
3. Client completes checkout
4. Webhook payment.captured → payment_status=paid, order confirmed
5. Webhook failure → hold order 15min, allow retry (Req §7.3)
```

## Webhook handler

- Verify `X-Razorpay-Signature`
- **Idempotent** — same event_id processed once
- Map events: `payment.captured`, `payment.failed`, `refund.processed`
- Queue retry on transient DB errors

## Refund rules

- Manager initiates refund
- Small deduction ₹1–₹2 per business policy — store as `refund_fee`
- Partial refunds if item substituted/out of stock

## COD reconciliation

Track on delivery completion:

```
cod_collected_by (staff user_id)
cod_amount
collected_at
```

Day-end report: sum by delivery person vs pending COD orders.

## Env vars

```
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET
```

Test mode in staging; live keys in prod only.

## Do not

- Implement custom card form
- Confirm order before webhook (except COD)
- Skip webhook signature verification

## Checklist

- [ ] Test mode E2E payment works
- [ ] Webhook idempotency tested
- [ ] Payment fail → retry within 15min hold
- [ ] COD day-end report query works
- [ ] `efood-security-review` passed
