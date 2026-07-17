# e-Food Center — Version 0.1.0

> **Opened:** 2026-07-17  
> **Status:** 🔄 In progress  
> **Theme:** Customer app core screens  
> **APK:** Do not build (Release track only on request)

## Scope (from `docs/FEATURES.md`)

- [x] F-0101 Product detail  
- [x] F-0102 Order history list  
- [x] F-0103 Order detail + timeline + cancel  
- [x] F-0104 Bottom tabs (Home / Orders / Cart / Profile)  
- [x] F-0105 Profile view + edit name  
- [x] F-0106 Saved addresses  
- [x] F-0107 Persist login token  
- [x] F-0108 Delivery vs pickup at checkout  

## Out of scope this version

- APK / Play packaging  
- MSG91, Azure, FCM, Razorpay, coupons  

## Dev run

```bash
npm run docker:up
VITE_API_BASE=http://localhost:4000/api/v1 npm run dev:admin
EXPO_PUBLIC_API_BASE=http://localhost:4000/api/v1 npm run dev:mobile
```

## Exit gate

Customer can: browse → product detail → cart → COD checkout → order history/detail (cancel if allowed) → profile + addresses. Login persists across app restarts.

## Status

🔄 Implementation landed 2026-07-17 — verify in Expo Go / simulator, then close version.
