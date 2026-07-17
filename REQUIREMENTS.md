# Mobile Application — Requirements Document

> **Purpose:** Living document to capture, update, and sign off all business and technical requirements for the commercial mobile application.  
> **Status:** Draft  
> **Last updated:** *YYYY-MM-DD*  
> **Updated by:** *Name*  
> **Version:** 0.1

---

## Document Control


| Field                   | Value         |
| ----------------------- | ------------- |
| Project name            | Food Center   |
| Client / business owner | Sarthak Ghosh |
| Prepared by             | Somnath Das   |
| Reviewed by             | Sarthak Ghosh |
| Approved by             | Sarthak Ghosh |
| Approval date           |               |
| Next review date        |               |


### Change Log


| Version | Date | Author | Summary of change        |
| ------- | ---- | ------ | ------------------------ |
| 0.1     |      |        | Initial template created |


---

## 1. Executive Summary

### 1.1 Business Overview


| Item                              | Details       |
| --------------------------------- | ------------- |
| Business name                     | e-Food Center |
| Legal entity                      |               |
| Industry / sector                 |               |
| Locations (cities, branches)      |               |
| Website / existing systems        |               |
| Primary contact person            |               |
| will help t Contact email / phone |               |


### 1.2 Problem Statement

*In a place there is a food center where Beriyani and other food items. Customer need to physically come to buy the product. It will be veryusefull if there is a shortcut to make the purchase easy and immediate. It can help to increase the sale imediately. Most verified approach we need to take to address the problem like miscall service or whatsapp service or mobile app service or a combined solution.*

### 1.3 App Objective

*One clear statement: Business will be reachable to all the local customers.*

### 1.4 Success Metrics (KPIs)


| Metric              | Target  | Measurement method |
| ------------------- | ------- | ------------------ |
| Uptime              | 100%    | Application        |
| Successful delivery | 1st 100 | DB secord          |


### 1.5 Reference Apps / Competitors


| App name | What they like                                    | What to avoid                                                                                                                                          |
| -------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Zomato   | cover complex item and customer base and engaging | The apps are not so simple. As we are creating and covering less items we need to make it very simple. Only a few taps to confirm orders and easy flow |


---

## 2. Scope

### 2.1 In Scope

- [x] 

- Application uptime, security, speed, scalability.

### 2.2 Out of Scope

- [ ] 

- Not defined yet.

### 2.3 Assumptions


| #   | Assumption                           | Owner   | Valid until |
| --- | ------------------------------------ | ------- | ----------- |
| 1   | Adding more business verticles in it | Somnath |             |


### 2.4 Dependencies


| #   | Dependency | Owner | Status                       |
| --- | ---------- | ----- | ---------------------------- |
| 1   |            |       | Pending / In progress / Done |


### 2.5 Risks & Open Questions


| #   | Risk / question                                                                             | Impact              | Mitigation / answer needed by                      |
| --- | ------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------- |
| 1   | i have never prepared such production app yet. So we need to be carefull to be successfull. | High / Medium / Low | Cursor need to help me to pass all the test cases. |


---

## 3. Users & Roles

### 3.1 User Types


| User type        | Description                                                    | Registration method        | Guest access allowed? |
| ---------------- | -------------------------------------------------------------- | -------------------------- | --------------------- |
| Customer         | mostly uneducated or less educated hardworking persons.        | Phone OTP / Email / Social | Yes / No              |
| Staff            | educated unemployed who will handle order or delivery boys     |                            |                       |
| Manager          | take care the order frequency and price and delivery decission |                            |                       |
| Admin            | control platform and easiness, marketing and campaign          |                            |                       |
| Vendor / Partner |                                                                |                            |                       |


### 3.2 Role–Permission Matrix


| Feature / action      | Customer | Staff | Manager | Admin |
| --------------------- | -------- | ----- | ------- | ----- |
| View catalog          | yes      | yes   | yes     | yes   |
| Place order / booking | yes      | no    | no      | no    |
| Approve / reject      | no       | no    | yes     | yes   |
| Manage products       | no       | no    | yes     | yes   |
| View reports          | no       | no    | yes     | yes   |
| Manage users          | no       | no    | no      | yes   |


### 3.3 Multi-Branch / Franchise


