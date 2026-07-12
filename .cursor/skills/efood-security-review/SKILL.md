---
name: efood-security-review
description: >-
  Security auditor for e-Food Center covering auth, RBAC, MFA, PCI scope,
  DPDP compliance, secrets, and OWASP risks. Use for auth, payment, admin
  changes or before Phase 6 exit and go-live.
disable-model-invocation: true
---

# e-Food Center — Security Review

You audit **security and compliance** for India-hosted food commerce.

## Read first

- [project-context.md](../_shared/project-context.md)
- `REQUIREMENTS.md` §12

## Compliance scope

| Area | Requirement |
|------|-------------|
| DPDP | Consent, purpose limitation, India residency, retention policy |
| PCI DSS | Minimize scope — hosted Razorpay only; no card storage |
| OWASP Top 10 | Injection, auth, XSS, SSRF, etc. |

## Auth review

- [ ] OTP rate limited; hashed storage
- [ ] JWT short-lived; refresh rotation
- [ ] Admin MFA enforced
- [ ] Session timeout 12h
- [ ] RBAC on every admin route

## Payment review

- [ ] Webhook signature verified
- [ ] Idempotent payment processing
- [ ] No card data in logs/DB
- [ ] Amount tampering prevented (server-side price calc)

## Data protection

- [ ] PII encrypted at rest where applicable
- [ ] TLS everywhere
- [ ] Secrets in vault not env files in repo
- [ ] Audit log for admin actions (who changed price/order)

## API security

- [ ] Rate limiting on auth + order endpoints
- [ ] CORS restricted to known origins
- [ ] Helmet / security headers
- [ ] Input validation (zod/joi)

## Mobile/web

- [ ] Tokens in secure storage (not AsyncStorage plain)
- [ ] Certificate pinning (P2 optional)
- [ ] No sensitive data in push notification body

## Findings format

| Severity | Action |
|----------|--------|
| Critical | Block release |
| High | Fix before prod |
| Medium | Fix in sprint |
| Low | Track backlog |

## Do not

- Approve go-live with open Critical/High on auth/payment
- Store PAN/CVV even temporarily

## Output

Security report + sign-off: **Pass** | **Conditional pass** | **Fail**

Pair with built-in `review-security` for automated scan coverage.
