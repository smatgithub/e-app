# 08 — Expo + Google Play (Android-first)

## Purpose
Ship customer app on Android only at launch (D10).

## Expo
```bash
npm run dev:mobile
```
- Use Expo Go for early UI.  
- EAS Build when ready for Play Store / internal testing.

## Google Play Console
1. Pay **$25** one-time developer fee.  
2. Create app → Internal testing track first.  
3. Privacy policy URL required (can be simple static page).  
4. Package name must match Firebase Android app.

## EAS (when building store binary)
```bash
npx eas-cli login
npx eas build -p android --profile preview
```
Store `EXPO_TOKEN` / Play service account in EAS secrets — not in git.

## iOS
**Do not** enroll Apple Developer until stakeholder approves iOS spend (~$99/yr).

## Checklist
- [ ] Play Console account  
- [ ] Internal testing release  
- [ ] API base URL points to Prod HTTPS