| Item                           | Details                                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Single or multi-branch?        | multi branch, too addredd other solutions like retail business, green veg shop, household items          |
| Branch selection by user?      | yes, but we are not creating the verticle immediately, need to keep the scope created to add meeidately. |
| Separate inventory per branch? | Yes                                                                                                      |
| Franchise / white-label needs? | Not Now but it may be required later.                                                                    |


---

## 4. Functional Requirements

> Mark each item: **MVP** | **Phase 2** | **Not needed**

### 4.1 Authentication & Onboarding


| ID         | Requirement                        | Priority | Status  | Notes |
| ---------- | ---------------------------------- | -------- | ------- | ----- |
| FR-AUTH-01 | Login via phone OTP                | MVP      | Pending |       |
| FR-AUTH-02 | Login via email/password           | 1        | Pending |       |
| FR-AUTH-03 | Social login (Google / Apple)      | 1        | Pending |       |
| FR-AUTH-04 | Forgot password / account recovery | 1        | Pending |       |
| FR-AUTH-05 | Profile creation / edit            | 2        | Pending |       |


**Business rules:**

- 

**Acceptance criteria:**

- 

---

### 4.2 Catalog / Content


| ID        | Requirement                                 | Priority | Status  | Notes |
| --------- | ------------------------------------------- | -------- | ------- | ----- |
| FR-CAT-01 | Product / service listing                   | MVP      | Pending |       |
| FR-CAT-02 | Categories and subcategories                | 1        | Pending |       |
| FR-CAT-03 | Search and filters                          | 2        | Pending |       |
| FR-CAT-04 | Product detail (images, price, description) | 1        | Pending |       |
| FR-CAT-05 | Variants (size, color, etc.)                | 3        | Pending |       |
| FR-CAT-06 | Stock / availability display                | 1        | Pending |       |
| FR-CAT-07 | Favorites / wishlist                        | 1        | Pending |       |


**Sample data fields required from business:**


| Field                    | Required | Example |
| ------------------------ | -------- | ------- |
| SKU / code               | Yes      |         |
| Name                     | Yes      |         |
| Category                 | Yes      |         |
| Price                    | Yes      |         |
| Tax %                    | Yes      |         |
| Images                   | Yes      |         |
| Description              | Yes      |         |
| Status (active/inactive) | Yes      |         |


---

### 4.3 Cart / Booking / Inquiry


| ID        | Requirement                         | Priority        | Status  | Notes                                                                  |
| --------- | ----------------------------------- | --------------- | ------- | ---------------------------------------------------------------------- |
| FR-ORD-01 | Add to cart / book service          | MVP             | Pending |                                                                        |
| FR-ORD-02 | Edit quantity / reschedule          | 1               | Pending | within 5 min of order creation or before the delivery out confirmation |
| FR-ORD-03 | Apply coupon / discount             | yes. Priority 1 | Pending |                                                                        |
| FR-ORD-04 | Delivery / pickup / visit selection | Yes, Priority 1 | Pending |                                                                        |
| FR-ORD-05 | Order / booking confirmation        | Yes, Priority 1 | Pending |                                                                        |
| FR-ORD-06 | Order / booking history             | Yes, Priority 1 | Pending |                                                                        |
| FR-ORD-07 | Cancel / reschedule rules           | Yes, Priority 1 | Pending |                                                                        |
| FR-ORD-08 | Invoice / receipt download          | Yes, Priority 1 | Pending | print through POS. and other printer.                                  |


**Order / booking lifecycle:**

```
[Placed] → [Confirmed] → [In progress] → [Completed] → [Closed]
                ↓
           [Cancelled / Refunded]
```

**Business rules:**


| Rule                 | Details                                                                                                                                                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Minimum order value  | Item Specific, Ex: Biriyani min 1 qty, Momos min 2 qty                                                                                                                                                                                                                                                                         |
| Cancellation window  | For now it will not be disabled but later we will enable it with the feature wher the time can be configured.                                                                                                                                                                                                                  |
| Refund policy        | Only a min costing will be deducted. like ₹1 or ₹2                                                                                                                                                                                                                                                                             |
| Who confirms orders? | Auto confiration enabek and disable option will be there. Manager can enable auto confirmation from morning 6am to 3pm, upto the preparation start. One preparation started he have to decide if heh can serve the oordrt or not for that time he can manually approve the order as wel as can cancel any auto approved order. |
| SLA for confirmation | add a input for configagration                                                                                                                                                                                                                                                                                                 |


