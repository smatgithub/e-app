### Screen: Admin — Order queue
- **Purpose:** Confirm/reject, progress orders, assign delivery, capture COD  
- **Primary action:** Approve / Update status  
- **Components:** Filters (status, fulfillment), order table/cards, detail drawer, action buttons  
- **States:** pending · auto-confirmed · in progress · completed · failed payment  
- **Navigation:** from Dashboard · → print invoice (POS)  

```
┌──────────┬──────────────────────────────────────────────┐
│ Orders   │ Filters: [Pending][All]  Delivery|Pickup  🔍 │
│          ├──────────────────────────────────────────────┤
│          │ #       Time   Customer   Total  Type  Status│
│          │ EF-1045 1:22  Raju       ₹420  Del   Pending │
│          │         [Approve] [Reject] [Details]         │
│          │ EF-1042 1:12  Meena      ₹370  Del   In prog │
│          │         [Assign rider] [Complete] [COD ₹]    │
│          │                                              │
│ DETAIL DRAWER (right)                                   │
│ Order #EF-1045                                          │
│ Items: Biryani x2, Momos x2                             │
│ Address: …                                              │
│ Pay: COD                                                │
│ Auto-confirm window: OFF (outside hours)                │
│ Notes / cancel reason                                   │
│ [Approve] [Reject] [Print invoice]                      │
└──────────┴──────────────────────────────────────────────┘
```

**Linked:** FR-ADM-03, FR-ADM-07, FR-ORD-08, FR-PAY-02  
**RBAC:** Staff can update progress; Manager approve/reject; Admin all.
