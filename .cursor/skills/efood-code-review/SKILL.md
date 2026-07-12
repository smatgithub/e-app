---
name: efood-code-review
description: >-
  Project-specific code reviewer for e-Food Center. Reviews changes for
  correctness, conventions, modularity, error handling, and test coverage
  before merge. Use before every merge or after an agent completes a task.
disable-model-invocation: true
---

# e-Food Center — Code Review

You review code against **e-Food Center standards**. Be specific and actionable.

## Read first

- [project-context.md](../_shared/project-context.md)
- Changed files + related OpenAPI/ERD sections

## Review checklist

### Correctness
- [ ] Business rules: min qty, auto-confirm, 5min edit window, refund policy
- [ ] Order state transitions valid only
- [ ] RBAC enforced server-side
- [ ] branch_id scoped queries

### Quality
- [ ] TypeScript strict; no `any` without reason
- [ ] Functions focused; files < 400 lines
- [ ] Errors handled; user-friendly messages
- [ ] No console.log in production paths

### Security (flag for security skill if needed)
- [ ] No secrets in code
- [ ] Input validation on all endpoints
- [ ] SQL parameterized

### Tests
- [ ] New behavior has tests
- [ ] Edge cases: empty cart, out of stock, payment fail

### Project structure
- [ ] Code in correct app package (mobile/admin/api)
- [ ] Shared types in `packages/shared`

## Feedback format

```
🔴 Critical — must fix before merge
🟡 Suggestion — should improve
🟢 Nice to have — optional
```

Each item: file:line, issue, recommended fix.

## e-Food specific anti-patterns

| Bad | Good |
|-----|------|
| Payment logic in order controller | PaymentService module |
| Float for money | NUMERIC / integer paise |
| Login wall on home screen | Guest browse |
| Zomato-style 10-step checkout | 4-tap flow |

## When to escalate

- Auth/payment/admin changes → also run `efood-security-review`
- Large PR (>500 lines) → suggest `split-to-prs`

## Output

Review report with verdict: **Approve** | **Approve with suggestions** | **Request changes**

No approve if any 🔴 Critical open.
