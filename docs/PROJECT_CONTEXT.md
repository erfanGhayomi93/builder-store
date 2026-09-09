# Store Builder — Complete Codex Context

> Canonical handoff for Codex. Read this file before making product, UX, architecture, database, or implementation decisions.
> This is a complete distilled handoff of the Store Builder conversation, not a raw verbatim chat export.

---

## 1. Product Definition

The product is a **Store Builder SaaS (فروشگاه‌ساز)**, not a Marketplace (بازارگاه).

Each business gets one independent Store in MVP. Stores may be completely unrelated in products, category, customers, attributes, settings, and branding.

Actors:
- Platform Admin (مدیر پلتفرم)
- Store Owner (مالک فروشگاه)
- Store Admin (ادمین فروشگاه)
- Customer (مشتری)

Store lifecycle:
- `DRAFT`
- `ACTIVE`
- `SUSPENDED`
- `CLOSED`

Rules:
- Store can be published with no product.
- Store can be published without a payment gateway.
- No hard delete in MVP; use Close Store and preserve history.

Sales modes:
- `CONTACT_ONLY`: storefront remains visible, but online checkout is disabled and seller contact phone is shown.
- `ONLINE`: active merchant gateway is connected.
- If gateway disconnects, Store remains active and returns to `CONTACT_ONLY`.

---

## 2. Multi-Tenancy / Data Isolation

Each Store is an independent Tenant (مستأجر).

Store A must never access Store B data, including:
- Product
- Customer
- Order
- Payment
- Coupon
- Inventory
- Discount
- Cart

Platform Admin is the only cross-tenant role.

Backend must scope tenant-owned resources by Store.

Bad:
```ts
findUnique({ where: { id } })
```

Preferred:
```ts
findFirst({
  where: {
    id,
    storeId,
  },
})
```

Never trust client-provided `storeId`.

Tenant-aware unique constraints should be used:
```text
(store_id, product_slug)
(store_id, category_slug)
(store_id, coupon_code)
(store_id, customer_mobile)
```

Data Isolation tests are mandatory.

---

## 3. Domain / Hosting

Do not buy or deploy separate hosting for each seller.

All Stores run on shared infrastructure.

Primary domain model:
```text
store-slug.platform.com
```

Use wildcard DNS:
```text
*.platform.com
```

Support Custom Domain later/current MVP connection:
```text
shop.example.com
```

Custom domains route to the same Storefront infrastructure.

Do not implement domain purchasing inside the platform in MVP.

Use a separate `StoreDomain` entity.

Rules:
- One domain cannot belong to multiple Stores.
- Automatic SSL should be supported eventually.

---

## 4. Revenue / Billing

Business model:
- Low or zero fixed fee.
- Percentage of successful online sales.

`Platform Fee Rate` varies per Store.
Platform Admin can change it.

Maintain Fee History so fee changes do not affect old transactions.

Platform fee applies ONLY to verified online sales.

No platform fee for:
- Manual/phone order
- In-person sale

Fee base = net retained paid amount after discounts, coupon, and refunds.

Example:
```text
Final Paid = 800,000
Refund = 200,000
Fee Base = 600,000
```

Generate monthly Invoice (صورتحساب) for Merchant.

Merchant pays the platform invoice through the platform's own payment gateway.

Do not define overdue/suspension rules yet.

---

## 5. Payment Architecture

Customer money goes directly to the Merchant, not to the Platform.

Flow:
```text
Customer
  ↓
Merchant Payment Gateway
  ↓
Merchant Settlement
```

Platform:
- creates Payment Attempt
- redirects customer
- receives callback
- performs server-side Verify
- marks payment successful only after verification

Callback alone must NEVER mark a payment successful.

One Order may have multiple Payment Attempts.
Only one can succeed.

Payment flow must be Idempotent:
duplicate callback / refresh / retry / verification must not:
- decrement inventory twice
- duplicate sale
- duplicate fee
- duplicate order transition

Merchant gateway credentials:
- encrypted at rest
- never plaintext
- Store Admin should not access sensitive credentials
- Store Owner / Platform Admin may manage them

---

## 6. Customer Accounts

Customer auth must be separate from Platform Users.

Platform users:
- PLATFORM_ADMIN
- STORE_OWNER
- STORE_ADMIN

Customer account:
```text
storeId + mobile + passwordHash
```

