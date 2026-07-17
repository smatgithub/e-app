# e-Food Center — Project Plan, Decision Register & Progress Tracker

> **Companion to:** `REQUIREMENTS.md`
> **Purpose:** Convert the signed requirements into a solid, phase-wise execution plan with a decision register, an information/data collection task list, and a live project progress tracker.
> **Status:** Draft v0.1
> **Owner (Project Lead / Tech Lead):** Somnath Das
> **Business Owner / UAT:** Sarthak Ghosh
> **Last updated:** *YYYY-MM-DD*

---

## How to Use This Document

1. **Section 2 (Review Findings)** — read first; these must be resolved before build starts.
2. **Section 4 (Decision Register)** — every open decision; update `Status` + `Decision` as you close them.
3. **Section 5 (Information & Data Collection)** — chase list for the business owner.
4. **Section 6 (Phase Plan)** — the phase-by-phase roadmap with exit gates.
5. **Section 7 (Progress Tracker)** — update weekly. This is the single source of truth for status.
6. **Update the Change Log** at the bottom every time you edit this file.

**Status legend (use everywhere):**
`🔲 Not started` · `🔄 In progress` · `⏳ Blocked/Waiting` · `✅ Done` · `❌ Dropped`

**Priority legend:** `P0 = MVP/Must` · `P1 = Should` · `P2 = Could` · `P3 = Later`

---



## 1. Project Snapshot


| Item                  | Value                                                             |
| --------------------- | ----------------------------------------------------------------- |
| Project name          | e-Food Center                                                     |
| Type                  | B2C food ordering & delivery (multi-branch ready)                 |
| Primary channel       | Mobile app (customer) + Web app + Admin panel                     |
| Business goal         | Make the food center reachable to all local customers; grow sales |
| 90-day success target | 9,000 orders delivered with zero complaints                       |
| 6-month scale target  | ~18,000 orders/day                                                |
| MVP payments          | UPI/online + Cash on Delivery                                     |
| Data residency        | India                                                             |
| Source & IP ownership | Somnath (developer/owner)                                         |


---



## 2. Review Findings — Must Resolve Before Build

These are gaps, conflicts, and risks found while reviewing `REQUIREMENTS.md`. Each has an action in the task list (Section 5) or decision register (Section 4).

### 2.1 Blockers (fix before Phase 1 exit)


| #   | Finding                                                                                                  | Why it matters                                   | Action                                                               |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| B1  | **Timeline is unrealistic** — sign-off to go-live in ~6 days (13→19 Jul) for a payment app + web + admin | Guarantees failure, quality/security shortcuts   | Re-baseline timeline (see Section 6.9). Get owner agreement          |
| B2  | **Wireframe date 12-02-2026 precedes sign-off** (13-07)                                                  | Timeline inconsistency; likely typo              | Correct in `REQUIREMENTS.md` §14.1                                   |
| B3  | **No master data received** (catalog, brand, policies)                                                   | Cannot build/test realistically                  | Collect per Section 5.2                                              |
| B4  | **Core tech stack undecided** (mobile, backend, DB, cloud, gateway)                                      | Blocks architecture & estimates                  | Close decisions D1–D8 (Section 4)                                    |
| B5  | **18k orders/day vs. "simple app"** tension                                                              | Scale needs real architecture, load testing, ops | Confirm realistic ramp; design for scale from Phase 2                |
| B6  | **No prior production app experience (stated risk)**                                                     | Higher delivery risk                             | Strong phase gates, automated tests, security review, staged rollout |




### 2.2 Ambiguities to clarify


