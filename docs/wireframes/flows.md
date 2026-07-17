# Flow wireframes — Customer & Ops

## F1. Guest browse → login at checkout

```
[Splash] → [Home as Guest]
              │
              ├─ Product detail → Add to cart (allowed as guest)
              │
              └─ Cart → Checkout
                           │
                           ├─ Not logged in → [Login OTP] → back to Checkout
                           └─ Logged in → Select Delivery/Pickup → Pay → Confirmation
```

**Rules**

- Catalog & cart work without login  
- `Place order` requires verified phone  
- After OTP, return to same checkout (do not wipe cart)

---

## F2. Happy path (logged-in)

```
Home → Product → Cart → Checkout → Payment → Order Confirmed → Track
```

Target: **≤ 4 taps** from Home to Place order (excluding typing address/OTP).

---

## F3. Payment failed

```
Checkout → Razorpay fail → Order = PaymentFailed (hold 15 min)
         → Show "Retry payment" + countdown
         → Success → resume lifecycle
         → Timeout → Cancelled + notify
```

---

## F4. Auto-confirm vs manager

```
Order Placed
   │
   ├─ Within auto-confirm window (e.g. 6am–3pm) → Confirmed (system)
   └─ Outside window → Pending in Admin queue → Manager Approve / Reject
```

Manager can cancel auto-approved orders per policy.

---

## F5. Staff fulfillment

```
Admin Order Queue
  → Confirm (if pending)
  → Mark In progress
  → Assign delivery person (if delivery)
  → Mark Completed
  → COD: enter collected amount → day-end report
```
