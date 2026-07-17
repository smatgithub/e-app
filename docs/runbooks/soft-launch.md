# Soft launch runbook — e-Food Center v1.0 (COD lean)

> **Mode:** Soft launch candidate (local / staging-ready)  
> **Payments:** COD only  
> **OTP:** Stub (`123456`) until MSG91 keys + DLT approved  
> **APK:** Build only on Release track request  

## Pre-flight checklist

- [ ] `npm run docker:up` (or local API + Postgres) healthy: `GET /api/v1/health`
- [ ] Migrations through `007_soft_launch.sql` applied
- [ ] Admin login: `919999999999` / OTP `123456`
- [ ] Mobile: browse → detail → cart → COD → orders
- [ ] Coupon `WELCOME20` (3+ items) works
- [ ] Admin Dashboard + Ops COD day report readable
- [ ] Support contacts set in Privacy/Terms screens

## Soft-launch config (env)

```bash
APP_VERSION=1.0.0
OTP_STUB=true                 # false only with MSG91_AUTH_KEY + MSG91_TEMPLATE_ID
AUTO_CONFIRM_START_HOUR=6
AUTO_CONFIRM_END_HOUR=15
OTP_MAX_PER_WINDOW=5
OTP_WINDOW_MINUTES=15
FCM_ENABLED=false             # true when FCM credentials ready
CORS_ORIGIN=*                 # tighten to admin+app origins in prod
```

## Azure lean staging (when ready)

Follow `docs/adr/003-lean-launch-azure-vm.md` + `docs/config/03-azure-vm.md`:

1. Provision 1× B-series VM (India)  
2. Install Docker + compose  
3. Copy repo, set `.env` secrets (rotate JWT secrets)  
4. `docker compose up -d`  
5. Point domain / HTTPS (Cloudflare or nginx)  
6. Nightly: `pg_dump` cron → blob or disk  

**Do not** enable Razorpay, Maps, Redis, or managed Postgres until cost approved.

## UAT (Sarthak)

Use `docs/uat/SOFT_LAUNCH_UAT.md`.

## Rollback

```bash
docker compose down
# restore last pg_dump
docker compose up -d
```

## Explicitly out of soft launch

Razorpay · Google Maps · iOS · Redis · CDN · live MSG91 (until keys) · Play Store public listing