| #   | Area                                             | Question to close                                                                                                          |
| --- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| A1  | Platforms (NFR-01/02)                            | iOS + Android both? Min OS versions?                                                                                       |
| A2  | Languages (NFR-03)                               | English only for MVP, or English + Bengali/Hindi? (customers described as less-educated → local language likely important) |
| A3  | Guest access (§3.1)                              | Can customers browse without login? Order without login?                                                                   |
| A4  | Delivery model (FR-ORD-04)                       | Own delivery staff only, or pickup too? Delivery radius/zones? Delivery fee rules?                                         |
| A5  | Offline support (NFR-09)                         | Required for MVP? (Recommend: no)                                                                                          |
| A6  | Concurrency/scale (NFR-07/08)                    | Realistic peak concurrent users & daily order ramp month-by-month                                                          |
| A7  | POS/printer (FR-ORD-08)                          | Which POS/printer hardware for invoice printing?                                                                           |
| A8  | KPI "Uptime 100%" (§1.4)                         | 100% is not achievable; recommend 99.5–99.9% SLA                                                                           |
| A9  | Multi-vertical scope (§3.3)                      | Confirm MVP = food only; other verticals = schema-ready but not built                                                      |
| A10 | Auto-confirmation logic (FR-ORD, "Who confirms") | Confirm exact rules: auto 6am–3pm, manager override, cancel auto-approved                                                  |




### 2.3 Consistency / quality fixes in `REQUIREMENTS.md`


| #   | Location | Fix                                                                               |
| --- | -------- | --------------------------------------------------------------------------------- |
| C1  | Header   | Fill `Last updated`, bump version, complete Change Log                            |
| C2  | §1.1     | Fill legal entity, sector, location, contact; fix "will help t Contact" label     |
| C3  | §1.4     | Replace "Uptime 100%" with realistic SLA; clarify "DB secord"                     |
| C4  | §2       | Complete In/Out of Scope properly (checkbox rows are empty)                       |
| C5  | §5       | Fill user stories US-02, US-03+ (only US-01 present)                              |
| C6  | §11      | Fill all blank NFR targets                                                        |
| C7  | §14.1    | Correct dates (see B1/B2)                                                         |
| C8  | Typos    | "verticles→verticals", "symultaniously→simultaneously", "seemless→seamless", etc. |


---



## 3. Guiding Principles (Architecture & Delivery)

Applied to every phase and decision.

- **Scalable-by-design:** stateless API services, managed DB, CDN for media, horizontal scaling, queue for order/notification spikes.
- **Security-by-design:** OTP auth, JWT + refresh, RBAC, MFA for admin, encrypted secrets, PCI scope minimized (use hosted gateway; never store card data), DPDP-aligned consent & retention.
- **Operable:** centralized logging, metrics, alerting, health checks, audit log, backups + tested restore.
- **Maintainable:** modular monorepo or clear service boundaries, shared design system, typed code, CI/CD with automated tests, environment parity (Dev → Staging → Prod).
- **MVP-first:** ship P0 only; keep schema & modules extensible for verticals, franchise, loyalty.
- **Evidence-based gates:** no phase closes without meeting its exit criteria.

---



## 4. Decision Register (Locked)

> **Locked on:** 2026-07-17 after Architecture + Wireframe approval.
> Change only via ADR + owner sign-off. `Decision` column is the binding choice.


