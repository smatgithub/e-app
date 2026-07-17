# e-Food Center — Wireframes (MVP) for Approval

> **Status:** Proposed for approval  
> **Version:** 0.1  
> **Target review:** 25 Jul 2026  
> **UX rule:** Simpler than Zomato — few taps to order  
> **Design tokens:** `docs/design-system.md`

---

## Screen index (REQUIREMENTS §6)

| # | Screen | File | Role | Primary action |
|---|--------|------|------|----------------|
| 1 | Splash / Onboarding | [01-splash-onboarding.md](./01-splash-onboarding.md) | All | Skip / Continue |
| 2 | Login / OTP | [02-login-otp.md](./02-login-otp.md) | Customer / Staff | Verify OTP |
| 3 | Home | [03-home.md](./03-home.md) | Customer | Browse / Search |
| 4 | Product detail | [04-product-detail.md](./04-product-detail.md) | Customer | Add to cart |
| 5 | Cart / Checkout | [05-cart-checkout.md](./05-cart-checkout.md) | Customer | Place order |
| 6 | Order history & track | [06-order-history.md](./06-order-history.md) | Customer | Track / Reorder |
| 7 | Profile | [07-profile.md](./07-profile.md) | Customer | Edit details |
| 8 | Admin dashboard | [08-admin-dashboard.md](./08-admin-dashboard.md) | Manager / Admin | Manage ops |

### Extra ops screens (needed for MVP ops, expand §6)

| # | Screen | File |
|---|--------|------|
| 8a | Admin order queue | [08a-admin-order-queue.md](./08a-admin-order-queue.md) |
| 8b | Admin product manage | [08b-admin-products.md](./08b-admin-products.md) |

### Key flows

| Flow | File |
|------|------|
| Guest browse → login at checkout | [flows.md](./flows.md) |
| Order fulfillment (staff) | [flows.md](./flows.md) |

---

## How to review (Sarthak + Somnath)

For each screen, confirm:

1. **Purpose** is clear for less-educated customers  
2. **Primary button** is obvious  
3. **Prices / COD / status** are never hidden  
4. No extra features beyond MVP  
5. Language: English first; local language toggle placeholder OK  

Mark approval on `docs/APPROVAL_CHECKLIST.md`.

---

## Device frames

- **Mobile:** 375 × 812 (iPhone-class)  
- **Admin:** 1280 × 800 desktop  
