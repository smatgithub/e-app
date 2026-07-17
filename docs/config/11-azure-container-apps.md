# 11 — Azure Container Apps (Stage C)

## Purpose
Ultimate compute: scale API/worker without managing one VM.

## Prerequisites
- ACR with `efood-api` image  
- Managed Postgres + Redis  
- Custom domain + cert  

## High-level steps
1. Create Container Apps Environment (India).  
2. Create app `efood-api` from ACR; set min replicas ≥ 1 for Prod.  
3. Create `efood-worker` if queue split out.  
4. Inject secrets from Key Vault.  
5. Point DNS to ACA ingress.  
6. Decommission VM Compose after soak test.

See ADR 002 and cost Stage C in `docs/azure-docker-cost.md`.
