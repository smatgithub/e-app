# e-Food Center — Date-Wise Task Plan

> **Companion to:** `PROJECT_PLAN.md` (tracker updated in §7)  
> **Start date:** 13 Jul 2026  
> **Target go-live:** 30 Nov 2026  
> **Owners:** Somnath Das (Tech) · Sarthak Ghosh (Business/UAT)  
> **Last updated:** 2026-07-13

---

## How to use this file

| Role | What to do |
|------|------------|
| **Somnath** | Check **Today's focus** each morning; update `PROJECT_PLAN.md` §7 weekly |
| **Sarthak** | Check tasks marked **Sarthak**; complete by due date |
| **Both** | Review **This week** every Monday |

**Status:** `🔲` Not started · `🔄` In progress · `✅` Done · `⏳` Blocked

---

## Milestone calendar (quick view)

| Milestone | Date | Owner |
|-----------|------|-------|
| Requirements sign-off | **19 Jul 2026** | Sarthak |
| Architecture + wireframes approved | **25 Jul 2026** | Both |
| Auth + staging infra live | **09 Aug 2026** | Somnath |
| Browse app demo | **30 Aug 2026** | Somnath |
| End-to-end order + payment demo | **27 Sep 2026** | Somnath |
| MVP feature-complete | **25 Oct 2026** | Somnath |
| Security + load test passed | **08 Nov 2026** | Somnath |
| UAT sign-off | **21 Nov 2026** | Sarthak |
| App store submission | **23 Nov 2026** | Somnath |
| **GO-LIVE** | **30 Nov 2026** | Both |
| 90-day KPI review (9,000 orders) | **28 Feb 2027** | Both |

---

## TODAY — Mon 13 Jul 2026 (Week 1, P0)

| # | Task | Who | Status |
|---|------|-----|--------|
| 1 | Kickoff: agree realistic timeline (not 6-day plan) | Both | 🔲 |
| 2 | Create GitHub repo `E-App` + push code | Somnath | 🔲 |
| 3 | Start P0 decisions (languages, guest login, delivery zones) | Sarthak | 🔲 |
| 4 | Document tech stack decision (React Native, Node, PostgreSQL) | Somnath | 🔲 |

---

## WEEK 1 — 13–19 Jul 2026 | P0 Discovery

| Date | Task | Who | Deliverable |
|------|------|-----|-------------|
| Mon 13 Jul | Kickoff + GitHub push + start decisions | Both / Somnath | Repo live |
| Tue 14 Jul | Close P0 decisions D10–D13, D16; close D1–D5 tech stack | Somnath + Sarthak | Decision Register updated |
| Wed 15 Jul | Send Sarthak master data checklist with due dates | Somnath | Chase list sent |
| Wed–Fri | Sarthak: company profile, 20–50 menu items, categories, branch | Sarthak | Excel/CSV + images |
| Thu 16 Jul | Fix REQUIREMENTS.md gaps (legal entity, KPIs, dates) | Somnath | Clean requirements |
| Fri 18 Jul | Requirements review workshop (1–2 hrs) | Both | Open questions closed |
| **Sat 19 Jul** | **Requirements sign-off** (Req §15.3) | **Sarthak** | Signed requirements |
| Sat 19 Jul | Pre-Development Gate complete (Req §17) | Both | Gate passed |

**Week 1 exit:** Requirements signed · P0 decisions closed · Sample data received

---

## WEEK 2 — 20–26 Jul 2026 | P0 wrap + P1 start

| Date | Task | Who | Deliverable |
|------|------|-----|-------------|
| Mon 20 Jul | System architecture diagram | Somnath | `docs/architecture.md` |
| Mon–Wed | ERD + OpenAPI spec for MVP | Somnath | `docs/erd.md`, `docs/openapi.yaml` |
| Thu 23 Jul | Sarthak: logo, app icon, T&C, privacy, refund policy | Sarthak | Brand + legal files |
| Thu–Fri | Wireframes for 8 MVP screens | Somnath | `docs/wireframes/` |
| **Fri 25 Jul** | **Architecture + wireframe review** | **Both** | Design approved |
| Sat 26 Jul | Cloud + CI + Firebase accounts | Somnath | Dev accounts live |
| Sat 26 Jul | Razorpay test account + KYC started | Sarthak / Somnath | Razorpay access |

**Week 2 exit:** Architecture + ERD + OpenAPI + wireframes approved

---

## WEEK 3 — 27 Jul – 02 Aug 2026 | P1 UX + P2 start

| Date | Task | Who | Deliverable |
|------|------|-----|-------------|
| Mon 27 Jul | Monorepo scaffold (mobile, admin, api) | Somnath | Project structure |
| Mon–Tue | PostgreSQL schema + migrations | Somnath | Migrations |
| Wed 29 Jul | Seed DB with Sarthak's menu data | Somnath | Seed script |
| Wed 29 Jul | Sarthak confirms delivery zones, fees, pickup rules | Sarthak | Delivery rules doc |
| Thu–Fri | Dev + Staging infra + CI/CD | Somnath | Staging URL |
| Sat 01 Aug | MSG91 + DLT template registration | Somnath | SMS provider (test) |

