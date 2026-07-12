# e-Food Center — Shared Project Context

All efood-* skills MUST read this plus `REQUIREMENTS.md` and `PROJECT_PLAN.md` at repo root.

## Product

| Field | Value |
|-------|-------|
| Name | e-Food Center |
| Type | B2C local food ordering & delivery |
| MVP vertical | Food (biryani, momos, etc.) |
| Future verticals | Retail, green veg, household (schema-ready, not MVP) |
| Business owner / UAT | Sarthak Ghosh |
| Tech lead / owner | Somnath Das |
| UX principle | **Simpler than Zomato** — few taps to order |
| Users | Less-educated local customers; staff, manager, admin roles |

## Locked stack (production)

| Layer | Choice |
|-------|--------|
| Mobile | React Native (Expo) — iOS + Android |
| Web admin + customer web | React + Tailwind CSS |
| Backend | Node.js (Express or NestJS) |
| Database | PostgreSQL |
| Cloud | Managed (AWS/Azure), India region |
| Auth | Phone OTP (MSG91), JWT + refresh, MFA for admin |
| Payments | Razorpay (UPI/card/wallet) + COD |
| Push | Firebase Cloud Messaging |
| Maps | Google Maps |

## Order lifecycle

```
Placed → Confirmed → In progress → Completed → Closed
              ↓
        Cancelled / Refunded
```

## Critical business rules

- **Min qty:** item-specific (e.g. biryani min 1, momos min 2)
- **Auto-confirm:** configurable window (default 6am–3pm); manager can override/cancel auto-approved
- **Edit order:** within 5 min of creation OR before delivery dispatch confirmation
- **Refund:** small deduction (₹1–₹2) per policy
- **COD:** track delivery person collections; day-end reconciliation
- **Multi-branch:** separate inventory per branch; branch selection by user
- **Guest:** browse as guest; login required at checkout (recommended)
- **Scale target:** design for growth toward 18k orders/day; India data residency (DPDP)

## Repo layout (target)

```
E-App/
├── apps/mobile/          # React Native Expo
├── apps/web/             # Customer web (optional parity)
├── apps/admin/           # React admin panel
├── packages/api/         # Node.js backend
├── packages/shared/      # Types, validators, constants
├── docs/                 # Architecture, API, runbooks
├── REQUIREMENTS.md
├── PROJECT_PLAN.md
└── .cursor/skills/
```

## Skill delegation map

| Domain | Skill |
|--------|-------|
| Orchestration | `efood-project-handler` |
| Architecture | `efood-platform-architect` |
| Backend | `efood-backend-engineer` |
| Mobile | `efood-mobile-engineer` |
| Web/Admin | `efood-web-admin-engineer` |
| Database | `efood-database-engineer` |
| DevOps | `efood-devops-engineer` |
| Git/PR | `efood-git-manager` |
| Payment | `efood-payment-gateway` |
| SMS/OTP | `efood-sms-otp` |
| Push | `efood-push-notifications` |
| Email | `efood-email-notifications` |
| WhatsApp | `efood-whatsapp-integration` |
| Maps | `efood-maps-delivery` |
| POS/Print | `efood-pos-printer` |
| Review | `efood-code-review` |
| Security | `efood-security-review` |
| QA | `efood-testing-qa` |
| UAT | `efood-uat-coordinator` |
| Requirements | `efood-requirements-analyst` |
| Performance | `efood-performance-load` |
| Release | `efood-release-deploy` |
| Docs | `efood-documentation` |
| UI/UX | `efood-uiux-design` |

## Quality gates (every merge)

1. `efood-code-review` — always
2. `efood-security-review` — auth, payment, admin, PII
3. `efood-testing-qa` — tests for new behavior
4. `efood-git-manager` — branch, commit, PR hygiene
