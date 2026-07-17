# 06 — GitHub

## Purpose
Source of truth + future CI deploy to VM / Stage C.

## Repo
- Remote: `https://github.com/smatgithub/e-app.git` (or current origin)  
- Default branch: `main`  
- Protect `main`: PR + review before prod deploy (when team > 1)

## Secrets (GitHub Actions — later)
| Name | Use |
|------|-----|
| `VM_SSH_KEY` | Deploy over SSH |
| `VM_HOST` | VM IP/DNS |
| `EXPO_TOKEN` | EAS builds |

## v0 (manual deploy OK)
```bash
ssh user@vm 'cd e-app && git pull && docker compose up -d --build'
```

## Checklist
- [ ] `.env` in `.gitignore`  
- [ ] No Firebase/Play JSON committed  
- [ ] Branch naming: `feature/*`, `fix/*`
