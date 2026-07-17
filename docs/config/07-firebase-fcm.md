# 07 — Firebase Cloud Messaging (FCM)

## Purpose
Free push for order status (Lean: prefer FCM over SMS).

## Steps
1. [Firebase Console](https://console.firebase.google.com/) → Create project `e-food-center`.  
2. Add **Android** app: package e.g. `com.efood.center`.  
3. Download `google-services.json` → keep out of git; configure via EAS secrets / Expo.  
4. Project settings → Service accounts → Generate key (JSON) for API server.  
5. Store path or JSON in VM env `FIREBASE_SERVICE_ACCOUNT` (Stage A).

## Expo
Use `expo-notifications` + EAS credentials (see Expo docs for FCM V1).

## When to configure
After order status exists in API — not blocking first catalog/auth screens.

## Checklist
- [ ] Android app registered  
- [ ] No iOS APNs until iOS approved  
- [ ] Server can send a test push to one device
