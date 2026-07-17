# e-Food Center — Entity Relationship Diagram (MVP)

> **Status:** Proposed for approval  
> **Version:** 0.1  
> **Companion:** `docs/architecture.md` · `REQUIREMENTS.md` §8

---

## 1. ERD (logical)

```mermaid
erDiagram
  USER ||--o{ ADDRESS : has
  USER ||--o{ CART : owns
  USER ||--o{ ORDER : places
  USER ||--o{ STAFF_ASSIGNMENT : assigned
  USER ||--o{ AUDIT_LOG : actor

  BRANCH ||--o{ INVENTORY : stocks
  BRANCH ||--o{ ORDER : fulfills
  BRANCH ||--o{ DELIVERY_ZONE : covers
  BRANCH ||--o{ STAFF_ASSIGNMENT : employs
  BRANCH ||--o{ BANNER : shows

  CATEGORY ||--o{ PRODUCT : contains
  PRODUCT ||--o{ PRODUCT_VARIANT : has
  PRODUCT ||--o{ INVENTORY : tracked_in
  PRODUCT ||--o{ CART_ITEM : in
  PRODUCT ||--o{ ORDER_ITEM : sold_as

  CART ||--o{ CART_ITEM : contains
  ORDER ||--o{ ORDER_ITEM : contains
  ORDER ||--o| PAYMENT : paid_by
  ORDER ||--o{ REFUND : may_have
  ORDER ||--o{ NOTIFICATION : triggers

  COUPON ||--o{ ORDER : applied_to

  USER {
    uuid id PK
    string name
    string phone UK
    string email
    enum role
    boolean consent_marketing
    timestamptz created_at
  }

  BRANCH {
    uuid id PK
    string name
    string code UK
    enum vertical
    string timezone
    jsonb auto_confirm_window
    boolean is_active
  }

  CATEGORY {
    uuid id PK
    string name
    int sort_order
    boolean is_active
  }

  PRODUCT {
    uuid id PK
    string sku UK
    string name
    uuid category_id FK
    decimal base_price
    int min_qty
    text description
    string image_url
    boolean is_active
  }

  PRODUCT_VARIANT {
    uuid id PK
    uuid product_id FK
    string name
    decimal price_delta
  }

  INVENTORY {
    uuid id PK
    uuid branch_id FK
    uuid product_id FK
    int available_qty
    boolean is_available
  }

  CART {
    uuid id PK
    uuid user_id FK
    uuid branch_id FK
  }

  CART_ITEM {
    uuid id PK
    uuid cart_id FK
    uuid product_id FK
    int qty
  }

  ORDER {
    uuid id PK
    string order_number UK
    uuid user_id FK
    uuid branch_id FK
    enum status
    enum fulfillment_type
    uuid address_id FK
    decimal subtotal
    decimal delivery_fee
    decimal discount
    decimal total
    string coupon_code
    uuid delivery_person_id FK
    timestamptz placed_at
  }

  ORDER_ITEM {
    uuid id PK
    uuid order_id FK
    uuid product_id FK
    string name_snapshot
    decimal unit_price
    int qty
    decimal line_total
  }

  PAYMENT {
    uuid id PK
    uuid order_id FK
    enum method
    enum status
    string gateway_ref
    decimal amount
    decimal cod_collected
  }

  REFUND {
    uuid id PK
    uuid order_id FK
    decimal amount
    decimal deduction
    enum status
    string reason
  }

  COUPON {
    uuid id PK
    string code UK
    enum type
    decimal value
    jsonb rules
    boolean is_active
  }

  DELIVERY_ZONE {
    uuid id PK
    uuid branch_id FK
    string name
    jsonb geo
    decimal fee
    boolean is_active
  }

  ADDRESS {
    uuid id PK
    uuid user_id FK
    string line1
    string landmark
    string pincode
    float lat
    float lng
  }

  STAFF_ASSIGNMENT {
    uuid id PK
    uuid user_id FK
    uuid branch_id FK
    enum staff_role
  }

  NOTIFICATION {
    uuid id PK
    uuid user_id FK
    uuid order_id FK
    enum channel
    string template
    enum status
  }

  AUDIT_LOG {
    uuid id PK
    uuid actor_id FK
    string entity
    uuid entity_id
    string action
    jsonb before
    jsonb after
    timestamptz created_at
  }

  BANNER {
    uuid id PK
    uuid branch_id FK
    string title
    string image_url
    boolean is_active
  }
```

---

## 2. Entity notes (MVP)

| Entity | Notes |
|--------|-------|
| `USER.role` | `customer` \| `staff` \| `manager` \| `admin` |
| `BRANCH.vertical` | `food` for MVP; future: retail, veg, household |
| `PRODUCT.min_qty` | e.g. biryani=1, momos=2 |
| `ORDER.status` | Placed → Confirmed → InProgress → Completed → Closed; Cancelled / Refunded / PaymentFailed |
| `ORDER.fulfillment_type` | `delivery` \| `pickup` |
| `PAYMENT.method` | `razorpay` \| `cod` |
| `INVENTORY` | Unique `(branch_id, product_id)` |
| Snapshots | `ORDER_ITEM.name_snapshot` + `unit_price` freeze catalog changes after place |

---

## 3. Indexes (critical)

- `user.phone` unique
- `order.order_number` unique
- `order (branch_id, status, placed_at)`
- `inventory (branch_id, product_id)` unique
- `payment.gateway_ref` unique where not null
- `audit_log (entity, entity_id, created_at)`

---

## 4. Approval

| Role | Name | Decision | Date |
|------|------|----------|------|
| Tech Lead | Somnath Das | ☐ Approve · ☐ Changes · ☐ Reject | |
| Business Owner | Sarthak Ghosh | ☐ Approve · ☐ Changes · ☐ Reject | |