Same mobile can register separately in Store A and Store B.

MVP Customer auth:
- Mobile Number
- Password

No OTP initially.
Forgot Password postponed until SMS service exists.

Customer can have multiple addresses.

No guest cart.
Customer must login/register before Add to Cart / Checkout.

---

## 7. Product Catalog

Use a generic product model.
Do NOT create domain-specific entities such as:
- ClothingProduct
- LaptopProduct
- FoodProduct

Core:
- Product
- Variant
- Dynamic Attributes
- Category
- Product Images

Suggested Product:
```text
id
storeId
name
slug
description
categoryId
brand
status
createdAt
updatedAt
```

Product statuses:
- DRAFT
- ACTIVE
- INACTIVE

Out-of-stock product stays visible, but Add to Cart is disabled.

Variant owns:
- price
- inventory
- SKU
- status

Even a product with no meaningful variants can have a default Variant.

Dynamic Attribute examples:
Fashion:
- Size
- Color
- Material

Laptop:
- RAM
- CPU
- Storage

Food:
- Weight
- Flavor
- Expiration

Suggested entities:
- AttributeDefinition
- ProductAttribute
- ProductVariant

Storefront Search & Filter is in MVP:
- name
- category
- price
- attributes
- brand

AI Search is later.

---

## 8. AI Readiness

No AI in MVP.

Do not add:
- embeddings
- vector database
- AI search
- recommendations
- AI assistant

But keep structured data AI-ready.

Store structured product data:
- name
- description
- category
- brand
- attributes
- price

Store events:
- `PRODUCT_VIEW`
- `ADD_TO_CART`
- `PURCHASE`

Possible future:
- Smart Search
- Product description generation
- Recommendations
- Merchant analytics assistant
- Customer shopping assistant

AI must remain optional and outside core business flows.

---

## 9. Cart

One active Cart per Customer per Store.

Cross-store cart is impossible.

Rules:
- Add to Cart normally does NOT reserve stock.
- Same variant added again increases quantity.
- Quantity cannot exceed available inventory.
- Backend is authoritative for price.

If price changes while item is in cart:
- latest price applies
- notify customer

If product becomes inactive/out-of-stock:
- keep visible with warning
- block checkout until removed/fixed

Suggested persistence: around 30 days.

---

## 10. Checkout

Collect:
- receiver name
- phone
- province
- city
- address
- postal code
- optional note

Before Order creation, backend must revalidate:
- product status
- current price
- inventory
- variant
- product discount
- coupon

Create Order before redirecting to payment.

---

## 11. Shipping

MVP:
- Post (پست)
- Tipax (تیپاکس)

Shipping is Postpaid (پس‌کرایه).

Online payment covers products only.

No Post/Tipax API in MVP.
No online shipping fee calculation in MVP.

---

## 12. Inventory

Shared inventory for:
- ONLINE
- MANUAL
- IN_PERSON

Inventory must never go negative.
Use backend/DB concurrency protection and transactions.

Special last-item rule:
Only when `inventory == 1`, reserve the last unit for 5 minutes during payment.

If payment succeeds:
```text
inventory -> 0
```

If payment fails or 5 minutes expires:
- release reservation

Manual order:
- starts unpaid
- merchant/admin marks paid after customer payment confirmation
- inventory decreases when marked PAID

In-person sale:
- source = IN_PERSON
- payment = PAID immediately
- inventory decreases immediately

Maintain `InventoryTransaction`.

Types:
- ONLINE_SALE
- MANUAL_SALE
- IN_PERSON_SALE
- STOCK_RECEIVED
- DAMAGED
- ADJUSTMENT
- CUSTOMER_RETURN

Manual stock correction must create a transaction, not silently overwrite quantity.

Variant can have `lowStockThreshold`.

---

## 13. Orders

Order Source:
- ONLINE
- MANUAL
- IN_PERSON

Order Status and Payment Status MUST be separate.

Recommended Order Status:
- NEW
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

Payment Status:
- UNPAID
- PAID
- FAILED
- REFUNDED
- PARTIALLY_REFUNDED

Online PAID only comes from gateway verification.

Manual order may be marked paid by authorized Merchant user.

In-person sale is paid immediately.

Customer cannot self-cancel in MVP.
Customer contacts Seller; Store Owner/Admin cancels.

Tracking code required for SHIPPED.

