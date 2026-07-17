# 02 — PostgreSQL (Compose / VM)

## Purpose
System of record for users, catalog, orders (Stage A: container on same host).

## Stage A setup
Provided by `docker-compose.yml` service `db` (Postgres 16).

| Setting | Dev default |
|---------|-------------|
| User | `efood` |
| Password | from `.env` `POSTGRES_PASSWORD` |
| DB | `efood` |
| Port (host) | `5432` (local only) |

Connection string:
```
DATABASE_URL=postgres://efood:CHANGE_ME@db:5432/efood
```
(From host machine to published port: use `localhost` instead of `db`.)

## Migrations
SQL files in `packages/api/migrations/` applied on API boot (v0) or via:
```bash
docker compose exec api node dist/migrate.js
```

## Backup (Prod VM — required)
Nightly on the VM:
```bash
docker compose exec -T db pg_dump -U efood efood | gzip > /backups/efood-$(date +%F).sql.gz
```
Keep 7–14 days; copy weekly to Azure Blob or another disk.

## Restore drill
```bash
gunzip -c backup.sql.gz | docker compose exec -T db psql -U efood efood
```
Document last successful restore date in ops notes.

## Stage C
Migrate to Azure Flexible Server — see [12-azure-postgres-flexible.md](./12-azure-postgres-flexible.md).
