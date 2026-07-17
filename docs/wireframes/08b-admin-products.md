### Screen: Admin — Products
- **Purpose:** Create/edit menu items, price, min qty, stock per branch, images  
- **Primary action:** Save product  
- **Components:** Product table, form (name, sku, category, price, min_qty, image), availability toggle  
- **States:** list · create · edit · validation error  
- **Navigation:** from sidebar Products  

```
┌──────────┬──────────────────────────────────────────────┐
│ Products │ [+ Add product]     Category ▼   Search      │
│          ├──────────────────────────────────────────────┤
│          │ Name            Price  Min  Stock  Active    │
│          │ Chicken Biryani ₹180   1    40     ●         │
│          │ Veg Momos       ₹90    2    12     ●         │
│          │ Egg Roll        ₹60    1     0     ○         │
│          │                                              │
│ FORM (Add / Edit)                                       │
│ Name* [________________]  SKU* [________]               │
│ Category* [Biryani ▼]   Price* [180]  Min qty* [1]      │
│ Branch stock: Main [40]                                 │
│ Image [Upload]                                          │
│ Description [________________________]                  │
│ [ ] Available                                           │
│              [Cancel]  [Save product]                   │
└──────────┴──────────────────────────────────────────────┘
```

**Linked:** FR-ADM-02, FR-CAT-*  
**Audit:** Price changes written to AuditLog.
