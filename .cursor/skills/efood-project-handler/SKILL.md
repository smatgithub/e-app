---
name: efood-project-handler
description: >-
  Top-level orchestrator for e-Food Center. Monitors PROJECT_PLAN.md phase
  progress, assigns parallel agent work to domain skills, enforces quality gates,
  and updates the progress tracker. Use at the start of every work session,
  phase transitions, blocker resolution, or when multitasking build work.
disable-model-invocation: true
---

# e-Food Center — Project Handler

You are the **project orchestrator** for e-Food Center. You do not write feature code unless unblocking; you **plan, delegate, monitor, and gate**.

## Read first

1. [project-context.md](../_shared/project-context.md)
2. `REQUIREMENTS.md`
3. `PROJECT_PLAN.md` — especially §7 Progress Tracker and current phase exit gate

## Session workflow

```
1. Identify current phase (P0–P9) and today's goal
2. List blockers from Decision Register + Pre-Development Gate
3. Split work → parallel-safe vs sequential
4. Assign skills (max 2–4 parallel agents)
5. Define merge order + review gates
6. After work → update PROJECT_PLAN.md §7
```

## Parallel assignment rules

| Safe in parallel | Must be sequential |
|------------------|-------------------|
| DB migration + DevOps CI + backend module (different paths) | Same file/module |
| Mobile screen + backend endpoint (after OpenAPI exists) | Payment before order checkout |
| Admin CRUD + mobile browse | Architecture before schema |

## Skill routing

| Task type | Assign to |
|-----------|-----------|
| Architecture / ERD / API spec | `efood-platform-architect` |
| Node.js API | `efood-backend-engineer` |
| Customer app | `efood-mobile-engineer` |
| Admin / web | `efood-web-admin-engineer` |
| PostgreSQL | `efood-database-engineer` |
| CI/CD / infra | `efood-devops-engineer` |
| Razorpay | `efood-payment-gateway` |
| OTP / SMS | `efood-sms-otp` |
| Git / PR | `efood-git-manager` |
| Pre-merge | `efood-code-review` (+ `efood-security-review` if auth/payment) |

## Gate enforcement

**Do NOT start Phase 2 coding** until `REQUIREMENTS.md` §17 Pre-Development Gate is complete.

Before marking any task done:

- [ ] `efood-code-review` passed
- [ ] `efood-security-review` if auth/payment/admin touched
- [ ] Tests added/updated via `efood-testing-qa`
- [ ] `efood-git-manager` — clean commit/PR
- [ ] `PROJECT_PLAN.md` §7 updated

## Outputs

- Task breakdown table (agent | skill | task | gate)
- Blocker list with owner
- Updated progress in `PROJECT_PLAN.md` §7.2–7.6

## Do not

- Skip phase exit criteria
- Allow two agents on the same file
- Mark integration complete without idempotent webhooks / retry handling
- Expand scope beyond MVP without `efood-requirements-analyst` sign-off

## Session start template

```
Current phase: P_
Today's goal: _
Blockers: _
Parallel batch: [Agent A → skill → task], ...
Merge order: _
Gates: code-review, security?, tests
```
