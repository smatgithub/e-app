# e-Food Center — Version 0.0.1 (v0)

> **Started:** 2026-07-17  
> **Mode:** Lean Launch (Stage A)  
> **Approvals:** COD-only · ₹2–4k/mo · Android-first · defer Maps/Redis/managed DB/CDN

## Goal of v0

Runnable foundation:

- Docker Compose: API + PostgreSQL  
- DB migrations + seed menu  
- Health + catalog from real DB  
- Config guides for all platforms  

## In scope (v0)

- [x] Compose + Dockerfile  
- [x] Schema + seed  
- [x] `/health`, `/branches`, `/categories`, `/products`  
- [ ] Cart / orders / COD (next)  
- [ ] OTP stub → MSG91  
- [ ] Admin list from API  
- [ ] Mobile home from API  

## How to run v0

```bash
cp .env.example .env
npm install
npm run build:shared
npm run docker:up
curl -s http://localhost:4000/api/v1/health
curl -s http://localhost:4000/api/v1/products
```

Config guides: `docs/config/README.md`