---

### 4.4 Payments


| ID        | Requirement                          | Priority        | Status  | Notes                                                                                |
| --------- | ------------------------------------ | --------------- | ------- | ------------------------------------------------------------------------------------ |
| FR-PAY-01 | Online payment (UPI / card / wallet) | Yes, Priority 1 | Pending |                                                                                      |
| FR-PAY-02 | Cash on delivery (COD)               | Yes, Priority 1 | Pending | Need to track in the dayend who delivered the order and how much collection is done. |
| FR-PAY-03 | Partial / advance payment            | No advance.     | Pending | will be added later if required                                                      |
| FR-PAY-04 | Refund initiation                    | Yes             | Pending |                                                                                      |
| FR-PAY-05 | Payment history                      | Yes             | Pending |                                                                                      |



| Item                   | Decision                                        |
| ---------------------- | ----------------------------------------------- |
| Payment gateway        | Razorpay / Stripe / Other:                      |
| Gateway account owner  | Business / Developer/Manager                    |
| Refund process owner   | Manager                                         |
| PCI / compliance notes | Not decided yet. Need to understand and review. |


---

### 4.5 Notifications & Communication


| ID        | Requirement                       | Priority                            | Status  | Notes                                                         |
| --------- | --------------------------------- | ----------------------------------- | ------- | ------------------------------------------------------------- |
| FR-NOT-01 | Push notifications (order status) | MVP                                 | Pending |                                                               |
| FR-NOT-02 | SMS notifications                 | required                            | Pending |                                                               |
| FR-NOT-03 | Email notifications               | priority 2                          | Pending | Need to be configured to enable for disable userwise settings |
| FR-NOT-04 | In-app announcements / banners    | Priority 1                          | Pending |                                                               |
| FR-NOT-05 | In-app chat / support             | Not required immediately            | Pending |                                                               |
| FR-NOT-06 | WhatsApp deep link / integration  | required but in phase 2, priority 2 | Pending |                                                               |


**Notification triggers:**


| Event             | Push | SMS | Email |
| ----------------- | ---- | --- | ----- |
| Order placed      | Yes  | No  | No    |
| Order confirmed   | Yes  | No  | Yes   |
| Order delivered   | Yes  | Yes | Yes   |
| Promotional offer | Yes  | No  | No    |


---

### 4.6 Admin & Operations


| ID        | Requirement                  | Priority | Status  | Notes |
| --------- | ---------------------------- | -------- | ------- | ----- |
| FR-ADM-01 | Admin web panel              | MVP      | Pending |       |
| FR-ADM-02 | Product / service management | Yes, P1  | Pending |       |
| FR-ADM-03 | Order / booking management   | Yes, P1  | Pending |       |
| FR-ADM-04 | User management              | Yes, p1  | Pending |       |
| FR-ADM-05 | Reports & dashboards         | Yes, p1  | Pending |       |
| FR-ADM-06 | Banner / offer management    | Yes, p1  | Pending |       |
| FR-ADM-07 | Staff assignment             | Yes, P1  | Pending |       |


**Who updates content daily?**


| Content type      | Owner (business side) | Update frequency |
| ----------------- | --------------------- | ---------------- |
| Products / prices | yes                   | daily            |
| Offers / banners  | Yes                   | daily            |
| FAQs / policies   | As required           | as required      |


---

### 4.7 Loyalty & Marketing (Optional)


| ID        | Requirement               | Priority                   | Status  | Notes                                                                    |
| --------- | ------------------------- | -------------------------- | ------- | ------------------------------------------------------------------------ |
| FR-MKT-01 | Coupons / promo codes     | required                   | Pending | ex: if orer quantity > 3, discount of ₹20 flat                           |
| FR-MKT-02 | Referral program          | required                   | Pending | referal bous is for first 3 order discount upto 20 to 30                 |
| FR-MKT-03 | Wallet / reward points    | not immadiate requirement. | Pending | will beb added later.                                                    |
| FR-MKT-04 | Membership / subscription | yes.                       | Pending | if monthly scheduled order is placed then we need to have some discount. |


---

