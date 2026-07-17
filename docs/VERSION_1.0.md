# e-Food Center — Version 1.0.0 (Soft launch candidate)

> **Opened:** 2026-07-17  
> **Status:** 🔄 Code complete — UAT + infra gate remaining  
> **Theme:** Soft launch COD path (feature-complete for lean launch)  
> **APK:** Do not build unless Release track requested  

## Included (from FEATURES backlog)

- ✅ 0.1 Customer core  
- ✅ 0.2 Order polish (reorder, admin detail, checkout, pickup)  
- ✅ 0.3 Admin ops (dashboard, users, COD day, product deactivate)  
- ✅ 0.4 Coupons + banners  
- ✅ 0.5 Notification log hooks + device token register (FCM send deferred)  
- ✅ 0.6 OTP rate limit + MSG91 adapter (stub default) + logout-all  
- ✅ 0.7 Deploy/soft-launch runbooks (Azure apply when VM ready)  
- 🔄 1.0 UAT checklist + COD production config docs  

## Run

```bash
npm run docker:up
VITE_API_BASE=http://localhost:4000/api/v1 npm run dev:admin
EXPO_PUBLIC_API_BASE=http://localhost:4000/api/v1 npm run dev:mobile
```

Demo coupon: `WELCOME20` (min 3 items). Manager: `919999999999` / `123456`.

## Exit gate

- [ ] UAT `docs/uat/SOFT_LAUNCH_UAT.md` signed  
- [ ] Staging/Azure OR accepted local soft-launch demo  
- [ ] JWT secrets rotated if public-facing  
- [ ] Support phone/email confirmed by Sarthak  
