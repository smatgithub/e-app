# 15 — Blob Storage & CDN (Stage C)

## Purpose
Product images at scale + optional CDN.

## Stage A
Store images on VM disk or single Storage account container (Hot) without CDN.

## Stage C
1. Storage account (India) → container `products`.  
2. SAS or app upload via API.  
3. Optional Azure CDN / Front Door when traffic grows.  
4. Keep public read on product images only — never on private data.
