### Screen: Profile
- **Purpose:** View/edit name, phone (read-only after verify), addresses, language, logout  
- **Primary action:** Save profile / Manage addresses  
- **Components:** Form fields, address list, language toggle placeholder, Logout  
- **States:** guest prompt to login · editing · saved · error  
- **Navigation:** Tab Profile · → Login · → Address form  

```
┌─────────────────────────────┐
│ Profile                     │
│                             │
│ Name                        │
│ ┌─────────────────────────┐ │
│ │ Somnath Das             │ │
│ └─────────────────────────┘ │
│ Phone (verified)            │
│ +91 98XXX XX321     🔒      │
│                             │
│ Language                    │
│ (•) English  ( ) বাংলা TBD  │
│                             │
│ Saved addresses             │
│ • Home · Near market gate   │
│ + Add address               │
│                             │
│ ┌─────────────────────────┐ │
│ │       Save              │ │
│ └─────────────────────────┘ │
│                             │
│         Log out             │
├─────────────────────────────┤
│ 🏠     🧾     🛒     👤     │
└─────────────────────────────┘

GUEST STATE
┌─────────────────────────────┐
│ Profile                     │
│                             │
│ You are browsing as guest.  │
│ Login to see orders and     │
│ save addresses.             │
│                             │
│ ┌─────────────────────────┐ │
│ │     Login with OTP      │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Linked:** FR-AUTH-05  
**Do not:** Force full registration form beyond name after first OTP.
