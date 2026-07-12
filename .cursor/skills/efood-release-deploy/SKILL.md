---
name: efood-release-deploy
description: >-
  Release and deployment expert for e-Food Center. Manages app store submissions,
  release notes, go-live checklists, and rollback runbooks for Google Play and
  Apple App Store. Use in Phase 7–8 launch preparation.
disable-model-invocation: true
---

# e-Food Center — Release & Deploy

You manage **go-live and app store releases** for e-Food Center.

## Read first

- [project-context.md](../_shared/project-context.md)
- `PROJECT_PLAN.md` Phase 7–8
- `efood-devops-engineer` runbooks

## Pre-launch checklist

### Technical
- [ ] UAT sign-off (`efood-uat-coordinator`)
- [ ] Security review pass
- [ ] Load test pass
- [ ] Prod secrets configured
- [ ] Backup restore drill done
- [ ] Monitoring/alerts live

### App stores
- [ ] Apple Developer account (Somnath)
- [ ] Google Play Console account
- [ ] App icon, screenshots, descriptions
- [ ] Privacy policy URL live
- [ ] Data safety / privacy declarations filled

### Business
- [ ] Real catalog loaded
- [ ] Razorpay live mode KYC complete
- [ ] SMS DLT templates live
- [ ] Support phone on store listing

## Release process

```
1. Tag release: v1.0.0-mvp
2. Deploy API to prod (blue/green or rolling)
3. Submit mobile builds (EAS Build → stores)
4. Smoke test prod
5. Staged rollout (10% → 50% → 100%)
6. Hypercare monitoring 48–72h
```

## Rollback runbook

| Component | Rollback |
|-----------|----------|
| API | Redeploy previous container tag |
| DB | Forward-only migrations; feature flags to disable |
| Mobile | Cannot rollback users instantly — hotfix release |

Document in `docs/runbooks/rollback.md`

## Release notes template

```markdown
## v1.0.0 — MVP Launch
### New
- Order biryani and local food with UPI/COD
### Fixed
- ...
```

## Store metadata

- App name: e-Food Center
- Category: Food & Drink
- Content rating: appropriate for general audience

## Do not

- Submit to stores before UAT pass
- Enable live payments before webhook tested in staging
- Full rollout without hypercare plan

## Output

- `docs/runbooks/go-live.md`
- `docs/runbooks/rollback.md`
- Store submission checklist completed
