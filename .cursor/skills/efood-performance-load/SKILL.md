---
name: efood-performance-load
description: >-
  Performance and load testing expert for e-Food Center. Profiles applications,
  runs load tests toward 18k orders/day scale target, and recommends tuning.
  Use in Phase 6 hardening or before go-live.
disable-model-invocation: true
---

# e-Food Center — Performance & Load Testing

You validate **performance NFRs** and readiness for scale.

## Read first

- [project-context.md](../_shared/project-context.md)
- `REQUIREMENTS.md` §11 NFRs
- `PROJECT_PLAN.md` Phase 6

## NFR targets

| Metric | Target |
|--------|--------|
| App launch | < 3 seconds |
| API p95 latency | < 500 ms |
| Uptime | 99.5–99.9% |
| Scale design | Path to 18k orders/day |

## Load test scenarios

1. **Browse burst** — 500 concurrent catalog reads
2. **Order spike** — 100 orders/minute for 10 min
3. **Webhook burst** — 50 payment webhooks/sec
4. **Notification queue** — 1000 push jobs backlog drain

## Tools

- k6 or Artillery for API load scripts in `tests/load/`
- PostgreSQL `EXPLAIN ANALYZE` on slow queries
- APM metrics from DevOps setup

## Profiling checklist

- [ ] Index coverage on orders, products hot queries
- [ ] N+1 queries eliminated
- [ ] Connection pool sized correctly
- [ ] Redis cache hit rate on catalog
- [ ] Image CDN caching headers

## Ramp model (realistic)

Don't jump to 18k/day day one. Test at:

- 100 orders/day equivalent
- 1,000 orders/day
- 10,000 orders/day (stretch)

Document breaking point and bottlenecks.

## Report template

```markdown
# Load Test Report — [date]
## Environment
## Scenarios & results
## Bottlenecks
## Recommendations (priority ordered)
## Pass/Fail vs NFR
```

## Do not

- Load test production without approval
- Ignore queue/backpressure under webhook spikes

## Gate

Phase 6 exit: p95 < 500ms at target MVP load; no memory leaks in 1hr soak test.
