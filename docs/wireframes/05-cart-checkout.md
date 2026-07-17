### Screen: Cart / Checkout
- **Purpose:** Review cart, choose delivery/pickup, pay, place order  
- **Primary action:** Place order  
- **Components:** Cart line items, QtyStepper, coupon field, fulfillment toggle, address picker, payment method (UPI/COD), PriceRow summary, PrimaryButton  
- **States:** empty · invalid min-qty · need login · address required · placing · payment fail  
- **Navigation:** ← Home · → Login (if guest) · → Order confirmation  

```
CART
┌─────────────────────────────┐
│ Cart                        │
│                             │
│ Chicken Biryani     (−)1(+) │
│ ₹180                        │
│ Veg Momos           (−)2(+) │
│ ₹180   ⚠ min qty 2 OK       │
│                             │
│ Coupon                      │
│ ┌────────────┐ [Apply]      │
│ │ SAVE20     │              │
│ └────────────┘              │
│                             │
│ Subtotal            ₹360    │
│ Discount            −₹20    │
│ Delivery             ₹30    │
│ ─────────────────────────── │
│ Total               ₹370    │
│                             │
│ ┌─────────────────────────┐ │
│ │   Proceed to checkout   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘

CHECKOUT
┌─────────────────────────────┐
│ Checkout                    │
│                             │
│ Fulfillment                 │
│ (•) Delivery  ( ) Pickup    │
│                             │
│ Deliver to                  │
│ ┌─────────────────────────┐ │
│ │ Home · Near market gate │ │
│ │ Change address          │ │
│ └─────────────────────────┘ │
│                             │
│ Pay with                    │
│ (•) UPI / Online            │
│ ( ) Cash on delivery (COD)  │
│                             │
│ Total ₹370                  │
│ ┌─────────────────────────┐ │
│ │     Place order         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Linked:** FR-ORD-01/03/04/05, FR-PAY-01/02, FR-MKT-01  
**Guest:** Tapping Place order opens OTP login, then returns here.
