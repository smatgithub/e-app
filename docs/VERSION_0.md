# e-Food Center — Version 0.0.x (closed)

> **Closed:** 2026-07-17
> **Mode:** Lean Launch (Stage A) foundation
> **Approvals:** COD-only · ₹2–4k/mo · Android-first · defer Maps/Redis/managed DB/CDN

## Goal (met)

End-to-end lean path on laptop:

- Docker API + PostgreSQL
- OTP stub + JWT
- Cart + COD order APIs
- Admin order queue + product CRUD UI
- Mobile browse + checkout smoke UI
- Kolkata menu seed
- One-off device APK smoke (cleartext LAN)

## Checklist

- [x] Compose + Dockerfile
- [x] Schema + seed (incl. Kolkata menu)
- [x] Catalog APIs
- [x] OTP stub + JWT
- [x] Cart / COD orders / admin status API
- [x] Admin order queue + products UI
- [x] Mobile Home + cart + OTP checkout
- [x] APK smoke (R0) — **no further APKs until Release track**

## Next

→ **[VERSION_0.1.md](./VERSION_0.1.md)** · Full backlog: **[FEATURES.md](./FEATURES.md)**

## How to run

```bash
npm run docker:up
VITE_API_BASE=http://localhost:4000/api/v1 npm run dev:admin
EXPO_PUBLIC_API_BASE=http://localhost:4000/api/v1 npm run dev:mobile
```