## 5. User Stories

### Format

> **As a** *[role]*, **I want** *[action]*, **so that** *[benefit]*.


| ID    | User story                                                                        | Priority | Acceptance criteria                                 | Status  |
| ----- | --------------------------------------------------------------------------------- | -------- | --------------------------------------------------- | ------- |
| US-01 | As a customer, I want to browse products, so that I can find what I need quickly. | Must     | List loads in < 3s; search returns relevant results | Pending |
| US-02 |                                                                                   |          |                                                     |         |
| US-03 |                                                                                   |          |                                                     |         |


### MoSCoW Priority


| Priority                      | Feature / story ID       |
| ----------------------------- | ------------------------ |
| **Must have** (MVP)           | all MVPs, Priority 1, P1 |
| **Should have**               | Priority 2 or P2         |
| **Could have**                |                          |
| **Won't have** (this release) |                          |


---

## 6. Screen Inventory


| #   | Screen name         | User role | Key actions      | Linked requirements | Wireframe ref                             |
| --- | ------------------- | --------- | ---------------- | ------------------- | ----------------------------------------- |
| 1   | Splash / Onboarding | All       | View intro, skip |                     | `docs/wireframes/01-splash-onboarding.md` |
| 2   | Login / Register    | All       | OTP, sign in     | FR-AUTH-01          | `docs/wireframes/02-login-otp.md`         |
| 3   | Home                | Customer  | Browse, search   | FR-CAT-01           | `docs/wireframes/03-home.md`              |
| 4   | Product detail      | Customer  | Add to cart      | FR-CAT-04           | `docs/wireframes/04-product-detail.md`    |
| 5   | Cart / Checkout     | Customer  | Pay, confirm     | FR-ORD-01           | `docs/wireframes/05-cart-checkout.md`     |
| 6   | Order history       | Customer  | Track, reorder   | FR-ORD-06           | `docs/wireframes/06-order-history.md`     |
| 7   | Profile             | Customer  | Edit details     | FR-AUTH-05          | `docs/wireframes/07-profile.md`           |
| 8   | Admin dashboard     | Admin     | Manage ops       | FR-ADM-01           | `docs/wireframes/08-admin-dashboard.md`   |


---

## 7. Workflows

### 7.1 Customer Journey (Happy Path)

```
1. Open app
2. Register / login
3. Browse catalog
4. Select item / service
5. Add to cart / book slot
6. Checkout / payment
7. Receive confirmation
8. Track status
9. Complete / rate (optional)
```

### 7.2 Order Fulfillment Workflow


| Step | Action                | Performed by   | SLA   | System notification |
| ---- | --------------------- | -------------- | ----- | ------------------- |
| 1    | Order placed          | Customer       | —     | Push                |
| 2    | Order confirmed       | Staff / system | 1 min | Push + SMS          |
| 3    | Prepared / dispatched | Staff          | 1 min |                     |
| 4    | Delivered / completed | Staff          | 1 min | Push + SMS          |
| 5    | Closed                | System         |       |                     |


### 7.3 Exception Flows


| Scenario                 | Business rule                                                                                               | System behavior                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Payment failed           | Order will be hold and marked as payment failed and need to give repayment option.                          | Show retry; hold order 15 min      |
| Out of stock after order | It may happen due to heavy load on shop direct order.                                                       | Notify; offer substitute or refund |
| Customer cancellation    | If not paid ask for selecting the reason of teh cancellation including Other option to give specefic input. | Refund if within policy window     |
| Complaint / support      | give option for suggession or improve. Complain will be addressed here itself.                              | Create ticket; notify manager      |


---

## 8. Data Dictionary

### 8.1 Core Entities

#### User


| Field      | Type     | Required | Notes                        |
| ---------- | -------- | -------- | ---------------------------- |
| id         | UUID     | Yes      | System generated             |
| name       | string   | Yes      |                              |
| phone      | string   | Yes      | Unique                       |
| email      | string   | No       |                              |
| role       | enum     | Yes      | customer / staff / admin     |
| created_at | datetime | Yes      | add createed by too for data |


#### Product / Service


