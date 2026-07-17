### Screen: Order history & tracking
- **Purpose:** See past/current orders; track status; reorder  
- **Primary action:** Open order detail / Track  
- **Components:** Order list cards, StatusBadge, OrderTimeline, Reorder button, Cancel (if allowed)  
- **States:** empty · loading · list · detail · cancelled  
- **Navigation:** from Tab Orders · → Home (reorder) · → Support/complaint (simple form)  

```
LIST
┌─────────────────────────────┐
│ My orders                   │
│                             │
│ ┌─────────────────────────┐ │
│ │ #EF-1042  Today 1:12pm  │ │
│ │ In progress · ₹370      │ │
│ │ Chicken Biryani +1      │ │
│ │ [ Track ]               │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ #EF-1038  Yesterday     │ │
│ │ Delivered · ₹180        │ │
│ │ [ Reorder ]             │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ 🏠     🧾     🛒     👤     │
└─────────────────────────────┘

DETAIL / TRACK
┌─────────────────────────────┐
│ ← Order #EF-1042            │
│                             │
│ ● Placed        1:12        │
│ ● Confirmed     1:13        │
│ ● In progress   1:20  ←now  │
│ ○ Completed                 │
│                             │
│ Delivery · Main Branch      │
│ ETA ~ 35 min                │
│                             │
│ Items …                     │
│ Total ₹370 · Paid UPI       │
│                             │
│ [ Cancel order ]  (if <5m)  │
│ [ Help / complaint ]        │
└─────────────────────────────┘
```

**Linked:** FR-ORD-06/07, FR-NOT-01  
**Status colors:** Pending=amber, Confirmed/In progress=brand, Delivered=green, Cancelled=red.
