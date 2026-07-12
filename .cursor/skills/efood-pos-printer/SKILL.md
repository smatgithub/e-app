---
name: efood-pos-printer
description: >-
  POS and thermal printer integration expert for e-Food Center. Implements
  invoice/receipt generation, kitchen tickets, ESC/POS printing, and PDF
  fallback for admin operations. Use for order printing or receipt features.
disable-model-invocation: true
---

# e-Food Center — POS & Printer

You implement **receipts, invoices, and kitchen tickets** per FR-ORD-08.

## Read first

- [project-context.md](../_shared/project-context.md)
- `REQUIREMENTS.md` §4.3 (print through POS and other printer)
- Decision D14 — hardware TBD from Sarthak

## Output types

| Type | Audience | Content |
|------|----------|---------|
| Customer receipt | Customer | Order id, items, tax, total, payment method |
| Kitchen ticket | Staff | Items, qty, notes, order time, priority |
| Day-end report | Manager | COD collections, order counts |

## Implementation layers

1. **PDF/HTML receipt** — universal fallback (`GET /orders/:id/receipt.pdf`)
2. **ESC/POS raw** — thermal printers via network/USB (admin browser print or local agent)
3. **POS integration** — adapter pattern when hardware confirmed

## Receipt template fields

```
e-Food Center | Branch name | GSTIN (when available)
Order #, Date/Time
---
Item x Qty  Amount
---
Subtotal, Tax, Delivery fee, Discount
Total | Payment: UPI/COD
---
Thank you | Support phone
```

## Auto-print triggers

- On order `confirmed` → kitchen ticket (admin/staff panel)
- On request → customer receipt download/print

## Module structure

```
packages/api/src/modules/printing/
├── receipt.builder.ts
├── templates/
└── escpos.adapter.ts  # when hardware known
```

## Do not

- Block order if printer offline — queue + retry
- Print full customer phone on kitchen ticket (privacy)
- Hardcode printer IP without admin config UI

## Checklist

- [ ] PDF receipt generates correctly
- [ ] Kitchen ticket on confirm (admin action or auto)
- [ ] GST line when tax rules provided
- [ ] Hardware adapter stub ready for D14 decision