Since carrier APIs are not integrated, DELIVERED can be set manually.

Store snapshots:
- Order Item snapshot
- Order Address snapshot

Historical orders must not change if Product/Address changes later.

---

## 14. Refund

Refund is INCLUDED in MVP.

Customer does not directly initiate it.
Customer contacts seller.
Store Owner/Admin initiates Refund.

Support:
- Full Refund
- Partial Refund

Payment statuses:
- REFUNDED
- PARTIALLY_REFUNDED

Full Refund may cancel Order.

Refund changes Platform Fee base.

During Refund ask:
```text
Return to Inventory? YES / NO
```

If YES:
- increase inventory
- create `CUSTOMER_RETURN`

Returned product may be damaged/used, so inventory return is not automatic.

Actual payment-provider refund integration can remain flexible.

---

## 15. Discounts / Coupons

Product Discount:
- Percentage
- Fixed Amount
- start/end date

Coupon:
- code
- type
- value
- minOrderAmount
- maxDiscountAmount
- startAt
- endAt
- totalUsageLimit
- perCustomerUsageLimit
- status

If Product Discount + Coupon:
```text
Product Discount first
→ Coupon second
```

Coupon usage counts only after successful payment.

Manual orders can apply coupons.

In-person sale can use Manual Discount separately.

---

## 16. Notifications

MVP:
- In-App Notification only

No:
- SMS
- Email
- Push

Merchant alerts:
- New paid order
- Low stock
- Out of stock
- Gateway disconnected
- Refund
- New invoice

Customer alerts:
- Paid
- Processing
- Shipped
- Delivered
- Cancelled
- Refund
- Tracking

Prefer event-based architecture so other channels can be added later.

---

## 17. Reports

Merchant Dashboard:
- sales today
- orders today
- monthly sales
- active products
- low stock
- pending orders
- platform fee

Sales reports:
- ONLINE
- MANUAL
- IN_PERSON
- TOTAL

Platform fee applies only to verified ONLINE sales.

Product:
- units sold
- revenue
- inventory
- sales by channel

Inventory:
- transaction history
- low stock
- out of stock

Orders:
- by status
- by source

Customers:
- count
- new customers
- order count
- total spend
- last order

Coupons/discounts:
- usage
- discount
- generated sales

---

## 18. Platform Admin

Platform Admin has FULL ACCESS.

Areas:
- Dashboard
- Stores
- Merchants
- Orders
- Payments
- Refunds
- Billing
- Settings
- Domains
- Gateways
- Customers
- Products
- Inventory
- Coupons
- Reports

Platform Admin can manage Store Fee Rate.

All sensitive Platform Admin operations must be Audit Logged.

---

## 19. Store Admin

Store Owner can:
- Add Store Admin
- View Store Admin
- Disable Store Admin
- Enable Store Admin

Store Admin can:
- Products
- Inventory
- Orders
- Manual Orders
- In-person sales
- Mark manual order paid
- Cancel order after customer call
- Tracking
- Customers
- Coupons

Store Admin should NOT control:
- sensitive gateway credentials
- platform billing
- platform fee
- domain ownership
- closing Store

---

## 20. Database

Database:
- PostgreSQL

ORM:
- Prisma

Conceptual entities:
```text
platform_users
stores
store_users
store_domains

categories
products
product_images
attribute_definitions
product_attributes
product_variants

inventory_transactions
inventory_reservations (or equivalent)

customer_accounts
customer_addresses

carts
cart_items

orders
order_items
order_addresses

payments
payment_attempts
store_gateways

product_discounts
coupons
coupon_usages

store_fee_history
invoices

notifications
audit_logs
```

Important:
- Customer auth separate from Platform User auth.
- Variant owns price/inventory.
- Store snapshots in Orders.
- StoreDomain unique globally.
- Product slug unique per Store.
- Category slug unique per Store.
- Coupon code unique per Store.
- Customer mobile unique per Store.

Support:
- Soft Delete
- Pagination
- Timezone
- Currency
- Audit
- Upload security
- SSL/domain

Never use floating point for money.

---

## 21. Monorepo / Frontend Stack

Use one Nx Monorepo.

Apps:
```text
apps/storefront       -> Next.js
apps/merchant-panel   -> React + Vite
apps/admin-panel      -> React + Vite
apps/api              -> NestJS
```