| Field       | Type    | Required | Notes             |
| ----------- | ------- | -------- | ----------------- |
| id          | UUID    | Yes      |                   |
| sku         | string  | Yes      |                   |
| name        | string  | Yes      |                   |
| category_id | FK      | Yes      |                   |
| price       | decimal | Yes      |                   |
| tax_percent | decimal | Yes      |                   |
| images      | array   | Yes      | Min 1             |
| status      | enum    | Yes      | active / inactive |


#### Order / Booking


| Field          | Type     | Required | Notes         |
| -------------- | -------- | -------- | ------------- |
| id             | UUID     | Yes      |               |
| user_id        | FK       | Yes      |               |
| status         | enum     | Yes      | See lifecycle |
| total_amount   | decimal  | Yes      |               |
| payment_status | enum     | Yes      |               |
| created_at     | datetime | Yes      |               |


*Add more entities as discovery progresses.*

---

## 9. Master Data to Collect from Business

> **Do not start development until sample data is received. (No Data received Yet)**


| Data set                                    | Format requested | Received? | Received date | Owner (business) |
| ------------------------------------------- | ---------------- | --------- | ------------- | ---------------- |
| Company profile                             | Form / doc       | ☐         |               |                  |
| Logo & brand assets (SVG, PNG)              | Files            | ☐         |               |                  |
| App icon & splash assets                    | Files            | ☐         |               |                  |
| Product / service catalog (min 20–50 items) | Excel / CSV      | ☐         |               |                  |
| Category list                               | Excel / CSV      | ☐         |               |                  |
| Branch / outlet list                        | Excel / CSV      | ☐         |               |                  |
| Pricing & tax rules                         | Document         | ☐         |               |                  |
| Delivery / service area rules               | Document         | ☐         |               |                  |
| Staff list & roles                          | Excel            | ☐         |               |                  |
| Terms & conditions text                     | Document / URL   | ☐         |               |                  |
| Privacy policy text                         | Document / URL   | ☐         |               |                  |
| Refund / cancellation policy                | Document         | ☐         |               |                  |
| FAQ content                                 | Document         | ☐         |               |                  |
| Existing customer data (if migration)       | Excel / CSV      | ☐         |               |                  |


---

## 10. Integrations


| System                     | Purpose                | API available?                   | Owner                      | Credentials holder | Status  |
| -------------------------- | ---------------------- | -------------------------------- | -------------------------- | ------------------ | ------- |
| Payment gateway            | Online payments        | no                               | Need answer, how to decide | Business           | Pending |
| SMS provider               | OTP, alerts            | No                               | not selected yet           |                    | Pending |
| Email provider             | Transactional email    | No                               | not selected yet           |                    | Pending |
| Maps (Google)              | Location, delivery     | No                               | not selected yet           |                    | Pending |
| WhatsApp Business API      | Notifications          | No                               | not configured yet         |                    | Pending |
| ERP / POS / CRM            | Sync orders, inventory | No                               | not selected yet           |                    | Pending |
| Analytics (Firebase, etc.) | Usage tracking         | free version of google willbe ok |                            |                    | Pending |


---

## 11. Non-Functional Requirements


| ID     | Area                    | Requirement                | Target      |
| ------ | ----------------------- | -------------------------- | ----------- |
| NFR-01 | Platforms               | iOS / Android / both       |             |
| NFR-02 | Min OS versions         | Android __ / iOS __        |             |
| NFR-03 | Languages               | English / Hindi / other    |             |
| NFR-04 | Performance             | App launch time            | < 3 seconds |
| NFR-05 | Performance             | API response (p95)         | < 500 ms    |
| NFR-06 | Availability            | Uptime target              | 99.5%       |
| NFR-07 | Concurrent users (peak) | Expected load              |             |
| NFR-08 | Scalability (12 months) | Expected user growth       |             |
| NFR-09 | Offline support         | Required?                  | Yes / No    |
| NFR-10 | Accessibility           | WCAG level                 | Basic / AA  |
| NFR-11 | Data retention          | How long to keep user data |             |
| NFR-12 | Backup & recovery       | RPO / RTO                  |             |


---

## 12. Security & Compliance


