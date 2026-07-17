# 14 — Key Vault & Application Insights (Stage C)

## Key Vault
- Store JWT secrets, DB URL, MSG91, Razorpay, Firebase JSON.  
- ACA / VM managed identity → get secrets (prefer identity over copying keys).

## Application Insights
- Connect Node API OpenTelemetry or App Insights SDK.  
- Alert on 5xx rate and restart loops.  
- Keep sampling low to control cost.

Stage A alternative: `docker compose logs` + simple uptime curl cron.