All TypeScript.

Frontend:
- TanStack Query -> Server State
- Zustand -> Client State where needed
- React Hook Form
- Zod
- shadcn/ui
- Tailwind CSS
- Next.js App Router for Storefront
- React Router for Merchant/Admin
- centralized API client
- Vitest
- Playwright

Do not scatter raw fetch calls across components.

Shared libs may contain:
- contracts
- types
- enums
- validation schemas
- UI
- utilities

Do NOT share backend persistence/services/repositories with frontend.

---

## 22. RTL / LTR

Updated user decision (2026-09-08): Persian and English are supported now across all three frontends. Persian remains the default (RTL), English uses LTR. Keep translation catalogs and locale metadata centralized and extensible for additional languages. Localize visible text, navigation, page titles and not-found screens; persist the selected language and keep HTML and component direction synchronized.

Default UI:
- RTL
- Persian text right-aligned
- navigation and layout begin from right

But the Design System and implementation MUST support LTR later without redesign.

Use CSS Logical Properties:
```css
margin-inline-start
margin-inline-end
padding-inline-start
padding-inline-end
inset-inline-start
inset-inline-end
text-align: start
```

Avoid hardcoded `left/right` when logical properties can be used.

One component system must support both directions.

Default:
```text
RTL
```

Optional future:
```text
LTR
```

---

## 23. Semantic HTML / SEO

Storefront is public and SEO-sensitive.

Use Semantic HTML5 where meaningful:
- `header`
- `nav`
- `main`
- `section`
- `article`
- `aside`
- `footer`
- `figure`
- `figcaption`
- `time`
- `address`

Avoid unnecessary `div`s for semantic structure.

Use correct heading hierarchy.

Follow Next.js SEO practices:
- Metadata
- OpenGraph
- Canonical
- Structured Data
- Product schema when applicable
- Sitemap
- Robots

---

## 24. Design System

Token architecture:
```text
Primitive Tokens
→ Semantic Tokens
→ Component Tokens
```

Examples:
- brand.primary
- surface.default
- surface.subtle
- text.primary
- text.secondary
- status.success
- status.warning
- status.error
- button.primary.background

Store theme can customize:
- primary brand color
- secondary color
- logo
- banner
- future typography
- future button style

Components must not hard-code brand colors.

Prepare for future Dark Mode.

Spacing:
- 4
- 8
- 12
- 16
- 24
- 32
- 48

Also:
- radius
- shadow
- motion

Motion tokens:
- fast = 150ms
- normal = 300ms
- slow = 500ms

Use animation only for meaningful UX feedback.

---

## 25. UX Decisions

Storefront:
- mobile-first
- conversion-focused
- visually polished
- strong product imagery
- trust-oriented
- richer than admin panels

Merchant Panel:
- operational efficiency
- clear forms/tables
- low cognitive load

Admin Panel:
- control
- data density
- cross-tenant visibility

User preference:
Codex/design should choose the better UX pattern automatically instead of repeatedly asking for options unless the choice changes business rules.

Accepted UX:
- mobile filters -> Bottom Sheet
- mobile variant selection -> Bottom Sheet
- Add to Cart feedback -> Drawer / Bottom Sheet
- mobile Product Detail -> image-first + sticky CTA
- desktop Product Detail -> gallery + purchase info side-by-side
- long content below

All screens should consider:
- Loading
- Empty
- Error
- Success
- Disabled
- Permission denied

---

## 26. Prototype Status

Prototype is sufficient for now.
Do NOT continue generating repetitive Storefront prototypes unless a specific missing flow is found.

Covered Customer/Storefront flows:
- Home
- Category
- Product List
- Filter
- Product Detail
- Add to Cart
- Cart
- Address
- Shipping
- Payment
- Confirmation
- Order Tracking
- Profile
- Orders
- Support
- Search
- Favorites
- 404

Covered Merchant concepts:
- Dashboard
- Product Management
- Create/Edit Product
- Orders
- Manual Order
- In-person Sale
- Customers
- Discounts/Coupons
- Reports
- Store Settings
- Payment Settings
- Shipping Settings

Covered Admin concepts:
- Dashboard
- Store Management
- User Management
- Reports

Prototype direction:
- Persian
- RTL default
- LTR-ready implementation

---

## 27. Backend Stack / Architecture

Backend:
- NestJS
- TypeScript
- Prisma
- PostgreSQL

