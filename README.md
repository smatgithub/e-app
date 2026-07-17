# e-Food Center

B2C local food ordering platform — mobile app, web admin, and API.

## Start here

| Read first | Purpose |
|------------|---------|
| **[DOCUMENT_GUIDE.md](DOCUMENT_GUIDE.md)** | Which file to follow for what |
| **[DAILY_TASK_PLAN.md](DAILY_TASK_PLAN.md)** | **Today's tasks** by date and person |

## Documentation

| Document | Purpose | Update frequency |
|----------|---------|------------------|
| [DAILY_TASK_PLAN.md](DAILY_TASK_PLAN.md) | Date-wise tasks (Somnath / Sarthak) | Daily reference |
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | Phases, decisions, **progress tracker** §7 | Weekly (Somnath) |
| [REQUIREMENTS.md](REQUIREMENTS.md) | Business & functional requirements | On change |
| [SKILLS_REGISTRY.md](SKILLS_REGISTRY.md) | AI agent skills strategy | Reference |
| [SKILL_PREPARATION_PROGRESS.md](SKILL_PREPARATION_PROGRESS.md) | Skills creation status | Complete |
| [docs/architecture.md](docs/architecture.md) | System architecture (for approval) | On design change |
| [docs/wireframes/](docs/wireframes/) | MVP wireframes (for approval) | On UX change |
| [docs/APPROVAL_CHECKLIST.md](docs/APPROVAL_CHECKLIST.md) | Architecture + UX sign-off sheet | Review meeting |
| [docs/openapi.yaml](docs/openapi.yaml) | MVP API contract (source of truth) | Before endpoint changes |
| [docs/MONOREPO.md](docs/MONOREPO.md) | How to run mobile / admin / API | Daily build |
| [docs/azure-docker-cost.md](docs/azure-docker-cost.md) | **Lean** Azure+Docker cost (₹2–4k launch) | Budget / infra |

## Quick start — v0 (Docker Lean)

```bash
cp .env.example .env
npm install
npm run build:shared
npm run docker:up          # API :4000 + Postgres
curl -s http://localhost:4000/api/v1/health
```

Platform setup guides: **[docs/config/README.md](docs/config/README.md)** · Version notes: **[docs/VERSION_0.md](docs/VERSION_0.md)**

```bash
npm run dev:admin    # :5173
npm run dev:mobile   # Expo (Android-first)
```

## AI Skills

24 Cursor Agent Skills in `.cursor/skills/` for orchestrated development.

**Start a session:**

```
@efood-project-handler
Read PROJECT_PLAN.md and DAILY_TASK_PLAN.md. Current phase: P0.
```

## Team

- **Business owner / UAT:** Sarthak Ghosh
- **Tech lead:** Somnath Das

## Key dates

| Milestone | Date |
|-----------|------|
| Requirements sign-off | 19 Jul 2026 |
| Architecture + wireframes approved | 25 Jul 2026 |
| Go-live | 30 Nov 2026 |

## Status

Phase 1 nearly complete — decisions locked, OpenAPI + monorepo scaffolded. Next: Phase 2 (Postgres, real OTP/JWT, Staging).
