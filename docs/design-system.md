# e-Food Center — Design System (MVP tokens)

> **Status:** Proposed  
> **Use:** Mobile (React Native) + Admin (Tailwind) share the same semantic tokens  
> **Brand colors:** Finalize when Sarthak provides logo/palette

---

## Principles

1. One primary action per screen  
2. Body text ≥ 16sp / 16px  
3. High contrast (WCAG AA target)  
4. Icon + text label on all nav actions  
5. COD always visible when enabled  

---

## Color tokens (proposed)

| Token | Hex (draft) | Use |
|-------|-------------|-----|
| `--color-brand` | `#C45C26` | Primary CTAs (warm food orange — replace with brand) |
| `--color-brand-dark` | `#9A4518` | Pressed / header accent |
| `--color-surface` | `#FFF8F3` | App background (warm, light) |
| `--color-card` | `#FFFFFF` | List rows / panels |
| `--color-text` | `#1C1917` | Primary text |
| `--color-text-muted` | `#57534E` | Secondary text |
| `--color-border` | `#E7E5E4` | Dividers |
| `--color-success` | `#15803D` | Confirmed / delivered |
| `--color-warning` | `#B45309` | Pending / hold |
| `--color-error` | `#B91C1C` | Failed / cancelled |
| `--color-info` | `#1D4ED8` | Links / info |

> Avoid purple/indigo default themes. Final brand hexes TBD from Sarthak.

---

## Typography

| Role | Mobile | Admin web |
|------|--------|-----------|
| Display / brand | 28–32 / semibold | 28 / semibold |
| Screen title | 22 / semibold | 20 / semibold |
| Body | 16 / regular | 16 / regular |
| Caption | 13 / regular | 13 / regular |
| Price | 18 / bold | 16 / bold |

Prefer a readable sans with clear numerals (e.g. **Source Sans 3** or **DM Sans**) — not Inter/Roboto as the only choice if brand font is provided.

---

## Spacing & radius

- 4px grid: 4 / 8 / 12 / 16 / 24 / 32  
- Corner radius: 8–12px for interactive surfaces  
- Touch targets: ≥ 44×44  

---

## Core components

| Component | Used on |
|-----------|---------|
| `PrimaryButton` | Checkout, Add to cart, Confirm OTP |
| `SecondaryButton` | Cancel, Skip |
| `ProductTile` | Home list |
| `CategoryChip` | Home filters |
| `QtyStepper` | Detail, Cart (respects min_qty) |
| `PriceRow` | Cart, Checkout |
| `OrderTimeline` | Order detail / tracking |
| `StatusBadge` | Orders, Admin queue |
| `EmptyState` | Empty cart / no orders |
| `ErrorBanner` | Inline errors (not only modals) |
| `OTPInput` | Large digit boxes |
| `BottomTabBar` | Home / Orders / Profile / Cart |

---

## Motion (2–3 intentional)

1. Splash fade → home (300ms)  
2. Add-to-cart confirmation pulse on cart badge  
3. Order status step advance (timeline highlight)  

No decorative glow or heavy parallax.
