# 03 — Azure VM (Stage A production host)

## Purpose
Always-on India host for Docker Compose within **₹2–4k/month**.

## Create VM (portal or CLI)
1. Azure Portal → Virtual machines → Create  
2. **Region:** Central India or South India  
3. **Image:** Ubuntu 22.04/24.04 LTS  
4. **Size:** `Standard_B1s` or `Standard_B2ats_v2` (start smallest that fits RAM)  
5. **Auth:** SSH public key (disable password auth)  
6. **Disks:** Premium SSD if affordable; else Standard SSD ≥ 32 GB  
7. **Network:** allow **inbound 22** (your IP only), **80**, **443**. **Do not** open 5432/4000 publicly.

## After SSH
```bash
sudo apt update && sudo apt upgrade -y
# Install Docker Engine + compose plugin
sudo usermod -aG docker $USER   # re-login
git clone <your-repo> e-app && cd e-app
cp .env.example .env            # set strong secrets
docker compose up -d --build
```

## Cost controls
- Stop VM only for non-prod experiments (Prod stays on).  
- Azure Cost Management → budget alert at **₹5,000**.  
- Delete unused public IPs / disks.

## Checklist
- [ ] SSH key only  
- [ ] UFW or NSG: 22 restricted, 80/443 open  
- [ ] `.env` permissions `600`  
- [ ] `pg_dump` cron installed  
- [ ] Swap optional if B1s memory tight (1–2 GB)
