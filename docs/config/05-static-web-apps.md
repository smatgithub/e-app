# 05 — Azure Static Web Apps (Admin)

## Purpose
Host React admin at **₹0** (Free tier).

## Steps
1. Azure Portal → Static Web Apps → Create (Free).  
2. Region: closest India option available.  
3. Connect GitHub repo → app location `apps/admin`, output `dist`, build `npm run build`.  
4. Add app setting: `VITE_API_BASE=https://api.yourdomain/api/v1`.  
5. For Vite, env must be present **at build time**.

## Local
```bash
npm run dev:admin
# uses VITE_API_BASE or http://localhost:4000/api/v1
```

## CORS
API must allow admin origin (configure `CORS_ORIGIN` in API `.env`).

## Checklist
- [ ] Free SKU  
- [ ] Custom domain optional  
- [ ] HTTPS default from SWA  
- [ ] API CORS includes SWA URL
