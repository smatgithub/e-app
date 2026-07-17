# Architecture & Wireframe — Approval Checklist

> **Milestone:** Architecture + wireframes approved  
> **Target date:** 25 Jul 2026  
> **Reviewers:** Somnath Das (Tech) · Sarthak Ghosh (Business/UAT)

Use this sheet in the review meeting. Tick each item. Sign at the bottom.

---

## A. Documents under review

| Doc | Path | Reviewed? |
|-----|------|-----------|
| System architecture | `docs/architecture.md` | ☐ |
| Data model (ERD) | `docs/erd.md` | ☐ |
| Design system tokens | `docs/design-system.md` | ☐ |
| Wireframe index | `docs/wireframes/README.md` | ☐ |
| Key flows | `docs/wireframes/flows.md` | ☐ |

---

## B. Business decisions to lock (Sarthak)

| # | Decision | Proposed | Approve? | Notes |
|---|----------|----------|----------|-------|
| 1 | Platforms | iOS + Android (React Native) | ☐ Yes ☐ Change | |
| 2 | Guest access | Browse as guest; login at checkout | ☐ Yes ☐ Change | |
| 3 | Languages (MVP) | English + placeholder for local | ☐ Yes ☐ Change | Which local language? |
| 4 | Fulfillment | Delivery + Pickup | ☐ Yes ☐ Change | |
| 5 | Payments | Razorpay UPI/online + COD | ☐ Yes ☐ Change | |
| 6 | Auto-confirm | Configurable window (default 6am–3pm) | ☐ Yes ☐ Change | Exact hours? |
| 7 | Order edit | Within 5 min OR before dispatch | ☐ Yes ☐ Change | |
| 8 | Multi-branch | Schema ready; food vertical only MVP | ☐ Yes ☐ Change | First branch name? |
| 9 | Brand | Draft warm orange until logo provided | ☐ Yes ☐ Change | Provide logo/colors |

---

## C. Technical decisions to lock (Somnath)

| # | Decision | Proposed | Approve? |
|---|----------|----------|----------|
| 1 | Mobile | React Native (Expo) | ☐ |
| 2 | API | Node.js REST `/api/v1` | ☐ |
| 3 | DB | PostgreSQL (India) | ☐ |
| 4 | Cache/queue | Redis + BullMQ | ☐ |
| 5 | Cloud | AWS or Azure managed, India region | ☐ Pick one: _______ |
| 6 | SMS OTP | MSG91 | ☐ |
| 7 | Push | FCM | ☐ |
| 8 | Maps | Google Maps | ☐ |
| 9 | Modular monolith first (not microservices) | Yes | ☐ |

---

## D. Wireframe screen sign-off

| # | Screen | OK? | Changes requested |
|---|--------|-----|-------------------|
| 1 | Splash / Onboarding | ☐ | |
| 2 | Login / OTP | ☐ | |
| 3 | Home | ☐ | |
| 4 | Product detail | ☐ | |
| 5 | Cart / Checkout | ☐ | |
| 6 | Order history & track | ☐ | |
| 7 | Profile | ☐ | |
| 8 | Admin dashboard | ☐ | |
| 8a | Admin order queue | ☐ | |
| 8b | Admin products | ☐ | |
| F | Flows (guest, pay fail, auto-confirm) | ☐ | |

---

## E. Exit criteria (Phase 1 gate)

- [ ] Architecture approved (or approved with listed changes)
- [ ] ERD approved
- [ ] All MVP wireframes approved
- [ ] Stack decisions recorded in `PROJECT_PLAN.md` §4
- [ ] Open questions listed below have owners + due dates
- [ ] Build may start Phase 2 (infra + auth) after this gate

---

## F. Open questions after review

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## G. Sign-off

| Role | Name | Decision | Date | Initials |
|------|------|----------|------|----------|
| Tech Lead | Somnath Das | ☐ Approve · ☐ Approve with changes · ☐ Reject | | |
| Business Owner | Sarthak Ghosh | ☐ Approve · ☐ Approve with changes · ☐ Reject | | |

**Summary of required changes before build:**

1. _ _  
2. _ _  
3. _ _  

---

## H. Next steps after approval

1. Close Decision Register D1–D18 in `PROJECT_PLAN.md`  
2. Draft `docs/openapi.yaml` for MVP endpoints  
3. Scaffold monorepo (`apps/mobile`, `apps/admin`, `packages/api`)  
4. Provision Dev/Staging cloud + Razorpay test + MSG91 test  
