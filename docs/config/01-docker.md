# 01 — Docker & Docker Compose

## Purpose
Run API + PostgreSQL identically on laptop and Azure VM (Stage A).

## Install
- macOS: Docker Desktop  
- Azure VM (Ubuntu): follow [Docker Engine install](https://docs.docker.com/engine/install/ubuntu/) + Docker Compose plugin  

```bash
docker --version
docker compose version
```

## Repo files
| File | Role |
|------|------|
| `docker-compose.yml` | `api` + `db` services |
| `packages/api/Dockerfile` | Production API image |
| `.env.example` | Compose env template |

## Local commands
```bash
cp .env.example .env
docker compose up -d --build
curl -s http://localhost:4000/api/v1/health
docker compose logs -f api
docker compose down
```

## Rules
- Do not bind Postgres `5432` to public internet on the VM (Compose exposes only on localhost or Docker network).
- Tag images: `efood-api:v0`, `efood-api:latest`.
- Never bake secrets into the image; pass via env.