| ID  | Decision needed             | Decision (LOCKED)                                                                 | Owner              | Needed by phase | Status | Locked date |
| --- | --------------------------- | --------------------------------------------------------------------------------- | ------------------ | --------------- | ------ | ----------- |
| D1  | Mobile approach             | **React Native (Expo)** — iOS + Android one codebase                              | Somnath            | P1              | ✅     | 2026-07-17  |
| D2  | Backend stack               | **Node.js + Express** (TypeScript), modular monolith, REST `/api/v1`              | Somnath            | P1              | ✅     | 2026-07-17  |
| D3  | Database                    | **PostgreSQL 15+**                                                                | Somnath            | P1              | ✅     | 2026-07-17  |
| D4  | Cloud/hosting               | **Lean:** Azure India **1× VM + Docker Compose** (api+postgres); Static Web Apps Free for admin. **Scale later:** ACA + managed PG/Redis (ADR 002) | Somnath            | P1              | ✅     | 2026-07-17  |
| D5  | Payment gateway             | **COD first (₹0)**; add **Razorpay UPI** when stakeholder asks (no monthly fee; % of GMV only) | Business + Somnath | P1              | ✅     | 2026-07-17  |
| D6  | SMS/OTP provider            | **MSG91** pay-as-you-go; OTP on login only; order updates via **FCM** (not SMS) at launch | Somnath            | P1              | ✅     | 2026-07-17  |
| D7  | Email provider              | **Amazon SES** (Phase 2+; not MVP blocker)                                        | Somnath            | P2              | ✅     | 2026-07-17  |
| D8  | Push notifications          | **Firebase Cloud Messaging** (+ APNs via FCM)                                     | Somnath            | P1              | ✅     | 2026-07-17  |
| D9  | Maps/geocoding              | **Deferred at launch** — text address + pincode/zone list; Google Maps when asked | Somnath            | P1              | ✅     | 2026-07-17  |
| D10 | Platforms & min OS          | **Android first** (8+); **no iOS at launch**; iOS 14+ later when approved | Somnath            | P0              | ✅     | 2026-07-17  |
| D11 | Languages (MVP)             | **English primary**; **Bengali** i18n-ready (strings toggle); Hindi later         | Business           | P0              | ✅     | 2026-07-17  |
| D12 | Guest browsing              | **Browse as guest; login (OTP) required at checkout**                             | Business           | P0              | ✅     | 2026-07-17  |
| D13 | Delivery model & zones      | **Own delivery + pickup**; zone fees in `delivery_zones` (slabs from Sarthak)     | Business           | P0              | ✅     | 2026-07-17  |
| D14 | POS/printer for invoices    | **ESC-POS thermal** protocol; **specific printer model TBD** before Phase 4 print | Business           | P1              | ✅     | 2026-07-17  |
| D15 | App store account ownership | **Somnath** owns Apple Developer + Google Play accounts                           | Somnath            | P1              | ✅     | 2026-07-17  |
| D16 | SLA/uptime target           | **99.5%** MVP single-region; aspirational 99.9% post-hardening                    | Somnath            | P0              | ✅     | 2026-07-17  |
| D17 | CI/CD & release cadence     | **CI on every merge**; **weekly** scheduled releases to Staging/Prod              | Somnath            | P1              | ✅     | 2026-07-17  |
| D18 | Hosting region              | **India** (Azure India region) — DPDP data residency                              | Somnath            | P1              | ✅     | 2026-07-17  |

**Follow-ups (do not reopen decisions):**

| Item | Owner | Due |
|------|-------|-----|
| Delivery zone names + fee slabs (data for D13) | Sarthak | Before Phase 4 |
| POS printer brand/model (data for D14) | Sarthak | Before Phase 4 invoice print |
| Azure subscription + India region confirmed | Somnath | Phase 2 week 1 |
| Razorpay KYC + MSG91 DLT templates | Both | Phase 2 |


---



## 5. Information & Data Collection Task List

> These block build/UAT. Chase aggressively. Mark `Received?` + date.



### 5.1 Decisions to confirm with business owner (Sarthak)


| #   | Item                                             | Blocks                  | Status |
| --- | ------------------------------------------------ | ----------------------- | ------ |
| I1  | Payment gateway account + KYC (D5)               | Payments                | 🔲     |
| I2  | Delivery zones, radius, delivery fee rules (D13) | Checkout, pricing       | 🔲     |
| I3  | Language(s) for MVP (D11)                        | UI, content             | 🔲     |
| I4  | Guest vs login-required rules (D12)              | Auth flow               | 🔲     |
| I5  | Auto-confirmation exact rules & timings (A10)    | Order engine            | 🔲     |
| I6  | POS/printer hardware details (D14)               | Invoice printing        | 🔲     |
| I7  | Realistic order ramp (month 1→6) (A6)            | Capacity plan           | 🔲     |
| I8  | Legal entity, GST, business address, hours (C2)  | Store listing, invoices | 🔲     |




### 5.2 Master data / assets to receive (Requirements §9)


