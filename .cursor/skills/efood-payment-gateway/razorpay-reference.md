# Razorpay — e-Food Center Reference

## Docs

- Orders API: https://razorpay.com/docs/api/orders/
- Payments: https://razorpay.com/docs/api/payments/
- Webhooks: https://razorpay.com/docs/webhooks/
- Refunds: https://razorpay.com/docs/api/refunds/

## Create order (server)

```javascript
const order = await razorpay.orders.create({
  amount: amountPaise, // INR * 100
  currency: 'INR',
  receipt: `order_${internalOrderId}`,
  notes: { order_id: internalOrderId }
});
```

## Webhook signature

```javascript
const expected = crypto
  .createHmac('sha256', webhookSecret)
  .update(rawBody)
  .digest('hex');
```

## Test cards (staging)

Use Razorpay test mode dashboard keys only.

## Status mapping

| Razorpay | Internal |
|----------|----------|
| created | pending |
| captured | paid |
| failed | failed |
| refunded | refunded |
