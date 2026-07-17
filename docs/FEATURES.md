# e-Food Center — Versioned Feature Backlog

> **Source of truth for what ships in which version.**  
> **Owner:** Somnath Das · **UAT:** Sarthak Ghosh  
> **Last updated:** 2026-07-17  
> **Release policy:** Features ship in versioned increments. **APK / Play release is separate** — not every feature version produces an APK.

**Status:** `🔲` Not started · `🔄` In progress · `✅` Done · `⏳` Blocked · `❌` Deferred

**Lean soft launch:** COD-only · Android-first · OTP stub until MSG91 · no Maps/Redis/managed DB/CDN/Razorpay until asked

---

## Version map

| Version | Theme | Status |
| ------- | ----- | ------ |
| **0.0.x** | Foundation | ✅ Closed |
| **0.1.0** | Customer app core | ✅ Closed |
| **0.2.0** | Order lifecycle polish | ✅ Done |
| **0.3.0** | Admin operations depth | ✅ Done |
| **0.4.0** | Coupons & banners | ✅ Done |
| **0.5.0** | Notification hooks | ✅ Done (FCM send deferred) |
| **0.6.0** | OTP hardening + MSG91 adapter | ✅ Done (live SMS deferred) |
| **0.7.0** | Azure lean deploy | ✅ Runbooks ready · ⏳ VM apply |
| **1.0.0** | Soft launch candidate | 🔄 UAT / infra gate |
| **R1…** | APK / Play | 🔲 On request |

---

## Feature checklist (soft launch)

### Customer
| ID | Feature | Status |
| -- | ------- | ------ |
| F-0101–08 | Detail, tabs, orders, profile, addresses, persist login, pickup | ✅ |
| F-0201 | Reorder | ✅ |
| F-0202 | Cart remove / min-qty | ✅ |
| F-0203 | Checkout COD summary + fees | ✅ |
| F-0206 | Guest browse | ✅ |
| F-0401 | Coupon WELCOME20 path | ✅ |
| F-0403 | Home banners | ✅ |
| F-0501 | Device token register | ✅ |
| F-1004 | Privacy / Terms + support contacts | ✅ |

### Admin
| ID | Feature | Status |
| -- | ------- | ------ |
| F-0007 / F-0303 | Product CRUD + stock/active | ✅ |
| F-0204 | Order detail | ✅ |
| F-0205 | Auto-confirm window visible | ✅ |
| F-0301 | Dashboard KPIs | ✅ |
| F-0302 | Users + role change | ✅ |
| F-0305 | COD day-end report | ✅ |
| F-0402 | Coupon admin | ✅ |
| F-0403 | Banner admin | ✅ |

### Platform
| ID | Feature | Status |
| -- | ------- | ------ |
| F-0502 | Notify log on status change | ✅ |
| F-0601 | MSG91 adapter (stub default) | ✅ |
| F-0602 | OTP rate limit | ✅ |
| F-0604 | Logout-all | ✅ |
| F-0701–04 | Soft-launch + Azure runbooks | ✅ Docs |
| F-1001 | UAT script | ✅ `docs/uat/SOFT_LAUNCH_UAT.md` |
| F-1002 | COD production config | ✅ Runbook env |

### Deferred past soft launch
Razorpay · Maps · Redis · CDN · iOS · live MSG91/FCM send · Play public · Franchise

---

## Active docs

| Doc | Purpose |
| --- | ------- |
| [VERSION_1.0.md](./VERSION_1.0.md) | Soft launch notes |
| [runbooks/soft-launch.md](./runbooks/soft-launch.md) | Ops checklist |
| [uat/SOFT_LAUNCH_UAT.md](./uat/SOFT_LAUNCH_UAT.md) | Sarthak UAT |

## Change log

| Date | Change |
| ---- | ------ |
| 2026-07-17 | Initial backlog |
| 2026-07-17 | Soft-launch push: 0.2–1.0 code + UAT/runbooks; Azure VM apply still pending |