| #   | Data set                                                                              | Format    | Received? | Date |
| --- | ------------------------------------------------------------------------------------- | --------- | --------- | ---- |
| M1  | Company profile (name, GST, address, hours, support no.)                              | Doc/form  | 🔲        |      |
| M2  | Logo & brand assets (SVG/PNG)                                                         | Files     | 🔲        |      |
| M3  | App icon & splash assets                                                              | Files     | 🔲        |      |
| M4  | Product/service catalog (min 20–50 items: name, price, tax, image, category, min-qty) | Excel/CSV | 🔲        |      |
| M5  | Category list                                                                         | Excel/CSV | 🔲        |      |
| M6  | Branch/outlet list (address, geo, hours, serviceable areas)                           | Excel/CSV | 🔲        |      |
| M7  | Pricing & tax rules (GST %, packaging, delivery fee)                                  | Doc       | 🔲        |      |
| M8  | Delivery/service area rules                                                           | Doc       | 🔲        |      |
| M9  | Staff list & roles                                                                    | Excel     | 🔲        |      |
| M10 | Terms & conditions text                                                               | Doc/URL   | 🔲        |      |
| M11 | Privacy policy text                                                                   | Doc/URL   | 🔲        |      |
| M12 | Refund/cancellation policy text                                                       | Doc       | 🔲        |      |
| M13 | FAQ content                                                                           | Doc       | 🔲        |      |
| M14 | Coupon/referral/subscription rules (exact %/limits)                                   | Doc       | 🔲        |      |




### 5.3 Accounts & credentials to provision


| #   | Account                                            | Owner    | Status |
| --- | -------------------------------------------------- | -------- | ------ |
| P1  | Cloud account + India region (D4/D18)              | Somnath  | 🔲     |
| P2  | Payment gateway live+test keys (D5)                | Business | 🔲     |
| P3  | SMS/DLT registration (D6)                          | Somnath  | 🔲     |
| P4  | Email sending domain + SPF/DKIM (D7)               | Somnath  | 🔲     |
| P5  | Firebase project (D8)                              | Somnath  | 🔲     |
| P6  | Google Maps billing key (D9)                       | Somnath  | 🔲     |
| P7  | Apple Developer ($99/yr) + Google Play ($25) (D15) | Somnath  | 🔲     |
| P8  | Domain + SSL/TLS (Req §12)                         | Somnath  | 🔲     |
| P9  | Git repo, CI/CD, secrets manager                   | Somnath  | 🔲     |


---



## 6. Phase-Wise Plan

Nine phases from discovery to scale. Each phase has objectives, key tasks, deliverables, and **exit criteria (gate)**. No phase closes until its gate is met.

### Phase 0 — Discovery, Sign-off & Foundations

**Objective:** Close requirements, decisions, and data gaps; set up environments.

- Resolve review findings (Section 2 blockers B1–B6, ambiguities A1–A10, fixes C1–C8).
- Close decisions D1–D18; collect data M1–M14, accounts P1–P9.
- Re-baseline timeline (Section 6.9); get requirements **sign-off** (Req §15.3).
- Set up Git repo, branching strategy, CI skeleton, secrets management.
**Deliverables:** Finalized `REQUIREMENTS.md`, closed decision register, data pack, signed scope.
**Exit gate:** ✅ Pre-Development Gate Checklist (Req §17) fully checked; all P0 decisions closed; core data received.



### Phase 1 — Architecture & UX Design

**Objective:** Lock the technical blueprint and the customer/admin UX.

- High-level architecture diagram (app ↔ API ↔ DB ↔ queue ↔ gateway ↔ notifications).
- Data model / ERD (extend Req §8: add Category, Branch, OrderItem, Payment, Coupon, DeliveryZone, AuditLog).
- API contract (OpenAPI) for MVP endpoints; auth flow (OTP + JWT/refresh + RBAC).
- Wireframes for all screens (Req §6) + admin panel; design system (Tailwind tokens, components).
- Security design: PCI scope, DPDP consent/retention, MFA for admin, audit strategy.
- Environment strategy Dev/Staging/Prod (Req §13); infra-as-code plan.
**Deliverables:** Architecture doc, ERD, API spec, clickable wireframes, security design.
**Exit gate:** ✅ Architecture + wireframes reviewed & approved; estimates refined.



