### Screen: Admin dashboard
- **Purpose:** At-a-glance ops for manager/admin — today’s orders, revenue, pending approvals  
- **Primary action:** Open pending orders  
- **Components:** KPI cards, pending queue preview, nav sidebar, branch filter  
- **States:** loading · empty day · alerts (payment failed / low stock)  
- **Navigation:** → Order queue · Products · Staff · Reports · Users (admin)  

```
┌──────────┬──────────────────────────────────────────────┐
│ e-Food   │  Dashboard          Branch: Main ▼   🔔  👤  │
│ Admin    ├──────────────────────────────────────────────┤
│          │  Today                                   17 Jul│
│ Dashboard│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │
│ Orders   │  │ Orders │ │ Revenue│ │ Pending│ │ COD due│ │
│ Products │  │  42    │ │ ₹18.2k │ │   3    │ │ ₹2.4k  │ │
│ Staff    │  └────────┘ └────────┘ └────────┘ └────────┘ │
│ Reports  │                                              │
│ Banners  │  Needs action                                │
│ Users*   │  ┌────────────────────────────────────────┐  │
│          │  │ #EF-1045  ₹420  Delivery  2m ago [Open]│  │
│ *admin   │  │ #EF-1044  ₹180  Pickup    5m ago [Open]│  │
│          │  └────────────────────────────────────────┘  │
│          │                                              │
│          │  Sales (today)  ██████████░░  vs yesterday   │
└──────────┴──────────────────────────────────────────────┘
```

**Linked:** FR-ADM-01, FR-ADM-05  
**Access:** Manager sees branch-scoped KPIs; Admin sees all branches + Users.
