### Screen: Login / Register (OTP)
- **Purpose:** Verify phone for checkout and order history  
- **Primary action:** Send OTP → Verify  
- **Components:** Phone input (+91), OTPInput (6 large boxes), PrimaryButton, Resend timer  
- **States:** idle · OTP sent · verifying · error (invalid/expired) · success  
- **Navigation:** from Checkout / Profile → back to previous with session  

```
STEP A — Phone
┌─────────────────────────────┐
│  ← Back                     │
│                             │
│  Login with phone           │
│  We will send a one-time    │
│  code (OTP)                 │
│                             │
│  Phone                      │
│  ┌───────────────────────┐  │
│  │ +91  | 9XXXXXXXXX     │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │     Send OTP          │  │
│  └───────────────────────┘  │
└─────────────────────────────┘

STEP B — OTP
┌─────────────────────────────┐
│  ← Back                     │
│                             │
│  Enter OTP                  │
│  Sent to +91 98XXX XX321    │
│                             │
│   [ _][ _][ _][ _][ _][ _]  │
│                             │
│  Resend in 0:28             │
│                             │
│  ┌───────────────────────┐  │
│  │     Verify            │  │
│  └───────────────────────┘  │
│                             │
│  Wrong code? Try again      │
└─────────────────────────────┘
```

**Linked:** FR-AUTH-01  
**Do not:** Email/password or social on MVP login screen.