---

## WEEK 4 — 03–09 Aug 2026 | P2 Platform foundation

| Date | Task | Who | Deliverable |
|------|------|-----|-------------|
| Mon–Wed | Phone OTP auth API | Somnath | Login in staging |
| Wed–Thu | JWT + RBAC (customer/staff/manager/admin) | Somnath | Role middleware |
| Thu | Admin MFA | Somnath | Hardened admin auth |
| Fri | Audit log for admin actions | Somnath | Audit module |
| **Sat 09 Aug** | **Security review on auth** | Somnath | Auth security pass |

**Week 4 exit:** Auth + RBAC + staging infra live

---

## WEEK 5 — 10–16 Aug 2026 | P2 continued

| Task | Who | Deliverable |
|------|-----|-------------|
| Catalog API (categories, products, branch filter) | Somnath | API endpoints |
| Sarthak reviews seeded menu | Sarthak | Content corrections |
| Admin panel: product/category CRUD | Somnath | Admin catalog |
| Product image upload (CDN) | Somnath | Images working |

---

## WEEK 6 — 17–23 Aug 2026 | P3 Catalog & mobile browse

| Task | Who | Deliverable |
|------|-----|-------------|
| Mobile: splash, branch select, OTP login | Somnath | Auth screens |
| Mobile: home, categories, product detail | Somnath | Browse flow |
| Sarthak tests browse on phone | Sarthak | Feedback |
| Guest browse (login at checkout only) | Somnath | Guest mode |

---

## WEEK 7 — 24–30 Aug 2026 | P3 wrap

| Task | Who | Deliverable |
|------|-----|-------------|
| Favorites, search, stock display | Somnath | Enhanced catalog |
| Sarthak practice: update prices/offers in admin | Sarthak | Ops rehearsal |
| UI polish (large buttons, local language) | Somnath | UX improvements |
| **Sat 30 Aug — Browse app demo** | Somnath | **Milestone** |

---

## WEEK 8 — 31 Aug – 06 Sep 2026 | P4 Orders start

| Task | Who | Deliverable |
|------|-----|-------------|
| Cart API + min-qty rules | Somnath | Cart logic |
| Mobile cart + checkout UI | Somnath | Cart screens |
| Delivery/pickup + address (maps) | Somnath | Checkout |
| Sarthak confirms coupon rules | Sarthak | Coupon config |

---

## WEEK 9 — 07–13 Sep 2026 | P4 Order engine

| Task | Who | Deliverable |
|------|-----|-------------|
| Order lifecycle state machine | Somnath | Order engine |
| Auto-confirm window + manager override | Somnath | Auto-confirm |
| Sarthak validates auto-confirm rules | Sarthak | Rules sign-off |
| Cancel + reason + 5-min edit window | Somnath | Exception flows |

---

## WEEK 10 — 14–20 Sep 2026 | P4 Payments

| Task | Who | Deliverable |
|------|-----|-------------|
| Razorpay checkout + webhooks | Somnath | Online payment |
| Razorpay live KYC | Sarthak | Live keys |
| COD + delivery person tracking | Somnath | COD module |
| Payment security review | Somnath | PCI pass |
| Sarthak E2E payment test | Sarthak | Payment UAT notes |

---

## WEEK 11 — 21–27 Sep 2026 | P4 wrap

| Task | Who | Deliverable |
|------|-----|-------------|
| Refund flow (₹1–₹2 deduction) | Somnath | Refund API |
| Invoice PDF + kitchen ticket | Somnath | Print module |
| **Sat 27 Sep — E2E order demo** | Somnath | **Milestone** |

---

## WEEK 12 — 28 Sep – 04 Oct 2026 | P4 polish + P5 start

| Task | Who | Deliverable |
|------|-----|-------------|
| Order history + reorder | Somnath | History screen |
| Admin order queue (approve/reject/assign) | Somnath | Ops console |
| Sarthak simulated business day | Sarthak | Ops feedback |

---

## WEEK 13 — 05–11 Oct 2026 | P5 Notifications

| Task | Who | Deliverable |
|------|-----|-------------|
| FCM push (order status) | Somnath | Push working |
| SMS on delivered (MSG91) | Somnath | SMS triggers |
| In-app banners/offers admin | Somnath | Marketing module |
| Coupon + referral logic | Somnath | Discount engine |

---

## WEEK 14 — 12–18 Oct 2026 | P5 Admin & reports

| Task | Who | Deliverable |
|------|-----|-------------|
| Reports dashboard | Somnath | Manager dashboard |
| COD day-end reconciliation | Somnath | Finance report |
| Staff assignment + user mgmt | Somnath | Staff module |
| Sarthak admin training walkthrough | Both | Admin SOP |

