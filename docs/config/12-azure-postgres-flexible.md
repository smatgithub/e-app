# 12 — Azure Database for PostgreSQL Flexible (Stage C)

## Purpose
Managed Postgres with automated backups/HA when DIY VM DB is no longer enough.

## Steps
1. Create Flexible Server — India region.  
2. Start burstable SKU; private access preferred.  
3. Create DB `efood` + user.  
4. `pg_dump` from VM → restore to Flexible.  
5. Switch `DATABASE_URL` on ACA; verify app.  
6. Keep VM dump for one week as rollback.

## Checklist
- [ ] Backup retention set  
- [ ] Firewall / private endpoint  
- [ ] Restore tested once
