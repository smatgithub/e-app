# 04 — Domain & HTTPS (Caddy)

## Purpose
Public HTTPS for API (and optional admin reverse-proxy) on the VM — ₹0 certs.

## DNS
1. Buy/use domain (e.g. `efood.example.in`).  
2. A record: `api.yourdomain` → VM public IP.  
3. Optional: `admin.yourdomain` → Azure Static Web Apps (CNAME from SWA).

## Caddy (recommended on VM)
Install Caddy; `Caddyfile` example:

```
api.yourdomain {
  reverse_proxy api:4000
}
```

Run Caddy in Compose (add service) or as host systemd. Let’s Encrypt is automatic.

## Alternative
Nginx + Certbot — same result, more steps.

## Checklist
- [ ] DNS propagated  
- [ ] `https://api.yourdomain/api/v1/health` returns OK  
- [ ] HTTP redirects to HTTPS