Architecture:
- Modular Monolith

Do NOT start with Microservices.

Modules:
- Auth
- Store
- Product
- Customer
- Cart
- Checkout
- Order
- Payment
- Inventory
- Discount
- Billing
- Notification
- Admin
- Audit

Business logic belongs in backend.

Auth:
- JWT Access Token
- JWT Refresh Token
- Argon2id password hashing
- class-validator
- ValidationPipe

Roles:
- PLATFORM_ADMIN
- STORE_OWNER
- STORE_ADMIN

Customer authentication is separate.

---

## 28. Redis / Queue

Redis is NOT required in initial MVP foundation.

Add later when needed:
- cache
- queues
- rate limiting
- temporary data/reservations

BullMQ + Redis later may handle:
- SMS
- Email
- AI jobs
- Image processing
- Monthly invoices

Do not add infrastructure prematurely.

---

## 29. Object Storage

Use S3-compatible Object Storage for files/images.

Database stores URLs, not binary image blobs.

Need:
- file size limits
- format validation
- compression
- resizing
- secure uploads

---

## 30. Infrastructure

High-level:
```text
Storefront (Next.js)
Merchant Panel (React)
Admin Panel (React)
        ↓
NestJS Modular Monolith
        ↓
PostgreSQL
Object Storage
External Payment Gateways
DNS / Domains
```

One shared deployment supports many Stores.

Do not deploy separately per Store.

Do NOT use Kubernetes initially.

Use:
- Docker
- CI/CD
- Local / Staging / Production
- HTTPS
- Health checks
- Logging
- Monitoring
- Daily DB backup
- Restore tests
- Prisma migrations

Each app should still be independently deployable.

Secrets:
- environment / secret manager
- never commit secrets

No manual production DB schema changes.

---

## 31. Testing

Unit Tests:
- pricing
- discount
- coupon
- fee
- order status
- inventory

Integration:
Critical atomic workflow:
```text
Payment verified
→ Payment updated
→ Order updated
→ Inventory updated
→ InventoryTransaction created
→ Platform Fee calculated
```

Payment cases:
- success
- failure
- retry
- duplicate callback
- refresh
- gateway disconnect

Inventory concurrency:
```text
Inventory = 1
Two buyers
Only one successful sale
```

Data Isolation tests are mandatory for:
- Product
- Customer
- Order
- Payment
- Coupon
- Inventory

E2E:
Customer:
- register/login
- product
- add cart
- checkout
- payment
- orders

Merchant:
- product
- manual order
- in-person sale
- refund

Highest-risk:
1. Payment
2. Inventory
3. Order
4. Data Isolation
5. Platform Fee

---

## 32. Non-Functional Requirements

Initial normal API response target:
- approximately under 2 seconds

Security:
- Password hash
- JWT
- Tenant isolation
- Encrypted gateway secrets
- Login rate limit
- Audit logs

Operations:
- Health checks
- Logs
- Monitoring
- Daily backup
- Restore testing

Scale:
- many Stores
- shared platform infrastructure
- no per-store deployments

---

## 33. Conceptual APIs

Auth:
```http
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
```

Store:
```http
POST /stores
GET /stores/me
PATCH /stores/me
POST /stores/me/publish
POST /stores/me/close
```

Products:
```http
GET /products
POST /products
GET /products/:id
PATCH /products/:id
DELETE /products/:id
POST /products/:id/activate
POST /products/:id/deactivate
```

Public Storefront:
```http
GET /storefront
GET /storefront/products
GET /storefront/products/:slug
GET /storefront/categories
```

Store should be resolved from domain/host.

Cart:
```http
GET /cart
POST /cart/items
PATCH /cart/items/:id
DELETE /cart/items/:id
```

Checkout:
```http
POST /checkout
```

Customer Orders:
```http
GET /my-orders
GET /my-orders/:id
```

Merchant Orders:
```http
GET /orders
GET /orders/:id
PATCH /orders/:id/status
POST /orders/manual
POST /orders/:id/mark-paid
```

In-person:
```http
POST /sales/in-person
```

Admin:
```http
/admin/*
```

Every API must enforce auth, role, tenancy, and ownership.

---

## 34. MVP Epics