### Phase 2 — Core Platform Foundation (Backend + Infra)

**Objective:** Build the backbone everything depends on.

- Provision cloud infra (IaC), managed Postgres, container hosting, CDN, secrets.
- Auth service (phone OTP via SMS provider, JWT, refresh, RBAC roles: customer/staff/manager/admin).
- Core DB schema + migrations; audit log; seed master data.
- CI/CD pipelines (build, test, deploy to Dev/Staging); observability (logs/metrics/health).
**Deliverables:** Running API skeleton in Staging, auth working, CI/CD live, monitoring on.
**Exit gate:** ✅ Auth E2E works; pipelines green; infra reproducible; secrets secured.



### Phase 3 — Catalog & Customer App (Browse)

**Objective:** Customer can install, log in, and browse.

- Catalog APIs (categories, products, detail, stock/availability) — FR-CAT-01/02/04/06.
- Customer app: onboarding, OTP login, home, product detail, search (P1), favorites (P1).
- Admin: product/category management (FR-ADM-02); image upload to CDN.
- Multi-branch schema wired (branch selection scaffolded, food vertical only).
**Deliverables:** Browsable app (Dev/Staging) backed by real seed catalog.
**Exit gate:** ✅ Customer can log in and browse real catalog; admin can manage products.



### Phase 4 — Ordering, Cart & Payments

**Objective:** Complete the money path — the heart of MVP.

- Cart, min-qty rules (item-specific), coupon/discount (FR-MKT-01), delivery/pickup selection (FR-ORD-04).
- Order lifecycle engine: Placed→Confirmed→In progress→Completed→Closed; Cancelled/Refunded.
- **Auto-confirmation window** (6am–3pm configurable) + manager manual approve/cancel (FR-ORD "who confirms").
- Payments: Razorpay (or chosen) UPI/card + COD; payment status; refund initiation (small deduction rule).
- Invoice/receipt + POS/printer output (FR-ORD-08); order history (FR-ORD-06); edit/cancel window (5 min).
- Exception flows: payment failed (hold 15 min), out-of-stock, cancellation reasons (Req §7.3).
**Deliverables:** End-to-end order + payment + refund working in Staging.
**Exit gate:** ✅ Full order→pay→confirm→fulfill→refund path passes test cases; reconciliation of COD collections works.



### Phase 5 — Operations, Notifications & Admin

**Objective:** Make it runnable by staff/manager and communicate with customers.

- Order/booking management console (FR-ADM-03), staff assignment (FR-ADM-07), user management (FR-ADM-04).
- Reports & dashboards (sales, orders, cancellations, COD collection by delivery person) (FR-ADM-05).
- Notifications: push (FCM) + SMS per trigger matrix (Req §4.5); in-app banners/offers (FR-NOT-04).
- Day-end reconciliation; audit log surfacing.
**Deliverables:** Manager/staff can run daily operations; customers get status updates.
**Exit gate:** ✅ A full simulated business day runs through the admin console with correct notifications & reports.



### Phase 6 — Hardening: Security, Performance & QA

**Objective:** Make it production-grade and prove it at scale.

- Security review (auth, RBAC, MFA admin, secrets, PCI scope, DPDP consent/retention, audit).
- Load/performance testing to target ramp (validate p95 < 500ms, launch < 3s); tune DB/indexes/queues.
- Full regression + automated test suite; accessibility pass; error handling & retries.
- Backup + **restore drill** (RPO/RTO), incident runbook, alert thresholds.
**Deliverables:** Security report, load-test report, DR drill evidence, test coverage report.
**Exit gate:** ✅ Meets NFR targets; no critical/high vulns open; restore drill passed.



### Phase 7 — UAT & Launch Prep

**Objective:** Business validates; prepare stores and go-live.