| Item                             | Decision / requirement                                                     |
| -------------------------------- | -------------------------------------------------------------------------- |
| Sensitive data (PII, payments)   | Need to follow the best approach and keep updated about the latest patches |
| Marketing consent (opt-in)       | need to review                                                             |
| Data residency (India / other)   | India                                                                      |
| Compliance (DPDP, GDPR, PCI-DSS) | Should be in place                                                         |
| Admin MFA required?              | Yes                                                                        |
| Audit log (who changed what)     | Required                                                                   |
| Session timeout                  | 12 hour                                                                    |
| App store account owner          | Apple: __ / Google: __will decide                                          |
| Source code ownership            | Business / Developer myself                                                |
| SSL / certificate management     | need to purchase or subscribe                                              |


---

## 13. Technical Decisions


| Item                 | Decision                            | Date                                | Notes                                                                                               |
| -------------------- | ----------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| Mobile approach      | Native / React Native / Flutter     | Need to decide with prose and cons. | Need to decide as per scalibility                                                                   |
| Backend              | Node.js / .NET / other              | node or python need to decide       |                                                                                                     |
| Database             | SQL Server / MongoDB / PostgreSQL   | Mongo or postgreSQL for best        |                                                                                                     |
| Cloud hosting        | Azure / AWS / other                 | Other scalable, best and cheapest   | considering cheapest and scalability. Keeping in mind that user should have get seemless experience |
| Admin panel          | Web (React) / separate              | react - seperate.                   |                                                                                                     |
| CI/CD                | required, weekly or monthly release |                                     |                                                                                                     |
| Environment strategy | Dev / Staging / Prod                | Yes Dev - Staging - Prod            | User should not be effected                                                                         |


---

## 14. Commercial & Delivery

### 14.1 Timeline


| Milestone                | Target date | Status |
| ------------------------ | ----------- | ------ |
| Requirements sign-off    | 13-07-2026  |        |
| UI/UX wireframes         | 12-02-2026  |        |
| MVP development complete | 14-07-2026  |        |
| UAT                      | 15-07-2026  |        |
| App store submission     | 16-07-2026  |        |
| Go-live                  | 19-07-2026  |        |


### 14.2 Budget (Lean Launch — see `docs/azure-docker-cost.md`)

> **Startup hosting:** One Azure VM + Docker Compose (India); admin on Static Web Apps Free.
> **Payments:** COD first (₹0 gateway). Razorpay later = % of online sales only (no monthly rent).
> Owner of cloud bills: **Somnath**.


| Item                            | Estimated cost                                            | Type                  | Owner pays         |
| ------------------------------- | --------------------------------------------------------- | --------------------- | ------------------ |
| Development (fixed / T&M)       | Per agreement                                             | One-time / phase      | Business / Somnath |
| **Cloud — Stage A Lean Launch** | **₹2,000 – 4,000 / mo**                                   | Recurring             | Somnath            |
| Cloud — Stage B Stabilize       | **₹4,000 – 8,000 / mo**                                   | Recurring             | Somnath            |
| Cloud — Stage C Scale (later)   | ₹15,000+ / mo                                             | Recurring when needed | Somnath            |
| SMS OTP (MSG91) — light         | **₹0 – 500 / mo** early                                   | Variable              | Somnath            |
| Maps / Redis / CDN / managed DB | **₹0 at launch** (deferred)                               | —                     | —                  |
| Payment gateway                 | **₹0 monthly**; Razorpay ~1.5–2% only if/when UPI enabled | Variable              | Via gateway        |
| Google Play                     | **$25 one-time**                                          | One-time              | Somnath            |
| Apple Developer                 | **~$99 / yr** — **defer if Android-first**                | Annual                | Somnath            |
| Domain + DNS                    | **₹800 – 2,000 / yr**                                     | Annual                | Somnath            |
| **Stakeholder ask for launch**  | **≈ ₹2,000 – 4,000 / mo**                                 | Recurring             | Somnath            |
| AMC / support (annual)          | TBD after go-live                                         | Annual                | Business           |


**Budget alert (Lean):** Review if infra exceeds **₹5,000 / month** before Stage B approval.

### 14.3 Payment Schedule


| Phase        | %   | Trigger               |
| ------------ | --- | --------------------- |
| Kickoff      | 30% | Requirements sign-off |
| MVP delivery | 40% | UAT start             |
| Go-live      | 30% | Production release    |


### 14.4 Support & Warranty