1. Authentication & Access
2. Store Onboarding
3. Store Management
4. Product Catalog
5. Inventory Management
6. Customer Account
7. Storefront
8. Cart & Checkout
9. Order Management
10. Payment
11. Refund
12. Discount & Coupon
13. Shipping
14. Platform Billing
15. Notifications
16. Reports & Analytics
17. Platform Admin
18. Audit & Security

---

## 35. Sprint Roadmap

Dependency:
```text
Auth
→ Store
→ Product
→ Inventory
→ Storefront
→ Customer
→ Cart
→ Checkout
→ Order
→ Payment
→ Refund
→ Billing
```

Audit/Security are cross-cutting.

### Sprint 1 — Foundation

Goal:
Merchant registers, logs in, creates first DRAFT Store, and tenant foundation is correct.

Tasks:
- Nx workspace
- storefront app
- merchant-panel app
- admin-panel app
- api app
- Tailwind
- shadcn/ui
- Prisma
- PostgreSQL
- env
- Auth
- Roles
- tenant foundation
- Store creation
- unique Store slug
- Platform Admin bootstrap
- Audit foundation

Merchant Registration:
- mobile
- password
- unique platform merchant mobile
- Argon2id
- STORE_OWNER

Duplicate:
- HTTP 409

Login:
- access token
- refresh token
- wrong password -> 401

Create Store:
- name
- slug
- phone
- business category
- initial DRAFT
- one Store per Merchant
- second Store -> 409

DoD:
```text
Register
→ Login
→ Create Store
→ Store slug
→ DRAFT
→ Logout/Login
→ Merchant sees only own Store
```

### Sprint 2 — Product & Inventory
- Categories
- Products
- Variants
- Dynamic attributes
- Images
- Inventory
- History
- Low stock

### Sprint 3 — Storefront
- Next.js
- domain routing
- product listing
- product detail
- search
- filter
- CONTACT_ONLY

Milestone:
Live browseable Store.

### Sprint 4 — Customer & Cart
- Customer auth
- Addresses
- Cart
- Discounts
- Coupons
- Checkout
- Post/Tipax

### Sprint 5 — Order & Payment
- Online Order
- Merchant gateway
- Payment Attempts
- Verify
- Last-item 5-minute reservation
- Inventory
- Fee

Milestone:
Online purchasing works.

### Sprint 6 — Merchant Operations
- Manual Order
- In-person sale
- Order management
- Tracking
- Cancel
- Refund

### Sprint 7 — Platform Operations
- Store Admin management
- Platform Admin
- Fee management
- Monthly Invoice
- Audit

### Sprint 8 — Reports & Notifications
- Reports
- In-app notifications
- analytics foundation

Milestone:
Full MVP.

---

## 36. Included in MVP

- Store setup
- Subdomain
- Custom domain connection
- Product
- Variant
- Dynamic attributes
- Images
- Customer mobile/password
- Cart
- Checkout
- Post/Tipax postpaid
- Online order
- Manual order
- In-person sale
- Merchant gateway
- Inventory history
- Last-item reservation
- Discounts
- Coupons
- Merchant panel
- Admin panel
- Variable platform fee
- Monthly invoice
- In-app notifications
- Refund
- Reports
- Full Platform Admin
- Audit/security

---

## 37. Excluded for Now

Do NOT implement unless explicitly requested later:
- AI
- AI Search
- Recommendations
- SMS
- OTP
- Forgot Password
- Domain purchase
- Post API
- Tipax API
- online shipping calculation
- Email
- mandatory Redis
- mandatory BullMQ
- Microservices
- Kubernetes
- Marketplace
- multiple Stores per Merchant
- Loyalty
- Campaign system
- Advanced analytics
- Advanced roles

Important: Refund is INCLUDED.

---

## 38. Repository / Workflow

GitHub:
```text
https://github.com/erfanGhayomi93/builder-store.git
```

Local project folder:
```text
builder-store/
```

User intends:
- work locally with Codex / VS Code / ChatGPT Desktop
- manually commit/push changes to GitHub

Recommended structure:
```text
builder-store/
├── AGENTS.md
├── docs/
│   └── PROJECT_CONTEXT.md
├── apps/
│   ├── storefront/
│   ├── merchant-panel/
│   ├── admin-panel/
│   └── api/
├── libs/
│   ├── contracts/
│   ├── shared-types/
│   ├── validation/
│   ├── ui/
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── nx.json
└── package.json
```

