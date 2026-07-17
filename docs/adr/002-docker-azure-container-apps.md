# ADR 002: Docker on Azure Container Apps (Stage C — scale path)

- **Status:** Accepted as **future scale target** (not launch)
- **Date:** 2026-07-17
- **Launch override:** See **ADR 003** (Lean VM + Compose) for Stage A/B
- **Deciders:** Somnath Das

## Context

Managed ACA + Flexible Server + Redis is the right long-term Azure shape, but too expensive as a startup launch quote.

## Decision (when Stage C triggers)

- Package **API** and **worker** as Docker images on **Azure Container Apps**.
- **Azure Database for PostgreSQL Flexible Server** + **Azure Cache for Redis**.
- ACR, Key Vault, Blob, App Insights as needed.

## Trigger to adopt

- One VM CPU/RAM/disk saturated, or
- Need multi-instance / near-zero RPO HA, or
- Monthly revenue comfortably covers ₹15k+ infra.

## Launch path

Use ADR 003 until a trigger above is met. Cost sheet: `docs/azure-docker-cost.md`.
