### Screen: Product detail
- **Purpose:** Confirm item, qty (with min), and add to cart  
- **Primary action:** Add to cart  
- **Components:** Image, name, price, description, QtyStepper, stock badge, PrimaryButton  
- **States:** loading · available · out of stock · add success (toast + cart badge)  
- **Navigation:** ← Home · → Cart  

```
┌─────────────────────────────┐
│ ← Back              🛒 (2)  │
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │      PRODUCT IMAGE      │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ Chicken Biryani             │
│ ₹180                        │
│ ● In stock at Main Branch   │
│                             │
│ Fragrant rice with chicken. │
│ Serves 1.                   │
│                             │
│ Quantity (min 1)            │
│     (−)   1   (+)           │
│                             │
│ ┌─────────────────────────┐ │
│ │   Add to cart · ₹180    │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Linked:** FR-CAT-04, FR-CAT-06, FR-ORD-01  
**Rule:** Qty stepper cannot go below `min_qty`; show inline error if user tries.
