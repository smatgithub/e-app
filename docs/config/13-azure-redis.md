# 13 — Azure Cache for Redis (Stage C)

## Purpose
Queue (BullMQ) + cache when multi-instance API needs shared state.

## Steps
1. Create Basic C0 (or higher) in India.  
2. TLS + access key in Key Vault.  
3. Set `REDIS_URL` on API/worker.  
4. Move notification jobs off inline handlers.

**Not used in Stage A** (approved deferral).
