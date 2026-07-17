# 10 — Razorpay (Stage B — not launch)

## Purpose
Online UPI/card when stakeholder asks. **No monthly fee** — % per success only.  
**Launch = COD only** (approved).

## When to start
Business requests UPI → then:

1. Create Razorpay account + KYC.  
2. Enable Test mode keys for Staging.  
3. Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, webhook secret.  
4. Webhook URL: `https://api.yourdomain/api/v1/payments/razorpay/webhook`  
5. Implement per `docs/openapi.yaml` — keep COD path unchanged.

## Checklist before go-live with UPI
- [ ] Test payment + webhook signature verified  
- [ ] Refund path understood  
- [ ] COD still available
