# Store Builder — Competitive Strategy

> Purpose: Define how this product should differentiate from website builders, commerce platforms, creator-store tools, and community builders.
> This file is strategic guidance, not an automatic MVP implementation checklist.

## 1. Positioning

Do not compete with:
> "We also let you build an online store."

Compete on:

```text
Fast Store Creation
+ Commerce-First UX
+ Industry-Specific Setup
+ Conversion Optimization
+ Local Market Fit
+ Future AI Assistance
```

Core promise:

> Help merchants launch a store that is ready to sell, not just ready to publish.

Preferred positioning:
- "Create a store that is ready to sell."
- "From idea to first sale."

## 2. Competitive Benchmark

### Wix
Strong:
- Website Builder
- Templates
- Visual customization
- Large ecosystem

Opportunity:
- Too broad for merchants who mainly want to sell
- More flexibility does not always mean better conversion

### Shopify
Strong:
- Commerce operations
- Orders
- Inventory
- Payments
- App ecosystem

Opportunity:
- Can feel heavy for smaller merchants
- Local-market fit can be weaker

### Digify-style tools
Strong:
- Fast onboarding
- Simple selling
- Low-friction setup

Opportunity:
- Often too lightweight for serious retail operations

### Bettermode-style platforms
Strong:
- Modular blocks
- Extensibility
- Roles and permissions

Opportunity:
- Not commerce-first

## 3. Competitive Wedge

Primary wedge:

```text
Register
→ Create Store
→ Add First Product
→ Preview
→ Publish
→ First Sale
```

The merchant should feel they are launching a business, not building a website from scratch.

## 4. Competitive Advantage Pillars

### 4.1 Fast Store Creation
Keep onboarding short.

Suggested future onboarding:

```text
Step 1: Store Name
Step 2: Business Type
Step 3: Brand Basics
Step 4: First Product
Step 5: Publish
```

Goal:
- Minimize time to first visible Store
- Avoid long configuration before merchant sees value

### 4.2 Commerce-First Storefront
Strong defaults for:
- Product discovery
- Search
- Filters
- Product Detail
- Cart
- Checkout
- Trust cues
- Shipping information
- Order tracking

Merchant should not manually design these critical flows.

### 4.3 Industry-Specific Templates
Templates should be business-aware, not only visual.

Fashion defaults:
- Size
- Color
- Material
- New Collection
- Best Sellers

Electronics defaults:
- RAM
- CPU
- Storage
- Warranty
- Specifications

Food defaults:
- Weight
- Flavor
- Expiration
- Delivery notes

Future flow:

```text
What do you sell?
→ Choose Industry
→ Preconfigured Store Structure
```

### 4.4 Conversion Optimization
Long-term differentiation:

```text
Store Builder
+
Conversion Assistant
```

Future capabilities:
- Product page quality score
- Missing image/content warnings
- Checkout drop-off analysis
- Conversion funnel
- Search-with-no-result reports
- Low-performing products
- Abandoned cart insights
- Improvement suggestions

### 4.5 Local Commerce Advantage
If Iran/local market is targeted, use:
- Local payment gateways
- Post
- Tipax
- Local SMS providers
- Persian-first UX
- RTL-first design
- Local invoicing/tax requirements
- Local banking/payment behavior

### 4.6 Merchant Operating System
Long-term direction:

```text
Store Builder
→ Merchant Operating System
```

Possible future modules:
- Storefront
- Orders
- Inventory
- Customers
- Reports
- CRM
- Loyalty
- Marketing
- Automation
- AI Assistant

Do not build all of these in MVP.

## 5. AI Strategy

No AI dependency in MVP.

Future AI possibilities:
- AI Store Setup
- Product description/SEO assistance
- Product attribute/category suggestions
- AI Merchant Assistant
- Smart Search
- Recommendations

Important principle:

> AI must remain an optional layer over structured product, commerce, and event data.

## 6. Event Tracking

Keep clean event contracts for future analytics and AI.

Recommended events:

```text
STORE_CREATED
STORE_PUBLISHED

PRODUCT_CREATED
PRODUCT_VIEW
PRODUCT_SEARCH
FILTER_USED
SEARCH_NO_RESULT

ADD_TO_CART
REMOVE_FROM_CART
CHECKOUT_STARTED
PAYMENT_STARTED
PAYMENT_SUCCEEDED
PAYMENT_FAILED

ORDER_CREATED
ORDER_DELIVERED
REFUND_CREATED
```

These can later support:
- Conversion funnels
- Merchant analytics
- Recommendations
- Search improvement
- AI insights

Do not block MVP on advanced analytics infrastructure.

## 7. What NOT to Copy from Wix

Do not begin with a blank-canvas unrestricted page builder.

Avoid:

```text
Blank Canvas
→ Drag everything manually
→ Configure everything
```

Prefer:

```text
Strong Commerce Template
→ Safe Customization
→ Advanced controls later
```

Main merchant problem is more often:
> "I need a professional Store quickly and I want it to sell."

Not:
> "I need unlimited design freedom."

## 8. Store Customization Roadmap

### MVP
Controlled customization:
- Logo
- Primary color
- Secondary color
- Banner
- Basic theme
- Product display settings

### Phase 2
Section Builder:

```text
Homepage
├── Hero
├── Category Grid
├── Product Collection
├── Featured Products
├── Banner
├── Text
└── FAQ
```

Prefer Section Builder over unrestricted Drag & Drop.

### Later
Advanced Page Builder only if real demand proves it is needed.

## 9. Architecture Implications

Keep current architecture compatible with:
- Dynamic Product Attributes
- Theme Tokens
- Event Tracking
- Modular Backend
- Store-level configuration

Possible future Store config:

```text
industryType
themeConfig
enabledModules
homepageLayout
```

Do not over-engineer these before a real feature requires them.

## 10. Roadmap Direction

### Phase 1 — MVP

```text
Fast Store Creation
+
Beautiful Default Storefront
+
Core Commerce
+
Merchant Operations
```

### Phase 2 — Store Builder Experience
- Theme Editor
- Section Builder
- Industry Templates
- Navigation Builder
- SEO Pages
- Conversion Analytics

### Phase 3 — Merchant Growth
- CRM
- Loyalty
- Marketing Automation
- Advanced Analytics
- Apps / Extensions

### Phase 4 — AI Layer
- AI Store Setup
- AI Search
- AI Product Assistant
- AI Merchant Assistant
- Recommendations

## 11. Decision Filter

Before prioritizing a new feature, ask whether it helps a merchant:

1. Launch faster?
2. Sell better?
3. Operate the Store more easily?
4. Understand the business better?
5. Gain meaningful local-market advantage?

If the answer is no to all five, it is probably not a priority.

## 12. How Codex Should Use This File

This file defines strategic direction.

Codex must NOT automatically implement future strategy features just because they are documented here.

Implementation priority comes from:
1. `docs/PROJECT_CONTEXT.md`
2. Current Sprint
3. Explicit user request

Read this file when:
- evaluating a new feature
- deciding whether something belongs in MVP
- making architecture choices that affect future differentiation
- designing Store customization
- designing analytics/events
- planning Roadmap
- checking whether the product is becoming a generic Website Builder

## 13. Source of Truth

Use:
```text
docs/PROJECT_CONTEXT.md
```
for approved business and technical rules.

Use:
```text
docs/COMPETITIVE_STRATEGY.md
```
for differentiation and strategic direction.

If they conflict:
- latest explicit user decision wins
- update the relevant file
- do not silently change implementation