---

## WEEK 15 — 19–25 Oct 2026 | P5 wrap

| Task | Who | Deliverable |
|------|-----|-------------|
| Email notifications | Somnath | Email module |
| Complaint/support tickets | Somnath | Support module |
| Bug fixes from internal test | Somnath | Stabilized build |
| **Sat 25 Oct — MVP feature-complete** | Somnath | **Milestone** |

---

## WEEK 16 — 26 Oct – 01 Nov 2026 | P6 Hardening

| Task | Who | Deliverable |
|------|-----|-------------|
| Automated test suite | Somnath | Test report |
| Full security audit | Somnath | Security report |
| Fix Critical/High findings | Somnath | Remediation |

---

## WEEK 17 — 02–08 Nov 2026 | P6 Performance

| Task | Who | Deliverable |
|------|-----|-------------|
| Load testing (k6) | Somnath | Load test report |
| DB tuning + API optimization | Somnath | p95 < 500ms |
| Backup + restore drill | Somnath | DR evidence |
| **Sat 08 Nov — Security + load pass** | Somnath | **Milestone** |

---

## WEEK 18 — 09–15 Nov 2026 | P6 wrap + P7 prep

| Task | Who | Deliverable |
|------|-----|-------------|
| Production environment | Somnath | Prod infra |
| Load real catalog into prod | Sarthak / Somnath | Prod content |
| UAT script prepared | Somnath | `docs/uat/uat-script.md` |
| App store assets draft | Somnath / Sarthak | Store listing |

---

## WEEK 19 — 16–22 Nov 2026 | P7 UAT

| Date | Task | Who |
|------|------|-----|
| Mon 16 Nov | UAT kickoff | Sarthak tests / Somnath supports |
| Mon–Fri | Execute UAT TC-01 to TC-11 | Sarthak |
| Daily | Fix defects (Critical: same day) | Somnath |
| Fri 20 Nov | UAT re-test | Sarthak |
| **Sat 21 Nov** | **UAT sign-off** | **Sarthak** |

**Payment:** 40% MVP delivery trigger at UAT start (16 Nov)

---

## WEEK 20 — 23–29 Nov 2026 | P7 Launch prep

| Task | Who | Deliverable |
|------|-----|-------------|
| Submit Google Play + Apple App Store | Somnath | Submissions |
| Go-live + rollback runbooks | Somnath | Runbooks |
| Thu 26 Nov — Pilot launch (limited zone) | Both | Pilot live |
| Store approval (allow 3–7 day buffer) | Somnath | Apps approved |

---

## WEEK 21 — 30 Nov – 06 Dec 2026 | P8 GO-LIVE

| Date | Task | Who |
|------|------|-----|
| **Mon 30 Nov** | **GO-LIVE — full public launch** | **Both** |
| Daily | Hypercare + incident review | Somnath |
| Daily | Orders, products, offers in admin | Sarthak |
| Daily | KPI monitoring | Somnath |

**Payment:** 30% go-live trigger (30 Nov)

---

## WEEK 22 — 07–13 Dec 2026 | P8 Hypercare wrap

| Task | Who |
|------|-----|
| Continue hypercare (bug SLA: Critical 30 min) | Somnath |
| Ops handover + admin SOPs | Somnath → Sarthak |
| Phase 8 exit review | Both |

---

## Post-launch — 90-day KPI (30 Nov 2026 – 28 Feb 2027)

| Frequency | Task | Who |
|-----------|------|-----|
| Weekly | Orders delivered vs 9,000 target | Sarthak |
| Weekly | Complaints, crashes, payment failures | Somnath |
| Monthly | Cloud/SMS/maps cost review | Somnath |
| 28 Feb 2027 | 90-day success review | Both |

---

## Standing responsibilities

### Sarthak (ongoing)

| When | Task |
|------|------|
| By 19 Jul | Sign requirements; deliver sample menu |
| By 26 Jul | Brand assets, legal policies, delivery rules |
| Weekly (from admin live) | Products, prices, offers, banners |
| 16–21 Nov | Full UAT execution + sign-off |
| From go-live | Daily order operations + COD reconciliation |

### Somnath (ongoing)

| When | Task |
|------|------|
| Daily (build) | Cursor sessions with `@efood-project-handler` |
| Per feature | Code → `@efood-code-review` → `@efood-git-manager` commit |
| Weekly | Update `PROJECT_PLAN.md` §7 |
| From go-live | Critical bugs 30 min · Normal 2 days |

---

## Critical path

```
Sarthak data (W1) → Seed catalog (W3) → Browse demo (W7)
Architecture (W2) → Auth (W4) → Orders (W8–11) → UAT (W19) → Go-live (W21)
Razorpay KYC (W2–10) → Live payments (W10+)
```

---

## Change Log

| Version | Date | Author | Summary |
|---------|------|--------|---------|
| 1.0 | 2026-07-13 | Somnath Das | Initial date-wise task plan |
