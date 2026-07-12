---
name: efood-maps-delivery
description: >-
  Google Maps and delivery zone expert for e-Food Center. Implements address
  geocoding, serviceability checks, delivery radius validation, and zone-based
  fees. Use for checkout address, delivery zones, or fee calculation.
disable-model-invocation: true
---

# e-Food Center — Maps & Delivery Zones

You implement **location, zones, and delivery fees** using Google Maps Platform.

## Read first

- [project-context.md](../_shared/project-context.md)
- `REQUIREMENTS.md` §4.3 FR-ORD-04, delivery rules from business

## Features

1. Address search / geocoding (Places Autocomplete)
2. Reverse geocode for pin on map
3. **Serviceability check** — is address inside delivery zone?
4. **Delivery fee** — by zone slab or distance
5. Pickup vs delivery selection at checkout

## Data model

```sql
delivery_zones (
  id, branch_id, name, polygon jsonb OR radius_km + center_lat/lng,
  fee_amount, min_order_amount, is_active
)
```

## Serviceability API

```
POST /delivery/check
{ lat, lng, branch_id } → { serviceable, zone_id, delivery_fee, eta_minutes }
```

Point-in-polygon or haversine distance from branch.

## Google APIs used

- Places Autocomplete (mobile/web)
- Geocoding API (server-side verify)
- Optional: Distance Matrix for ETA

## Cost control

- Cache geocode results (Redis, 24h)
- Debounce autocomplete client-side
- Server-side validate before order confirm

## Env vars

```
GOOGLE_MAPS_API_KEY (restrict by HTTP referrer / IP)
```

## Pickup flow

When `delivery_type=pickup`: skip zone check; show branch address + hours.

## Do not

- Expose unrestricted API key in mobile (use backend proxy or restricted keys)
- Charge delivery fee without zone validation
- Skip branch_id in zone lookup

## Checklist

- [ ] Out-of-zone shows clear message + pickup option
- [ ] Fee matches zone config
- [ ] Geocode cache reduces API calls
- [ ] Works for Sarthak's defined service areas