---

## 39. Recommended AGENTS.md

Create a root `AGENTS.md` with:

```md
# Store Builder

Before making changes:

1. Read `docs/PROJECT_CONTEXT.md`.
2. Follow approved architecture and business rules.
3. Do not introduce libraries without justification.
4. Default UI is RTL.
5. All UI must support LTR.
6. Storefront uses Semantic HTML5.
7. Storefront follows Next.js SEO best practices.
8. Tenant resources must be scoped by `storeId`.
9. Never trust client-provided `storeId`.
10. Business logic belongs in backend.
11. Online payment success requires server-side verification.
12. Inventory must never become negative.
13. Financial/inventory flows must be idempotent and transactional.
14. Platform Admin is the only cross-tenant role.
15. Do not add AI, Redis, BullMQ, Microservices, or Kubernetes unless requested.
```

---

## 40. Implementation Principles

- Keep MVP strict.
- Avoid over-engineering.
- Prefer Modular Monolith.
- Prefer small reviewable changes.
- Use DB transactions for financial/inventory workflows.
- Add tests for risky domain logic.
- Never weaken tenancy.
- TanStack Query for Server State.
- Zustand only for genuine Client State.
- Centralize API contracts.
- Direction-aware UI.
- Semantic tokens, no hard-coded brand colors.
- Explicit loading/empty/error states.
- Accessibility matters.
- Storefront Semantic HTML + SEO.

---

## 41. Critical Rules Checklist

Codex must preserve:

- [ ] One Merchant = one Store in MVP
- [ ] Store can Publish without gateway
- [ ] No gateway = CONTACT_ONLY
- [ ] Customer must login before cart/checkout
- [ ] Customer account is Store-scoped
- [ ] Same mobile can exist in multiple Stores
- [ ] Product attributes are dynamic
- [ ] Variant owns price/inventory
- [ ] Cart normally does not reserve inventory
- [ ] If inventory=1, last item can reserve for 5 minutes during payment
- [ ] Inventory never becomes negative
- [ ] Online PAID only after gateway verification
- [ ] Manual order may be manually marked PAID
- [ ] In-person sale is immediately PAID
- [ ] Order Status != Payment Status
- [ ] Customer cannot self-cancel
- [ ] Refund is in MVP
- [ ] Refund inventory return is optional
- [ ] Platform Fee only on verified online sales
- [ ] Fee uses net paid amount after refund
- [ ] Platform Admin is cross-tenant
- [ ] Store Admin cannot manage sensitive billing/gateway ownership
- [ ] Sensitive admin actions are audited
- [ ] Default UI = RTL
- [ ] UI also supports LTR
- [ ] Storefront uses Semantic HTML5
- [ ] Storefront follows Next.js SEO

---

## 42. Final Stack

```text
Monorepo: Nx
Language: TypeScript

Storefront:
- Next.js
- App Router
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand where needed
- React Hook Form
- Zod

Merchant Panel:
- React
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod

Admin Panel:
- React
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod

API:
- NestJS
- Prisma
- PostgreSQL
- JWT Access + Refresh
- Argon2id
- class-validator
- ValidationPipe

Testing:
- Vitest
- Playwright

Files:
- S3-compatible Object Storage

Later only if needed:
- Redis
- BullMQ
```

---

## 43. Next Step for Codex

Prototype work is sufficient.

Next step is implementation readiness and Sprint 1.

Recommended first Codex prompt:

```text
Read AGENTS.md and docs/PROJECT_CONTEXT.md first.

Then inspect the current repository without changing files.

Report:
1. Current repository structure
2. What already exists
3. What is missing for Sprint 1
4. Any conflicts with PROJECT_CONTEXT.md
5. Proposed implementation plan

Do not modify code until the review is complete.
```

After review:
```text
1. Verify/create Nx Monorepo
2. Add/verify apps
3. Add shared libs
4. Configure PostgreSQL + Prisma
5. Define initial schema
6. Implement Auth
7. Implement Store creation
8. Implement Tenant Context
9. Implement Authorization Guards
10. Add baseline tests
11. Complete Sprint 1 end-to-end
```

---

## 44. Source of Truth

This document is the canonical distilled context from the Store Builder conversation.

If a future explicit user decision conflicts with this file:
1. the newer explicit decision wins
2. update this document
3. continue using the updated version as the source of truth
