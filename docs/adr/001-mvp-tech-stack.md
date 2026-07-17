# ADR 001: MVP technology stack

- **Status:** Accepted
- **Date:** 2026-07-17
- **Deciders:** Somnath Das, Sarthak Ghosh
- **Notes:** Cloud locked to **Azure India** (D4/D18). API locked to **Express + TypeScript** (D2).

## Context

e-Food Center needs a production-ready B2C ordering platform (mobile + admin) for India, with OTP auth, Razorpay + COD, multi-branch readiness, and a path toward high daily order volume. Build skill is strongest in React/Node.

## Decision

| Layer | Choice |
|-------|--------|
| Mobile | React Native (Expo) |
| Admin / web | React + Tailwind |
| API | Node.js + Express (TypeScript), modular monolith |
| DB | PostgreSQL |
| Cache/jobs | Redis + BullMQ |
| Payments | Razorpay + COD |
| SMS | MSG91 |
| Push | FCM |
| Cloud | Azure (India region) |
| Region | India |

## Consequences

- One mobile codebase for iOS + Android  
- Parallel work once OpenAPI + ERD are locked  
- PCI scope minimized via hosted gateway  
- Microservices deferred until scale/ops demand  

## Alternatives considered

- Flutter — strong, but team React skill favors RN  
- Native iOS/Android — slower MVP  
- MongoDB — weaker fit for order/payment integrity  
- Stripe — weaker India UPI coverage vs Razorpay  
