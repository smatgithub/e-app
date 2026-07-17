# Platform configuration guides

> **Purpose:** Step-by-step setup for every platform used in Lean Launch (Stage A) and Ultimate hosting (Stage C).  
> **Approvals locked:** Stage A ₹2–4k/mo · COD-only · defer Maps/Redis/managed DB/CDN · Android-first  
> **Version:** 0.1 · 2026-07-17

---

## How to use

1. Do **Stage A (now)** guides in order below.  
2. Keep **Stage C** guides as reference — configure only when you graduate from one VM.  
3. Never put secrets in git. Use `.env` / Azure Key Vault (Stage C).

---

## Stage A — configure now (Lean Launch)

| Order | Platform | Guide | Required for v0 |
|------:|----------|-------|-----------------|
| 1 | Docker + Compose | [01-docker.md](./01-docker.md) | ✅ |
| 2 | PostgreSQL (on VM/Compose) | [02-postgresql.md](./02-postgresql.md) | ✅ |
| 3 | Azure VM + networking | [03-azure-vm.md](./03-azure-vm.md) | Prod host |
| 4 | Domain + HTTPS (Caddy) | [04-domain-https.md](./04-domain-https.md) | Prod URL |
| 5 | Azure Static Web Apps (admin) | [05-static-web-apps.md](./05-static-web-apps.md) | Admin UI |
| 6 | GitHub + deploy basics | [06-github.md](./06-github.md) | Source + CI later |
| 7 | Firebase (FCM) | [07-firebase-fcm.md](./07-firebase-fcm.md) | Push (after orders) |
| 8 | Expo + Google Play (Android) | [08-expo-google-play.md](./08-expo-google-play.md) | Store release |
| 9 | MSG91 OTP | [09-msg91.md](./09-msg91.md) | Public OTP login |
| 10 | Razorpay (not at launch) | [10-razorpay.md](./10-razorpay.md) | When UPI requested |

**Deferred (do not configure for launch):** Google Maps · Azure Redis · Flexible Server · ACR · Front Door/CDN · Apple Developer

---

## Stage C — ultimate hosting (later)

| Platform | Guide |
|----------|-------|
| Azure Container Apps + ACR | [11-azure-container-apps.md](./11-azure-container-apps.md) |
| Azure Database for PostgreSQL Flexible | [12-azure-postgres-flexible.md](./12-azure-postgres-flexible.md) |
| Azure Cache for Redis | [13-azure-redis.md](./13-azure-redis.md) |
| Key Vault + App Insights | [14-keyvault-insights.md](./14-keyvault-insights.md) |
| Blob + CDN | [15-blob-cdn.md](./15-blob-cdn.md) |

Trigger to start Stage C: see `docs/adr/002-docker-azure-container-apps.md` and `docs/azure-docker-cost.md`.

---

## Secrets inventory (never commit)

| Secret | Stage A location | Stage C location |
|--------|------------------|------------------|
| `DATABASE_URL` | VM `.env` | Key Vault → ACA |
| `JWT_ACCESS_SECRET` | VM `.env` | Key Vault |
| `JWT_REFRESH_SECRET` | VM `.env` | Key Vault |
| `MSG91_AUTH_KEY` | VM `.env` | Key Vault |
| `RAZORPAY_*` | Only when enabled | Key Vault |
| Firebase service account | VM file / env | Key Vault |
| Expo / Play credentials | Local / EAS secrets | EAS secrets |

Template: `packages/api/.env.example` · root `.env.example` for Compose.