- UAT with Sarthak against MVP Acceptance Checklist (Req §15.2); log & fix defects.
- App store assets, listings, privacy declarations; submit to Apple/Google (D15).
- Final content load (real catalog, policies, banners); pilot with limited users.
- Go-live runbook, rollback plan, support/AMC SLA (Req §14.4) ready.
**Deliverables:** Signed UAT (Req §15.3), store approvals, launch runbook.
**Exit gate:** ✅ UAT sign-off obtained; stores approved; rollback tested.



### Phase 8 — Go-Live & Hypercare

**Objective:** Launch safely and stabilize.

- Staged rollout (pilot zone → full); monitor dashboards & alerts closely (hypercare 1–2 weeks).
- Daily standup on incidents; fast bug-fix SLA (Critical 30 min / Normal 2 days).
- Track KPIs vs. 90-day target (9,000 successful orders); collect feedback.
**Deliverables:** Live product, hypercare log, KPI dashboard.
**Exit gate:** ✅ Stable in prod; KPIs tracked; handover to steady-state ops/AMC.



### Phase 9 — Post-MVP / Phase-2 Backlog

**Objective:** Extend after stable MVP.

- Email login/social login (FR-AUTH-02/03), profile edit (FR-AUTH-05), variants (FR-CAT-05).
- WhatsApp integration (FR-NOT-06), email notifications (FR-NOT-03), wallet/points (FR-MKT-03), subscription (FR-MKT-04).
- New verticals (retail, veg, household), franchise/white-label, advanced analytics.
**Exit gate:** N/A (rolling backlog).



### 6.9 Recommended Re-Baselined Timeline

> Replaces the 6-day plan. Adjust week counts to your available effort; sequence is what matters.


| Phase                        | Indicative duration (solo/small team) |
| ---------------------------- | ------------------------------------- |
| P0 Discovery & foundations   | 1–2 weeks                             |
| P1 Architecture & UX         | 1–2 weeks                             |
| P2 Platform foundation       | 2–3 weeks                             |
| P3 Catalog & browse          | 2 weeks                               |
| P4 Ordering & payments       | 3–4 weeks                             |
| P5 Ops, notifications, admin | 2–3 weeks                             |
| P6 Hardening & QA            | 2 weeks                               |
| P7 UAT & launch prep         | 1–2 weeks                             |
| P8 Go-live & hypercare       | 1–2 weeks                             |
| **Total to MVP go-live**     | **~15–22 weeks (≈4–5 months)**        |


---



## 7. Project Progress Tracker

> **Update weekly.** This is the master status board.



### 7.1 Overall Health


| Field              | Value                                    |
| ------------------ | ---------------------------------------- |
| Reporting date     | 2026-07-17                               |
| Current phase      | Soft launch candidate (v1.0)             |
| Overall status     | 🔄 UAT / Azure gate                      |
| Overall % complete | ~72%                                     |
| Schedule health    | 🟢                                       |
| Top risk right now | Docker Desktop flaky; Azure VM not yet   |
| Next milestone     | Sarthak UAT sign-off → Staging VM        |




### 7.2 Phase Board


| Phase                        | Status | %   | Start | Target end | Actual end | Exit gate met? | Notes |
| ---------------------------- | ------ | --- | ----- | ---------- | ---------- | -------------- | ----- |
| P0 Discovery & foundations   | 🔄     | 75% | 2026-07-13 | 2026-07-19 |            | 🔲             | Decisions locked; requirements sign-off + master data open |
| P1 Architecture & UX         | ✅     | 100% | 2026-07-17 | 2026-07-25 | 2026-07-17 | ✅             | Architecture, ERD, OpenAPI and wireframes approved |
| P2 Platform foundation       | 🔄     | 85% | 2026-07-17 | 2026-08-09 |            | 🔲             | Soft-launch APIs; Azure VM pending |
| P3 Catalog & browse          | ✅     | 95% | 2026-07-17 |            | 2026-07-17 | ✅             | Menu + detail + banners |
| P4 Ordering & payments       | 🔄     | 80% | 2026-07-17 |            |            | 🔲             | COD complete; Razorpay deferred |
| P5 Ops, notifications, admin | 🔄     | 75% | 2026-07-17 |            |            | 🔲             | Dashboard/ops; FCM send deferred |
| P6 Hardening & QA            | 🔄     | 40% | 2026-07-17 |            |            | 🔲             | OTP rate limit; UAT script ready |
| P7 UAT & launch prep         | 🔄     | 30% | 2026-07-17 |            |            | 🔲             | Soft-launch UAT checklist |
| P8 Go-live & hypercare       | 🔲     | 0%  |       |            |            | 🔲             |       |
| P9 Post-MVP backlog          | 🔲     | 0%  |       |            |            | —              |       |