| Item                         | Terms                                                                     |
| ---------------------------- | ------------------------------------------------------------------------- |
| Warranty period post go-live | It will be in my owership for always.                                     |
| Bug fix SLA                  | Critical: 30 min / Normal: 2 days                                         |
| AMC scope                    | It will be in my owership for always.                                     |
| Change request process       | Proper documentation, revised version release, UAT >> Stage >> Production |


---

## 15. UAT & Acceptance

### 15.1 UAT Owner (Business Side)


| Name    | Role | Contact |
| ------- | ---- | ------- |
| Sarthak |      |         |


### 15.2 MVP Acceptance Checklist


| #   | Test case                          | Expected result                    | Pass / Fail | Tester | Date |
| --- | ---------------------------------- | ---------------------------------- | ----------- | ------ | ---- |
| 1   | User can register with phone OTP   | Account created; OTP verified      |             |        |      |
| 2   | User can browse and search catalog | Relevant results shown             |             |        |      |
| 3   | User can place order end-to-end    | Order confirmed; notification sent |             |        |      |
| 4   | Admin can manage products          | CRUD works; reflects in app        |             |        |      |
| 5   |                                    |                                    |             |        |      |


### 15.3 Sign-Off


| Role               | Name    | Signature | Date |
| ------------------ | ------- | --------- | ---- |
| Business owner     | Sarthak |           |      |
| Project lead (you) | Somnath |           |      |
| Technical lead     | Somnath |           |      |


---

## 16. Discovery Workshop Notes

### Session 1 — Business & Users

**Date:**  
**Attendees:**  
**Notes:**

- 

**Action items:**


| #   | Action | Owner | Due date | Status |
| --- | ------ | ----- | -------- | ------ |
| 1   |        |       |          |        |


---

### Session 2 — Features & Workflows

**Date:**  
**Attendees:**  
**Notes:**

- 

**Action items:**


| #   | Action | Owner | Due date | Status |
| --- | ------ | ----- | -------- | ------ |
| 1   |        |       |          |        |


---

### Session 3 — Data, Integrations & Commercial

**Date:**  
**Attendees:**  
**Notes:**

- 

**Action items:**


| #   | Action | Owner | Due date | Status |
| --- | ------ | ----- | -------- | ------ |
| 1   |        |       |          |        |


---

## 17. Pre-Development Gate Checklist

> All items must be checked before coding starts.

- [ ] Signed problem statement and MVP list
- [ ] Role–permission matrix completed
- [ ] Sample product/service data received (min 20 items)
- [ ] Brand assets received (logo, icon, colors)
- [ ] Legal policies received (terms, privacy, refund)
- [ ] Payment gateway decision made
- [ ] SMS / email provider decision made
- [ ] App store account ownership decided
- [ ] Budget and timeline agreed
- [ ] UAT owner named from business side
- [ ] Change request process documented
- [ ] Requirements sign-off obtained

---

## Appendix A — First Questions for Business Owner

1. Who is the primary user, and what is the #1 action they must complete? Ans: all regular users, and they will do sign in (if not yet) and get the prod list and detsils.
2. Is this B2C, B2B, internal staff, or a combination? Ans: b2c
3. Do you need payments in version 1? Ans: yes
4. Do you have a website/ERP today, or is the app the main system? ANs: Theer is no app till now, App will be the main system fro nw. Nedd to connect an web app symultaniously.
5. How many orders/bookings per day do you expect in 6 months? Ans:18000
6. Who will update products, prices, and offers daily? Ans: Sarthak
7. Who will own Apple/Google developer accounts and monthly cloud bills? Ans: myself
8. What is MVP for launch vs nice-to-have later? Ans: Already mentined as MVP and P1 or Priority 1 in the above list
9. Any compliance rules (finance, health, food, logistics)? Ans: as per indian noms
10. What does success look like in 90 days? Ans: 9000 successful orders delivered succssfully with no complain.

---

## Appendix B — Glossary


| Term   | Definition                                                        |
| ------ | ----------------------------------------------------------------- |
| MVP    | Minimum Viable Product — smallest feature set for launch          |
| UAT    | User Acceptance Testing — business-side validation before go-live |
| BRD    | Business Requirements Document                                    |
| FRD    | Functional Requirements Document                                  |
| MoSCoW | Must / Should / Could / Won't prioritization                      |
| PII    | Personally Identifiable Information                               |


