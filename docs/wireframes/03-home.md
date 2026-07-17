### Screen: Home
- **Purpose:** Browse food catalog quickly; pick branch if multi-branch  
- **Primary action:** Open a product (or Search)  
- **Components:** Branch selector, Search, CategoryChip row, Banner (optional), ProductTile list, BottomTabBar  
- **States:** loading · empty catalog · offline error · success  
- **Navigation:** → Product detail · → Cart · → Orders · → Profile  

```
┌─────────────────────────────┐
│ e-Food Center    📍 Main Br │
│ ┌─────────────────────────┐ │
│ │ 🔍 Search biryani, momos│ │
│ └─────────────────────────┘ │
│ [All][Biryani][Momos][More] │
│                             │
│ ┌─────┐  Chicken Biryani    │
│ │ IMG │  ₹180 · Min 1       │
│ └─────┘  ● Available        │
│                             │
│ ┌─────┐  Veg Momos          │
│ │ IMG │  ₹90 · Min 2        │
│ └─────┘  ● Available        │
│                             │
│ ┌─────┐  Egg Roll           │
│ │ IMG │  ₹60 · Min 1        │
│ └─────┘  ○ Sold out         │
├─────────────────────────────┤
│ 🏠 Home  🧾 Orders  🛒(2)  👤│
└─────────────────────────────┘
```

**Linked:** FR-CAT-01, FR-CAT-02, FR-CAT-03 (search P1), FR-CAT-06  
**UX:** Large tiles, price always visible, sold-out not tappable (or shows “Unavailable”).