### 7.3 Milestone Tracker


| Milestone                          | Owner   | Target | Status | Done date |
| ---------------------------------- | ------- | ------ | ------ | --------- |
| Requirements sign-off              | Sarthak |        | 🔲     |           |
| All P0 decisions closed            | Somnath | 2026-07-17 | ✅     | 2026-07-17 |
| Master data pack received          | Sarthak |        | 🔲     |           |
| Architecture + wireframes approved | Somnath | 2026-07-25 | ✅     | 2026-07-17 |
| OpenAPI + monorepo scaffold         | Somnath | 2026-07-25 | ✅     | 2026-07-17 |
| v0 Docker + PostgreSQL scaffold     | Somnath | 2026-07-26 | ✅     | 2026-07-17 |
| Auth JWT + OTP stub + COD order API | Somnath | 2026-07-26 | ✅     | 2026-07-17 |
| Admin queue + mobile checkout UI    | Somnath | 2026-07-26 | ✅     | 2026-07-17 |
| Auth + infra live (Staging)        | Somnath |        | 🔲     |           |
| Browse app demo                    | Somnath |        | 🔄     |           |
| End-to-end order+payment demo      | Somnath |        | 🔲     |           |
| Admin/ops + notifications complete | Somnath |        | 🔲     |           |
| Security + load test passed        | Somnath |        | 🔲     |           |
| UAT sign-off                       | Sarthak |        | 🔲     |           |
| Store approvals                    | Somnath |        | 🔲     |           |
| Go-live                            | Somnath |        | 🔲     |           |




### 7.4 Decision Closure Tracker


| Metric                   | Count  |
| ------------------------ | ------ |
| Total decisions (D1–D18) | 18     |
| Closed                   | 18     |
| Open                     | 0      |
| Blocking current phase   | None (data follow-ups only) |




### 7.5 Data/Info Closure Tracker


| Metric                       | Count |
| ---------------------------- | ----- |
| Decisions to confirm (I1–I8) | 8     |
| Master data items (M1–M14)   | 14    |
| Accounts (P1–P9)             | 9     |
| Received / done              | 0     |
| Outstanding                  | 31    |




### 7.6 Weekly Status Log


| Week | Date | Phase | Done this week | Planned next week | Blockers |
| ---- | ---- | ----- | -------------- | ----------------- | -------- |
| W1   | 2026-07-17 | P0–P2 | D1–D18 locked; architecture/wireframes; OpenAPI/monorepo; Stage A budget; Docker runtime verified; JWT+OTP stub; cart+COD order+admin APIs | Wire mobile browse + admin queue UI; Azure VM prep; master data chase | Requirements sign-off + master data pending |
| W2   | 2026-07-24 | P2 |                |                   |          |


---



## 8. RACI (Ownership)


| Activity                       | Somnath (Lead/Dev) | Sarthak (Business/UAT) |
| ------------------------------ | ------------------ | ---------------------- |
| Requirements sign-off          | R                  | A                      |
| Technical decisions (D1–D18)   | A/R                | C                      |
| Master data & content (M1–M14) | C                  | A/R                    |
| Payment gateway KYC (I1)       | C                  | A/R                    |
| Architecture & build           | A/R                | I                      |
| UAT                            | C                  | A/R                    |
| Go-live approval               | R                  | A                      |
| Ongoing ops/AMC                | A/R                | I                      |


