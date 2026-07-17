# e-Food Center — Monorepo Guide

> **Locked stack (Lean):** Expo Android · React admin · Express API · Postgres in Docker · Azure VM  
> **Contracts:** `docs/openapi.yaml` · `docs/erd.md` · `docs/wireframes/` · `docs/config/`

---

## Layout

```
E-App/
├── apps/
│   ├── mobile/          # @efood/mobile — React Native (Expo)
│   └── admin/           # @efood/admin — React + Vite
├── packages/
│   ├── api/             # @efood/api — Node.js Express /api/v1
│   └── shared/          # @efood/shared — shared TypeScript types
├── docs/
│   ├── openapi.yaml
│   ├── architecture.md
│   ├── erd.md
│   └── wireframes/
├── package.json         # npm workspaces root
├── REQUIREMENTS.md
└── PROJECT_PLAN.md
```

---

## Prerequisites

- Node.js **≥ 20**
- npm **≥ 10**
- Expo Go app on phone (for mobile)
- Docker Desktop (required for v0 Compose)

---

## One-time setup

```bash
cd /Users/som_home/E-App
cp .env.example .env
npm install
npm run build:shared
```

---

## Run v0 (recommended)

```bash
npm run docker:up
curl -s http://localhost:4000/api/v1/health
curl -s http://localhost:4000/api/v1/products
```

## Run apps against local API

```bash
# Terminal 2 — Admin (http://localhost:5173)
npm run dev:admin

# Terminal 3 — Mobile (Expo / Android)
npm run dev:mobile
```

Platform configuration (Azure, Play, FCM, MSG91, Stage C, …): **`docs/config/README.md`**

---

## Implementation order (Phase 2+)

| Step | Work | Package | Contract |
|------|------|---------|----------|
| 1 | Postgres + migrations from ERD | `packages/api` | `docs/erd.md` |
| 2 | Real OTP + JWT | `packages/api` auth | OpenAPI `/auth/*` |
| 3 | Catalog from DB | `packages/api` catalog | OpenAPI `/products` |
| 4 | Mobile Home / Product screens | `apps/mobile` | Wireframes 03–04 |
| 5 | Admin order queue | `apps/admin` | Wireframe 08a |
| 6 | Cart → Order → Razorpay | api + mobile | OpenAPI orders/payments |

**Rule:** Do not invent endpoints — extend `docs/openapi.yaml` first, then implement.

---

## Workspace commands

| Command | What it does |
|---------|----------------|
| `npm run dev:api` | API with hot reload |
| `npm run dev:admin` | Admin Vite dev server |
| `npm run dev:mobile` | Expo start |
| `npm run build:shared` | Compile shared types |
| `npm run typecheck` | Typecheck all workspaces |

---

## Decision lock reference

See `PROJECT_PLAN.md` §4 (D1–D18 locked 2026-07-17).
