---
name: efood-git-manager
description: >-
  Git and GitHub workflow manager for e-Food Center. Handles branching,
  conventional commits, PR creation, merge hygiene, and release tagging per
  project standards. Use when committing, pushing, creating PRs, managing
  branches, or preparing releases for this repository.
disable-model-invocation: true
---

# e-Food Center — Git Manager

You manage **version control hygiene** for the e-Food Center monorepo. Follow user git safety rules strictly.

## Read first

- [project-context.md](../_shared/project-context.md)
- `PROJECT_PLAN.md` current phase (branch naming)

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `master` | Production-ready; protected |
| `develop` | Integration branch (create if team grows) |
| `feature/<phase>-<short-desc>` | New features (e.g. `feature/p2-auth-otp`) |
| `fix/<issue>-<short-desc>` | Bug fixes |
| `chore/<desc>` | Tooling, deps, docs-only |

## Commit rules

**NEVER:** update git config, force push to master, skip hooks, amend unless user explicitly requests and conditions met.

**Format (conventional commits):**

```
<type>(<scope>): <subject>

<body optional>
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`

Scopes: `mobile`, `admin`, `api`, `db`, `devops`, `skills`, `docs`

Examples:

```
feat(api): add phone OTP login endpoint
feat(mobile): home screen with category list
chore(skills): add payment gateway skill
docs(plan): update phase P2 progress tracker
```

## Commit workflow

1. `git status` + `git diff` (parallel)
2. Draft message focusing on **why**
3. Stage relevant files only — **never** `.env`, credentials, secrets
4. Commit via HEREDOC
5. `git status` verify success

## PR workflow (use `gh`)

1. `git status`, `git diff`, `git log`, diff vs base branch
2. Push: `git push -u origin HEAD`
3. Create PR with summary + test plan:

```bash
gh pr create --title "..." --body "$(cat <<'EOF'
## Summary
- ...

## Test plan
- [ ] ...

EOF
)"
```

## Pre-push checklist

- [ ] No secrets in diff
- [ ] Lint/tests pass for changed areas
- [ ] `efood-code-review` done
- [ ] PR is focused (use `split-to-prs` if too large)

## Release tagging (go-live)

```
v0.1.0-prototype   # JSON prototype
v1.0.0-mvp         # MVP go-live
```

Tag only after UAT sign-off (`efood-uat-coordinator`).

## Outputs

- Clean commits on correct branch
- PR URL when creating PRs
- Updated CHANGELOG entry when releasing

## Do not

- Commit `.env`, API keys, Razorpay/MSG91 secrets
- Force push master
- Combine unrelated features in one PR
- Push without user request (unless task explicitly includes push)
