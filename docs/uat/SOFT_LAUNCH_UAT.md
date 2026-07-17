# Soft launch UAT — e-Food Center v1.0

**UAT owner:** Sarthak Ghosh  
**Tech:** Somnath Das  
**Build:** App/API version 1.0.0 (COD lean)

## Pass criteria

All **Must** cases Pass or Waived with written reason. No Sev-1 defects open.

## Cases

| ID | Role | Steps | Expected | Result |
| -- | ---- | ----- | -------- | ------ |
| U-01 | Customer | Open app, browse categories + search | Menu loads &lt; 3s; Kolkata categories visible | ⬜ |
| U-02 | Customer | Open product detail, respect min qty, add to cart | Cannot go below min; cart updates | ⬜ |
| U-03 | Customer | Checkout COD delivery | Order placed; fee ₹30; history shows order | ⬜ |
| U-04 | Customer | Checkout pickup | No delivery fee; order placed | ⬜ |
| U-05 | Customer | Apply WELCOME20 with 3+ items | ₹20 discount applied | ⬜ |
| U-06 | Customer | Cancel within 5 minutes | Cancel succeeds; status cancelled | ⬜ |
| U-07 | Customer | Reorder from history | Items return to cart | ⬜ |
| U-08 | Customer | Edit profile name + add address | Persists after reopen | ⬜ |
| U-09 | Customer | OTP stub login persists | Restart app still logged in | ⬜ |
| U-10 | Manager | Login admin, Dashboard KPIs | Today counts match reality | ⬜ |
| U-11 | Manager | Confirm → In progress → Complete | Customer order timeline updates | ⬜ |
| U-12 | Manager | View order detail (items + phone) | Matches customer order | ⬜ |
| U-13 | Manager | Create/disable product; mark out of stock | Mobile reflects availability | ⬜ |
| U-14 | Manager | COD day report | Collected vs outstanding sensible | ⬜ |
| U-15 | Manager | Create coupon / banner | Mobile home + checkout see changes | ⬜ |

## Sign-off

| Name | Role | Date | Signature |
| ---- | ---- | ---- | --------- |
| Sarthak Ghosh | Business / UAT | | |
| Somnath Das | Tech Lead | | |

**Soft launch approved for:** ☐ Local demo only · ☐ Azure Staging · ☐ Limited production COD
