# e-Food Center — Which Files to Follow

> **Read this first.** It tells you which document to use for what, and in what order.

---

## Quick answer — 3 files for daily work

| Priority | File | Who | When |
|----------|------|-----|------|
| **1** | `DAILY_TASK_PLAN.md` | Both | **Every day** — what to do today and this week |
| **2** | `PROJECT_PLAN.md` §7 | Somnath | **Every week** — update progress status |
| **3** | `REQUIREMENTS.md` | Both | **When building or deciding** — what the app must do |

---

## All project documents

| # | File | Purpose | Who follows | When to open |
|---|------|---------|-------------|--------------|
| 1 | **`DOCUMENT_GUIDE.md`** | This file — navigation map | Both | First time + when lost |
| 2 | **`DAILY_TASK_PLAN.md`** | Date-wise tasks by person | **Both — daily** | Every morning |
| 3 | **`PROJECT_PLAN.md`** | Phases, decisions, risks, **progress tracker** | Somnath (weekly) | Monday status + phase gates |
| 4 | **`REQUIREMENTS.md`** | Business rules, features, UAT criteria | Both | Before any feature work |
| 5 | **`SKILLS_REGISTRY.md`** | AI agent strategy + skill list | Somnath | When starting Cursor sessions |
| 6 | **`SKILL_PREPARATION_PROGRESS.md`** | Skills creation status | Somnath | Reference only (complete) |
| 7 | **`README.md`** | Project overview + quick links | Both | Onboarding |

---

## Workflow by role

### Somnath (Tech lead) — daily routine

```
1. Open DAILY_TASK_PLAN.md → check TODAY + this week
2. Start Cursor: @efood-project-handler + read PROJECT_PLAN.md §7
3. Build using skills from SKILLS_REGISTRY.md
4. Before commit: @efood-git-manager + @efood-code-review
5. Friday: update PROJECT_PLAN.md §7 (phase %, milestones, weekly log)
```

### Sarthak (Business owner) — daily routine

```
1. Open DAILY_TASK_PLAN.md → find tasks marked "Sarthak"
2. Deliver data/assets by due dates in the plan
3. For UAT (Nov 2026): follow REQUIREMENTS.md §15.2 checklist
4. Sign-off: REQUIREMENTS.md §15.3 when asked
```

---

## Workflow by project phase

| Phase | Primary files | Secondary files |
|-------|---------------|-----------------|
| **P0 Discovery** (now) | `DAILY_TASK_PLAN.md` W1–W2 | `REQUIREMENTS.md`, `PROJECT_PLAN.md` §4–5 |
| **P1 Architecture** | `PROJECT_PLAN.md` §6 P1 | `REQUIREMENTS.md` §6–8, skills: `efood-platform-architect` |
| **P2–P5 Build** | `DAILY_TASK_PLAN.md` (weekly) | `REQUIREMENTS.md` §4, `docs/openapi.yaml` (when created) |
| **P6 Hardening** | `PROJECT_PLAN.md` §6 P6 | `REQUIREMENTS.md` §11 NFRs |
| **P7 UAT** | `REQUIREMENTS.md` §15 | `docs/uat/uat-script.md` (when created) |
| **P8 Go-live** | `DAILY_TASK_PLAN.md` W21–22 | `docs/runbooks/go-live.md` (when created) |

---

## AI skills location

Skills live in `.cursor/skills/` — not markdown docs at repo root.

| Start every session | `@efood-project-handler` |
| Before git commit | `@efood-git-manager` |
| Full skill list | `SKILLS_REGISTRY.md` §9 |

Shared context for all skills: `.cursor/skills/_shared/project-context.md`

---

## Document hierarchy (what overrides what)

```
REQUIREMENTS.md          ← Business truth (what to build)
    ↓
PROJECT_PLAN.md        ← How and when to build + tracker
    ↓
DAILY_TASK_PLAN.md     ← Who does what on which date
    ↓
docs/openapi.yaml      ← API contract (when created)
docs/architecture.md   ← Technical design (when created)
```

If dates conflict: **`PROJECT_PLAN.md` §6.9 realistic timeline** overrides old dates in `REQUIREMENTS.md` §14.1.

---

## Files to create during build (not yet present)

| File | Created in phase | Owner |
|------|------------------|-------|
| `docs/architecture.md` | P1 | Somnath |
| `docs/erd.md` | P1 | Somnath |
| `docs/openapi.yaml` | P1 | Somnath |
| `docs/wireframes/` | P1 | Somnath |
| `docs/uat/uat-script.md` | P7 | Somnath |
| `docs/runbooks/go-live.md` | P7 | Somnath |

---

## One-page cheat sheet

| I want to… | Open this file |
|------------|----------------|
| Know what to do **today** | `DAILY_TASK_PLAN.md` |
| Update project **status** | `PROJECT_PLAN.md` §7 |
| Check a **business rule** | `REQUIREMENTS.md` |
| See **open decisions** | `PROJECT_PLAN.md` §4 |
| See **what data Sarthak owes** | `PROJECT_PLAN.md` §5 |
| Start **Cursor AI coding** | `SKILLS_REGISTRY.md` + `@efood-project-handler` |
| Understand **phase gates** | `PROJECT_PLAN.md` §6 |
| **Sign off** requirements/UAT | `REQUIREMENTS.md` §15.3 |

---

## Change Log

| Version | Date | Author | Summary |
|---------|------|--------|---------|
| 1.0 | 2026-07-13 | Somnath Das | Initial document navigation guide |
