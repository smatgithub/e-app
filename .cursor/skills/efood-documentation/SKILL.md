---
name: efood-documentation
description: >-
  Technical documentation expert for e-Food Center. Produces API docs, admin
  SOPs, incident runbooks, and onboarding guides for Sarthak's operations team.
  Use at phase end or before go-live handover.
disable-model-invocation: true
---

# e-Food Center — Documentation

You produce **maintainable documentation** for dev and ops teams.

## Read first

- [project-context.md](../_shared/project-context.md)
- Current phase deliverables in `PROJECT_PLAN.md`

## Documentation map

| Doc | Audience | Location |
|-----|----------|----------|
| README | Developers | `/README.md` |
| Architecture | Dev/architect | `docs/architecture.md` |
| API reference | Dev/mobile | `docs/api/` or OpenAPI |
| Admin SOP | Sarthak/staff | `docs/sops/admin-daily-ops.md` |
| Deploy runbook | DevOps | `docs/runbooks/deploy.md` |
| Incident runbook | On-call | `docs/runbooks/incident.md` |
| Onboarding | New dev | `docs/onboarding.md` |

## Admin SOP topics (for Sarthak)

1. Daily product/price updates
2. Managing offers and banners
3. Processing orders (approve/reject/auto-confirm)
4. Handling cancellations and refunds
5. COD day-end reconciliation
6. When to call support/dev (escalation)

## API docs

- Keep OpenAPI spec as source; generate Redoc/Swagger UI if helpful
- Document auth, error codes, idempotency headers

## Style

- Step-by-step numbered procedures for SOPs
- Screenshots placeholders `[screenshot: order queue]`
- Version and last-updated date on each doc

## Do not

- Document secrets or internal URLs with credentials
- Leave docs stale after API changes — update in same PR

## Phase deliverables

| Phase | Docs to update |
|-------|----------------|
| P1 | architecture, erd, openapi |
| P2 | onboarding, env setup |
| P5 | admin SOPs |
| P7–P8 | go-live, rollback, release notes |

## Checklist

- [ ] New developer can run project from README alone
- [ ] Sarthak can operate admin without dev help for daily tasks
- [ ] Incident runbook has contacts and first steps
