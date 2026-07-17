# ADR 003: Lean Launch on Azure VM + Docker (cost-first)

- **Status:** Accepted
- **Date:** 2026-07-17
- **Supersedes for launch:** ADR 002 (ACA + managed DB) — **retained as Stage C target**
- **Deciders:** Somnath Das; business cost constraint (startup)

## Context

Full managed Azure (Container Apps + Flexible Server + Redis + CDN) produces a monthly bill stakeholders will reject for a startup. Need near-free start, always-on API, stable basic UI, and cheapest payments first.

## Decision

1. **Stage A/B (now):** One **Azure Linux VM** (India) running **Docker Compose** (`api` + `postgres`). Admin on **Static Web Apps Free**.
2. **Payments:** **COD only** at launch; **Razorpay** later (no monthly fee — % of GMV).
3. **Skip until requested:** Maps, Redis, managed Postgres, ACR, Front Door, email, WhatsApp, multi-AZ HA.
4. **Notifications:** FCM free; SMS OTP minimal (MSG91 pay-as-you-go).
5. **Stage C:** Move to ADR 002 pattern (ACA + managed data) when one VM is insufficient or revenue justifies.

## Consequences

- Monthly infra can sit near **₹2–4k** (plus tiny SMS).
- Ops is DIY (backups, patches) — acceptable for MVP with runbook.
- Architecture stays modular so Stage C migration is additive, not a rewrite.

## Rejected for launch

- Presenting ₹15k–25k “enterprise” Azure as the starting ask
- Free App Service F1 for Prod (sleeps → app stops)
- Paying for Razorpay/Maps/Redis before stakeholders need them