*R=Responsible, A=Accountable, C=Consulted, I=Informed.*

---



## 9. Risk Register


| ID  | Risk                                         | Likelihood | Impact | Mitigation                                               | Owner   | Status |
| --- | -------------------------------------------- | ---------- | ------ | -------------------------------------------------------- | ------- | ------ |
| R1  | Unrealistic timeline → quality/security cuts | High       | High   | Re-baseline (Section 6.9); phase gates                   | Somnath | 🔄     |
| R2  | First production app; delivery gaps          | Med        | High   | Automated tests, security review, staged rollout         | Somnath | 🔄     |
| R3  | Scale (18k/day) exceeds architecture         | Med        | High   | Design for scale P2+; load test P6                       | Somnath | 🔲     |
| R4  | Master data delays                           | High       | Med    | Chase list (Section 5); block gates                      | Sarthak | 🔲     |
| R5  | Payment/PCI & DPDP compliance gaps           | Med        | High   | Hosted gateway, minimize scope, consent/retention design | Somnath | 🔲     |
| R6  | COD reconciliation errors/leakage            | Med        | Med    | Delivery-person collection tracking + day-end report     | Somnath | 🔲     |
| R7  | Cloud cost overrun (maps, SMS, egress)       | Low        | Med    | Stage A ₹2–4k approved; defer paid services; ₹5k alert   | Somnath | 🔄     |
| R8  | Scope creep (verticals, franchise in MVP)    | Med        | Med    | Schema-ready but MVP = food only                         | Somnath | 🔲     |


---



## 10. Immediate Next Actions (This Week)

1. ✅ Architecture/wireframes approved; D1–D18 locked; OpenAPI + monorepo complete.
2. ✅ Stage A approved: ₹2–4k/month, COD-only, Android-first, paid services deferred.
3. ✅ Docker Compose verified; JWT + OTP stub; cart + COD order + admin queue APIs live.
4. ✅ Admin order queue UI + mobile browse/checkout UI wired to live API.
5. Chase Sarthak **UAT** via `docs/uat/SOFT_LAUNCH_UAT.md` + formal requirements sign-off.
6. When Docker is healthy: rebuild API image (`npm run docker:up`) so port 4000 matches v1.0.
7. Azure VM apply per `docs/runbooks/soft-launch.md` when ready (no APK until Release track).

---



## Change Log


| Version | Date         | Author      | Summary                                                                                                |
| ------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------ |
| 0.1     | *YYYY-MM-DD* | Somnath Das | Initial plan, decision register, data task list & progress tracker created from REQUIREMENTS.md review |
| 0.2     | 2026-07-17   | Somnath Das | Arch/WF approved; D1–D18 locked; OpenAPI + monorepo scaffold; tracker updated                          |
| 0.3     | 2026-07-17   | Somnath Das | Stage A approved; v0 development started; P1 closed and P2 tracker activated                           |
| 0.4     | 2026-07-17   | Somnath Das | P2 advanced: JWT/OTP stub, cart+COD orders, admin queue APIs; Docker runtime verified                  |
| 0.5     | 2026-07-17   | Somnath Das | P3 lean: admin order queue UI + mobile Home/cart/COD checkout against live API                         |
| 0.6     | 2026-07-17   | Somnath Das | Catalog expand: 5 categories / 12+ products; admin product CRUD; mobile category chips + search         |
| 0.7     | 2026-07-17   | Somnath Das | Seeded Kolkata menu (Mughlai/Bengali/Indo-Chinese/Continental/Desserts) with mid-band INR prices       |
| 0.8     | 2026-07-17   | Somnath Das | Versioned FEATURES backlog; v0.1 customer tabs (detail/orders/profile/pickup); no APK until release track |
| 0.9     | 2026-07-17   | Somnath Das | Soft-launch push v1.0: admin ops/dashboard/coupons, mobile reorder/coupon/banners, UAT+runbooks         |
