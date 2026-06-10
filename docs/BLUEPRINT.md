# Lady B Designs and Handcraft — Production Architecture Blueprint

> Wearable Art, Crafted by Hand.
> **Version 1.0 | June 2026 | Confidential**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Brand Strategy](#2-brand-strategy)
3. [Visual Identity Direction](#3-visual-identity-direction)
4. [Sitemap](#4-sitemap)
5. [Navigation Architecture](#5-navigation-architecture)
6. [Full User Journeys](#6-full-user-journeys)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Backend Architecture](#8-backend-architecture)
9. [Complete Folder Structure](#9-complete-folder-structure)
10. [Complete Frontend Routes](#10-complete-frontend-routes)
11. [Complete Backend API Endpoints](#11-complete-backend-api-endpoints)
12. [Database Schema Plan](#12-database-schema-plan)
13. [Prisma Schema](#13-prisma-schema)
14. [Authentication and Authorization Plan](#14-authentication-and-authorization-plan)
15. [Custom Order Workflow](#15-custom-order-workflow)
16. [Product Catalog Architecture](#16-product-catalog-architecture)
17. [Cart and Checkout Flow](#17-cart-and-checkout-flow)
18. [Payment Architecture](#18-payment-architecture)
19. [Admin Dashboard Specification](#19-admin-dashboard-specification)
20. [Component Library Specification](#20-component-library-specification)
21. [API Response Standards](#21-api-response-standards)
22. [Error Handling Standards](#22-error-handling-standards)
23. [Validation Strategy](#23-validation-strategy)
24. [Security Strategy](#24-security-strategy)
25. [Docker and Container Setup](#25-docker-and-container-setup)
26. [Nginx Configuration Plan](#26-nginx-configuration-plan)
27. [CI/CD Workflows](#27-cicd-workflows)
28. [Testing Strategy](#28-testing-strategy)
29. [SEO Strategy](#29-seo-strategy)
30. [Content Strategy](#30-content-strategy)
31. [Conversion Optimization Strategy](#31-conversion-optimization-strategy)
32. [Email Notification Strategy](#32-email-notification-strategy)
33. [Deployment Strategy](#33-deployment-strategy)
34. [Monitoring and Logging Strategy](#34-monitoring-and-logging-strategy)
35. [Launch Checklist](#35-launch-checklist)
36. [Post-Launch Roadmap](#36-post-launch-roadmap)
37. [Scaling Roadmap](#37-scaling-roadmap)

---

## 1. Executive Summary

**Lady B Designs and Handcraft** is a direct-to-consumer luxury artisan fashion brand based in Indianapolis, Indiana. The brand produces handcrafted bead bags, statement necklaces, and bespoke accessories with positioning comparable to Bottega Veneta, Cult Gaia, and Rosantica — wearable art at the intersection of craftsmanship and modern luxury.

This blueprint covers the complete technical architecture for a production-grade ecommerce platform designed to serve global customers, support a 12-stage bespoke custom order workflow, and provide the brand full operational control through a robust admin dashboard.

### Business Goals
- Establish a direct digital sales channel eliminating marketplace dependency
- Support bespoke custom order intake with end-to-end workflow management
- Position the brand globally while serving US market as primary
- Capture customer data and repeat purchase behavior through loyalty mechanics
- Enable wholesale and press inquiry management in one platform

### Platform Goals
- Sub-2s first contentful paint globally
- 99.9% uptime SLA
- PCI-compliant checkout via Stripe and PayPal
- Zero-downtime deployments via rolling Docker container restart
- Full audit trail for all admin actions
- WCAG 2.1 AA accessibility compliance

### Technical Summary
- **Monorepo**: `lady-b-commerce/` with `lady-b-fe/` + `lady-b-be/` workspaces
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Node.js 20 + Express + TypeScript + Prisma + PostgreSQL 16 + Redis 7
- **Payments**: Stripe (primary) + PayPal (secondary)
- **Media**: Cloudinary for image upload, transformation, and delivery
- **Infrastructure**: Docker Compose (5 containers) + Nginx reverse proxy
- **CI/CD**: 5 GitHub Actions workflows (frontend CI, backend CI, Docker build, security scan, deploy)

---

## 2. Brand Strategy

### Positioning
Lady B is a luxury artisan brand. Every touchpoint — digital or physical — must reinforce the idea that these are not mass-produced goods. They are wearable art made by human hands, designed for discerning women who understand the difference.

**Competitive set**: Bottega Veneta (craft authority), Cult Gaia (sculptural femininity), Rosantica (artisanal beadwork), Dior (aspiration and heritage), Completedworks (artist-led jewelry)

### Differentiators
1. **Provenance transparency** — customers can see and understand how each piece is made
2. **Bespoke access** — custom order workflow allows true one-of-one commissions
3. **Direct relationship** — DTC model means intimate brand relationship vs. department store anonymity
4. **Founder story** — artisan-led brand with authentic Indianapolis roots and African craft heritage

### Target Customer
- **Primary**: Women 28–50, household income $100k+, drawn to independent luxury, values craftsmanship
- **Secondary**: Gift purchasers (partners, parents) for milestone occasions
- **Tertiary**: Fashion stylists and editorial accounts for press placements

### Brand Voice
- Confident, not loud
- Intimate, not exclusive
- Knowledgeable, not academic
- Warm, not casual

**Sample copy patterns**:
- "Each bag takes 12 hours to bead by hand."
- "Yours, and only yours." (bespoke section)
- "Art you can carry."

### Tagline Options
- **Primary**: "Wearable Art, Crafted by Hand"
- **Secondary**: "Made by Hand. Made for You."
- **Bespoke CTA**: "Commission Yours"

---

## 3. Visual Identity Direction

### Color Palette

```
Ivory       #FDFBF7   — primary background, hero sections
Charcoal    #1C1C1E   — primary text, CTAs, nav
Emerald     #2D6A4F   — luxury accent, bespoke sections
Gold        #C9A84C   — champagne gold, labels, accents
Pearl       #F5F0E8   — alternate surface, product cards
Sand        #D4C4A0   — dividers, borders, subtle bg
Beige       #E8D9C0   — warm card backgrounds
Cocoa       #4A3728   — warm dark for contrast sections
Blush       #F0E0DC   — soft accent, feminine highlights
```

### Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display / Editorial | Cormorant Garamond | 300–600 | Hero headlines, product names, pull quotes |
| Body / UI | DM Sans | 300–500 | Body text, nav, labels, descriptions |
| Section Labels | DM Sans | 400 | Uppercase, wide tracking, gold color |

**Font loading**: Google Fonts via `@import` in CSS. Preconnect hints in `index.html` for performance.

### Motion Design Principles
- **Entry animations**: Staggered fade-up (60px Y, 0.6s duration, 0.1s stagger) on scroll
- **Page transitions**: Cross-fade at route level (0.3s)
- **Cart drawer**: Slide in from right (0.35s ease)
- **Mobile menu**: Slide in from right, full-screen charcoal overlay
- **Hover states**: Scale 1.02 on product cards, opacity transitions on links
- No decorative motion on reduced-motion preference

### Layout Principles
- Max-width: 1440px (`max-w-luxury` class)
- Horizontal padding: 16px (mobile) → 24px (sm) → 48px (xl)
- Section vertical rhythm: 80px–120px padding top/bottom
- Grid: 12-column with 24px gutters
- Product grids: 2-col mobile, 3-col tablet, 4-col desktop

### Photography Direction
- **Mood**: Editorial. Dark surfaces, natural linen, soft ambient light
- **Angle**: Product on model, product on surface, detail closeups
- **Aspect ratios**: Hero 16:9, product card 3:4, detail 1:1
- **No white backgrounds** — the brand is not Amazon

---

## 4. Sitemap

```
/ (Home)
├── /shop
│   ├── /shop/all
│   ├── /shop/bags
│   ├── /shop/necklaces
│   ├── /shop/earrings
│   ├── /shop/bracelets
│   ├── /shop/sets
│   └── /shop/sale
├── /collections
│   ├── /collections/:slug
│   └── /collections/new-arrivals
├── /products
│   └── /products/:slug
├── /bespoke
│   ├── /bespoke (landing)
│   └── /bespoke/start (intake form)
├── /cart
├── /checkout
│   ├── /checkout (main)
│   ├── /checkout/success
│   └── /checkout/cancel
├── /search
├── /wishlist
├── /about
├── /craftsmanship
├── /contact
├── /wholesale
├── /press
├── /auth
│   ├── /login
│   ├── /register
│   ├── /forgot-password
│   └── /reset-password
├── /account
│   ├── /account (dashboard)
│   ├── /account/orders
│   ├── /account/orders/:id
│   ├── /account/custom-orders
│   ├── /account/custom-orders/:id
│   ├── /account/wishlist
│   ├── /account/profile
│   ├── /account/addresses
│   └── /account/settings
├── /admin
│   ├── /admin (dashboard)
│   ├── /admin/products
│   ├── /admin/products/new
│   ├── /admin/products/:id
│   ├── /admin/orders
│   ├── /admin/orders/:id
│   ├── /admin/custom-orders
│   ├── /admin/custom-orders/:id
│   ├── /admin/customers
│   ├── /admin/customers/:id
│   ├── /admin/collections
│   ├── /admin/categories
│   ├── /admin/coupons
│   ├── /admin/inventory
│   ├── /admin/reviews
│   ├── /admin/inquiries
│   ├── /admin/newsletter
│   ├── /admin/analytics
│   └── /admin/settings
└── /legal
    ├── /privacy-policy
    ├── /terms-of-service
    ├── /return-policy
    ├── /shipping-policy
    └── /cookie-policy
```

---

## 5. Navigation Architecture

### Primary Navigation (Desktop)

```
[Lady B Logo]   Shop  Collections  Bespoke  About  Craftsmanship   [Search] [Wishlist] [Account] [Cart(n)]
```

**Shop** mega-menu:
- All Products
- Bead Bags
- Statement Necklaces
- Earrings
- Bracelets
- Gift Sets
- Sale

**Collections** dropdown:
- New Arrivals
- Best Sellers
- [Dynamic collection names from DB]

### Mobile Navigation
- Hamburger icon opens full-screen charcoal-900 overlay
- Animated list items staggered 0.05s per item
- Accordion for Shop and Collections sub-menus
- Bottom of overlay: Account, Wishlist, Cart count

### Header Behavior
- **Homepage**: Transparent header, white text and icons over hero image
- **Scroll > 60px on homepage**: Ivory/95 background + backdrop-blur, charcoal text
- **All other pages**: Always ivory/95, charcoal text

### Footer
- Column 1: Brand logo + tagline + social links (Instagram, Pinterest, TikTok)
- Column 2: Shop links (All, Bags, Necklaces, Earrings, Bracelets, Sets, Sale)
- Column 3: Company links (About, Craftsmanship, Bespoke, Contact, Wholesale, Press)
- Column 4: Customer links (My Account, Orders, Returns, FAQ, Size Guide)
- Legal row: Privacy Policy | Terms | Returns | Shipping | Cookie Policy
- Contact row: 731 Westbury West Dr, Indianapolis IN 46224 | +1 (317) 333-1333 | Adebiyiblessing55@gmail.com
- Newsletter signup integrated into footer
- Accepted payments: Stripe/PayPal badge strip

---

## 6. Full User Journeys

### Journey 1: First-Time Visitor → Purchase

```
1. Lands on / (homepage via Instagram ad or organic)
2. Scrolls hero → featured collections section
3. Clicks "Ivory Arch Bead Bag" → /products/ivory-arch-bead-bag
4. Reviews images, selects color variant, reads craftsmanship notes
5. Clicks "Add to Bag" → cart drawer slides open
6. Drawer shows item + subtotal + "Proceed to Checkout" CTA
7. Clicks proceed → /checkout
8. Guest checkout: enters email + shipping address
9. Enters card details (Stripe Elements)
10. Clicks "Place Order" → POST /checkout/stripe/create-payment-intent → confirm
11. Redirected to /checkout/success?orderId=xxx
12. Receives order confirmation email
13. Optionally creates account from success page ("Save your details for next time")
```

### Journey 2: Returning Customer → Account Purchase

```
1. Lands on site, clicks Account icon → /login
2. Logs in with email + password → JWT stored in Zustand persist
3. Browses /shop/bags, adds to wishlist
4. Returns next day → wishlist item still there (DB-persisted)
5. Adds to bag → /cart → /checkout (pre-filled address from account)
6. Express checkout — one click with saved payment preference
7. Order visible in /account/orders
```

### Journey 3: Bespoke Custom Order

```
1. Customer visits /bespoke landing page
2. Reads about the process, timeline (8–12 weeks), pricing (from $600)
3. Clicks "Commission Yours" → /bespoke/start
4. Fills intake form:
   - Product type (bag / necklace / bracelet / set)
   - Color palette preferences
   - Size / dimensions
   - Occasion / intended use
   - Bead materials preference
   - Reference images upload (Cloudinary)
   - Budget range
   - Timeline flexibility
   - Contact info + notes
5. Submits → POST /custom-orders → status: SUBMITTED
6. Receives confirmation email with reference number
7. Admin reviews in /admin/custom-orders/:id
8. Admin changes status to REVIEWING, sends message (internal notes field)
9. Admin creates quote → QUOTED — customer receives quote email
10. Customer logs in to /account/custom-orders/:id
11. Customer approves quote → APPROVED_BY_CUSTOMER
12. Customer pays 50% deposit → DEPOSIT_PAID
13. Admin sets IN_PRODUCTION, provides production updates
14. Admin sets READY_FOR_FINAL_PAYMENT
15. Customer pays remaining 50% → FINAL_PAYMENT_PAID
16. Admin ships, enters tracking → SHIPPED
17. Customer receives → COMPLETED
```

### Journey 4: Admin Operations

```
1. Admin logs in at /login (redirected to /admin/dashboard)
2. Dashboard shows: today's revenue, pending orders, low stock alerts, pending custom orders
3. Reviews new order → /admin/orders/:id
4. Processes fulfillment: updates status to PROCESSING → SHIPPED + tracking number
5. Customer receives shipping email automatically
6. Checks /admin/inventory for low-stock items
7. Creates new product → /admin/products/new (full form with image upload)
8. Reviews press/wholesale inquiries in /admin/inquiries
```

---

## 7. Frontend Architecture

### Technology Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Build tool | Vite | 10–100x faster HMR than webpack, native ESM |
| UI framework | React 18 | concurrent mode, ecosystem maturity |
| Type safety | TypeScript strict mode | catches product/price type bugs |
| Styling | Tailwind CSS | design system constraints in the config, no CSS drift |
| Animation | Framer Motion | imperative gesture + declarative animation, performant |
| Server state | TanStack Query v5 | cache, pagination, optimistic updates |
| Client state | Zustand | minimal boilerplate, persist middleware for auth/cart |
| Forms | React Hook Form + Zod | performance (no re-renders per keystroke), schema-first |
| HTTP client | Axios | interceptors for token refresh |
| Routing | React Router v6 | mature, file-system-ready if migrated to Remix |
| Testing | Vitest + Testing Library | Jest-compatible, Vite-native, fast |

### State Architecture

**Zustand Stores**:

```
auth.store.ts     — user profile, tokens, isAuthenticated, isAdmin
cart.store.ts     — cart items, drawer open/close, coupon state
ui.store.ts       — global loading, toast messages, search overlay state
```

**TanStack Query**:
- All API calls go through query hooks in `src/hooks/`
- 5-minute stale time, 10-minute garbage collection time
- Optimistic updates for cart add/remove
- Query invalidation after checkout, review submit, address save

**Separation of concerns**:
- Zustand = UI state that must survive page navigation (auth session, cart)
- TanStack Query = server-derived data with caching
- `useState` = component-local ephemeral state (form steps, selected variant, accordion open)

### Routing Strategy

- All routes use `React.lazy` + `Suspense` for code splitting
- `PageLoader` component as Suspense fallback (skeleton with luxury shimmer)
- Route guards:
  - `ProtectedRoute`: redirects to /login if not authenticated
  - `AdminRoute`: redirects to /403 if not ADMIN or SUPER_ADMIN
- `MainLayout` wraps all public/shop/account routes (Header + Footer + CartDrawer)
- `AuthLayout` wraps /login, /register, /forgot-password (no header/footer)
- `AdminLayout` wraps all /admin routes (sidebar nav, no main footer)

### Data Flow

```
User Action
  → Component calls hook (e.g. useAddToCart)
  → Hook calls mutation (TanStack Query useMutation)
  → Axios instance sends request with Bearer token + X-Session-Id
  → Backend responds
  → On success: invalidate cart query, update Zustand cart store
  → Cart drawer opens (Zustand UI state)
```

### Performance Targets

- LCP < 2.5s (hero image lazy-loaded, critical CSS inlined)
- FID < 100ms (no blocking JS in critical path)
- CLS < 0.1 (image dimensions always specified, skeleton placeholders)
- Bundle size: main chunk < 150kb gzipped (enforced via rollup config)
- Route chunks: each lazy page < 50kb gzipped

---

## 8. Backend Architecture

### Technology Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Runtime | Node.js 20 LTS | long-term support, excellent TypeScript ecosystem |
| Framework | Express 4 | battle-tested, middleware ecosystem, predictable |
| Type safety | TypeScript strict | prevents runtime type errors in payment/order logic |
| ORM | Prisma | type-safe queries, migration system, schema as truth |
| Database | PostgreSQL 16 | ACID compliance for orders/payments |
| Cache | Redis 7 | session-adjacent data, product cache, rate limiting |
| Auth | JWT (access 15m + refresh 7d) | stateless, scalable, short-lived access tokens |
| Validation | Zod | parse, don't validate — schema is the source of truth |
| Email | Nodemailer | flexible SMTP, works with any provider |
| Images | Cloudinary | CDN delivery, on-the-fly transforms |
| Payments | Stripe + PayPal | dual provider reduces failed checkout abandonment |
| API Docs | Swagger (swagger-jsdoc + swagger-ui-express) | auto-generates from JSDoc comments |

### Layer Architecture

```
Request
  → Nginx (reverse proxy)
  → Express middlewares (helmet, cors, compression, cookie-parser)
  → Stripe raw body parser (only for /api/webhooks/stripe)
  → JSON body parser
  → Routes (express.Router)
  → Middlewares (authenticate / optionalAuth / authorize / validate)
  → Controllers (thin: parse request, call service, send response)
  → Services (business logic, DB queries, cache reads/writes)
  → Prisma ORM
  → PostgreSQL
```

### Service Responsibilities

| Service | Responsibility |
|---|---|
| `auth.service.ts` | Register, login, refresh token, logout, password reset |
| `product.service.ts` | CRUD, slug generation, filtering, pagination, cache |
| `cart.service.ts` | Get/merge/add/update/remove, guest carts, coupon apply |
| `order.service.ts` | Create order from cart, status transitions, history |
| `payment.service.ts` | Stripe intent, PayPal order, webhook event processing |
| `custom-order.service.ts` | Intake, workflow transitions, quote, deposit/final payment |
| `upload.service.ts` | Cloudinary upload, folder organization, transformation |
| `email.service.ts` | Template rendering, SMTP send, all transactional emails |
| `admin.service.ts` | Dashboard aggregations, exports, bulk operations |
| `inventory.service.ts` | Stock checks, decrements on order, low-stock alerts |

### Caching Strategy

| Data | TTL | Strategy |
|---|---|---|
| Product list (paginated) | 5 min | Cache by query key, invalidate on product update |
| Single product | 1 hour | Cache by slug, invalidate on product update |
| Category list | 1 day | Low-change data |
| Collection list | 5 min | Invalidate on collection update |
| Site settings | 1 hour | Invalidate on settings save |
| Cart | 30 min | Cache by userId or sessionId |
| Admin dashboard stats | 5 min | Acceptable staleness for analytics |

---

## 9. Complete Folder Structure

### Frontend (`lady-b-fe/src/`)

```
src/
├── app/
│   └── router.tsx              # All 50+ routes, lazy-loaded
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MainLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   └── AdminSidebar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Spinner.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── Pagination.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Radio.tsx
│   │   ├── Accordion.tsx
│   │   ├── Tabs.tsx
│   │   └── Tooltip.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductSort.tsx
│   │   ├── ProductImageGallery.tsx
│   │   ├── VariantSelector.tsx
│   │   ├── QuantitySelector.tsx
│   │   ├── WishlistButton.tsx
│   │   └── ReviewCard.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   ├── AddressForm.tsx
│   │   ├── PaymentSection.tsx
│   │   ├── OrderSummary.tsx
│   │   └── StripePaymentElement.tsx
│   ├── common/
│   │   ├── FadeIn.tsx
│   │   ├── PageLoader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── SEOHead.tsx
│   │   └── ProtectedRoute.tsx
│   └── admin/
│       ├── DataTable.tsx
│       ├── StatCard.tsx
│       ├── ImageUpload.tsx
│       ├── StatusBadge.tsx
│       └── ConfirmDialog.tsx
├── pages/
│   ├── public/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── CraftsmanshipPage.tsx
│   │   └── ContactPage.tsx
│   ├── shop/
│   │   ├── ShopPage.tsx
│   │   ├── CollectionPage.tsx
│   │   ├── ProductPage.tsx
│   │   ├── SearchPage.tsx
│   │   └── WishlistPage.tsx
│   ├── cart/
│   │   └── CartPage.tsx
│   ├── checkout/
│   │   ├── CheckoutPage.tsx
│   │   ├── CheckoutSuccessPage.tsx
│   │   └── CheckoutCancelPage.tsx
│   ├── custom/
│   │   ├── BespokeLandingPage.tsx
│   │   └── CustomOrderStartPage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── ResetPasswordPage.tsx
│   ├── account/
│   │   ├── AccountDashboard.tsx
│   │   ├── AccountOrders.tsx
│   │   ├── AccountOrderDetail.tsx
│   │   ├── AccountCustomOrders.tsx
│   │   ├── AccountCustomOrderDetail.tsx
│   │   ├── AccountWishlist.tsx
│   │   ├── AccountProfile.tsx
│   │   ├── AccountAddresses.tsx
│   │   └── AccountSettings.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   ├── AdminProductForm.tsx
│   │   ├── AdminOrders.tsx
│   │   ├── AdminOrderDetail.tsx
│   │   ├── AdminCustomOrders.tsx
│   │   ├── AdminCustomOrderDetail.tsx
│   │   ├── AdminCustomers.tsx
│   │   ├── AdminCustomerDetail.tsx
│   │   ├── AdminCollections.tsx
│   │   ├── AdminCategories.tsx
│   │   ├── AdminCoupons.tsx
│   │   ├── AdminInventory.tsx
│   │   ├── AdminReviews.tsx
│   │   ├── AdminInquiries.tsx
│   │   ├── AdminNewsletter.tsx
│   │   ├── AdminAnalytics.tsx
│   │   └── AdminSettings.tsx
│   ├── legal/
│   │   ├── PrivacyPolicy.tsx
│   │   ├── TermsOfService.tsx
│   │   ├── ReturnPolicy.tsx
│   │   ├── ShippingPolicy.tsx
│   │   └── CookiePolicy.tsx
│   └── errors/
│       ├── NotFoundPage.tsx
│       ├── ForbiddenPage.tsx
│       └── ErrorPage.tsx
├── hooks/
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useCart.ts
│   ├── useWishlist.ts
│   ├── useOrders.ts
│   ├── useCustomOrders.ts
│   ├── useAuth.ts
│   ├── useAddresses.ts
│   └── useAdmin.ts
├── lib/
│   ├── axios.ts            # Axios instance, interceptors
│   ├── queryClient.ts      # TanStack Query config
│   ├── stripe.ts           # Stripe.js init
│   └── utils.ts            # formatPrice, formatDate, cn(), etc.
├── store/
│   ├── auth.store.ts
│   ├── cart.store.ts
│   └── ui.store.ts
├── types/
│   ├── api.ts              # Response wrapper types
│   ├── product.ts
│   ├── order.ts
│   ├── cart.ts
│   ├── user.ts
│   └── custom-order.ts
├── config/
│   └── index.ts            # VITE_ env vars, validated at runtime
├── styles/
│   └── globals.css
└── test/
    └── setup.ts
```

### Backend (`lady-b-be/src/`)

```
src/
├── app.ts                  # Express app setup
├── server.ts               # Bootstrap, graceful shutdown
├── config/
│   ├── env.ts              # Zod env validation
│   ├── redis.ts            # Redis singleton + helpers
│   └── swagger.ts          # Swagger config
├── controllers/
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   ├── category.controller.ts
│   ├── collection.controller.ts
│   ├── cart.controller.ts
│   ├── order.controller.ts
│   ├── checkout.controller.ts
│   ├── webhook.controller.ts
│   ├── custom-order.controller.ts
│   ├── wishlist.controller.ts
│   ├── review.controller.ts
│   ├── upload.controller.ts
│   ├── user.controller.ts
│   ├── coupon.controller.ts
│   ├── newsletter.controller.ts
│   ├── contact.controller.ts
│   ├── shipping.controller.ts
│   └── admin.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── category.service.ts
│   ├── collection.service.ts
│   ├── cart.service.ts
│   ├── order.service.ts
│   ├── payment.service.ts
│   ├── custom-order.service.ts
│   ├── wishlist.service.ts
│   ├── review.service.ts
│   ├── upload.service.ts
│   ├── email.service.ts
│   ├── user.service.ts
│   ├── coupon.service.ts
│   ├── inventory.service.ts
│   └── admin.service.ts
├── routes/
│   ├── index.ts            # Mounts all routers
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── category.routes.ts
│   ├── collection.routes.ts
│   ├── cart.routes.ts
│   ├── order.routes.ts
│   ├── checkout.routes.ts
│   ├── webhook.routes.ts
│   ├── custom-order.routes.ts
│   ├── wishlist.routes.ts
│   ├── review.routes.ts
│   ├── upload.routes.ts
│   ├── user.routes.ts
│   ├── coupon.routes.ts
│   ├── newsletter.routes.ts
│   ├── contact.routes.ts
│   ├── shipping.routes.ts
│   └── admin.routes.ts
├── middlewares/
│   ├── auth.middleware.ts  # authenticate, optionalAuth
│   ├── authorize.middleware.ts  # requireRole
│   ├── validate.middleware.ts   # Zod request validation
│   ├── error.middleware.ts      # Global error handler
│   ├── rateLimit.middleware.ts  # express-rate-limit configs
│   └── upload.middleware.ts     # multer config for Cloudinary
├── schemas/
│   ├── auth.schema.ts
│   ├── product.schema.ts
│   ├── order.schema.ts
│   ├── cart.schema.ts
│   ├── custom-order.schema.ts
│   └── user.schema.ts
├── utils/
│   ├── response.ts         # sendSuccess, sendError, etc.
│   ├── slugify.ts          # generateUniqueProductSlug
│   ├── crypto.ts           # token generation helpers
│   └── pagination.ts       # getPaginationParams, paginate
└── types/
    ├── express.d.ts        # req.user type extension
    └── index.ts
```

---

## 10. Complete Frontend Routes

| Path | Component | Auth | Layout |
|---|---|---|---|
| `/` | HomePage | No | Main |
| `/shop` | ShopPage | No | Main |
| `/shop/:category` | ShopPage | No | Main |
| `/collections` | redirect → /shop | No | — |
| `/collections/:slug` | CollectionPage | No | Main |
| `/products/:slug` | ProductPage | No | Main |
| `/search` | SearchPage | No | Main |
| `/wishlist` | WishlistPage | No | Main |
| `/cart` | CartPage | No | Main |
| `/checkout` | CheckoutPage | No | Main |
| `/checkout/success` | CheckoutSuccessPage | No | Main |
| `/checkout/cancel` | CheckoutCancelPage | No | Main |
| `/bespoke` | BespokeLandingPage | No | Main |
| `/bespoke/start` | CustomOrderStartPage | No | Main |
| `/about` | AboutPage | No | Main |
| `/craftsmanship` | CraftsmanshipPage | No | Main |
| `/contact` | ContactPage | No | Main |
| `/wholesale` | WholesalePage | No | Main |
| `/press` | PressPage | No | Main |
| `/login` | LoginPage | No | Auth |
| `/register` | RegisterPage | No | Auth |
| `/forgot-password` | ForgotPasswordPage | No | Auth |
| `/reset-password` | ResetPasswordPage | No | Auth |
| `/account` | AccountDashboard | Customer | Main |
| `/account/orders` | AccountOrders | Customer | Main |
| `/account/orders/:id` | AccountOrderDetail | Customer | Main |
| `/account/custom-orders` | AccountCustomOrders | Customer | Main |
| `/account/custom-orders/:id` | AccountCustomOrderDetail | Customer | Main |
| `/account/wishlist` | AccountWishlist | Customer | Main |
| `/account/profile` | AccountProfile | Customer | Main |
| `/account/addresses` | AccountAddresses | Customer | Main |
| `/account/settings` | AccountSettings | Customer | Main |
| `/admin` | AdminDashboard | Admin | Admin |
| `/admin/products` | AdminProducts | Admin | Admin |
| `/admin/products/new` | AdminProductForm | Admin | Admin |
| `/admin/products/:id` | AdminProductForm | Admin | Admin |
| `/admin/orders` | AdminOrders | Admin | Admin |
| `/admin/orders/:id` | AdminOrderDetail | Admin | Admin |
| `/admin/custom-orders` | AdminCustomOrders | Admin | Admin |
| `/admin/custom-orders/:id` | AdminCustomOrderDetail | Admin | Admin |
| `/admin/customers` | AdminCustomers | Admin | Admin |
| `/admin/customers/:id` | AdminCustomerDetail | Admin | Admin |
| `/admin/collections` | AdminCollections | Admin | Admin |
| `/admin/categories` | AdminCategories | Admin | Admin |
| `/admin/coupons` | AdminCoupons | Admin | Admin |
| `/admin/inventory` | AdminInventory | Admin | Admin |
| `/admin/reviews` | AdminReviews | Admin | Admin |
| `/admin/inquiries` | AdminInquiries | Admin | Admin |
| `/admin/newsletter` | AdminNewsletter | Admin | Admin |
| `/admin/analytics` | AdminAnalytics | Admin | Admin |
| `/admin/settings` | AdminSettings | SuperAdmin | Admin |
| `/privacy-policy` | PrivacyPolicy | No | Main |
| `/terms-of-service` | TermsOfService | No | Main |
| `/return-policy` | ReturnPolicy | No | Main |
| `/shipping-policy` | ShippingPolicy | No | Main |
| `/cookie-policy` | CookiePolicy | No | Main |
| `*` | NotFoundPage | No | Main |
| `/403` | ForbiddenPage | No | Main |

---

## 11. Complete Backend API Endpoints

### Auth (`/api/auth`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new customer account |
| POST | `/login` | No | Login, return access + refresh tokens |
| POST | `/refresh` | No | Rotate refresh token, return new access token |
| POST | `/logout` | Yes | Invalidate refresh token |
| POST | `/forgot-password` | No | Send password reset email |
| POST | `/reset-password` | No | Reset password with token |
| GET | `/me` | Yes | Get current authenticated user |

### Products (`/api/products`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | No | List products (filter, sort, paginate) |
| GET | `/:slug` | No | Get single product by slug |
| POST | `/` | Admin | Create product |
| PATCH | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Soft delete product |
| POST | `/:id/images` | Admin | Upload product images |
| DELETE | `/:id/images/:imageId` | Admin | Remove product image |
| PATCH | `/:id/images/:imageId/primary` | Admin | Set primary image |

### Categories (`/api/categories`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | No | List all categories |
| GET | `/:slug` | No | Get category with products |
| POST | `/` | Admin | Create category |
| PATCH | `/:id` | Admin | Update category |
| DELETE | `/:id` | Admin | Delete category |

### Collections (`/api/collections`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | No | List active collections |
| GET | `/:slug` | No | Get collection with products |
| POST | `/` | Admin | Create collection |
| PATCH | `/:id` | Admin | Update collection |
| DELETE | `/:id` | Admin | Delete collection |
| POST | `/:id/products` | Admin | Add products to collection |
| DELETE | `/:id/products/:productId` | Admin | Remove product from collection |
| PATCH | `/:id/products/reorder` | Admin | Update product sort order in collection |

### Cart (`/api/cart`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Optional | Get cart (by userId or sessionId) |
| POST | `/items` | Optional | Add item to cart |
| PATCH | `/items/:id` | Optional | Update item quantity |
| DELETE | `/items/:id` | Optional | Remove item from cart |
| DELETE | `/` | Optional | Clear entire cart |
| POST | `/merge` | Yes | Merge guest cart into user cart on login |
| POST | `/coupon` | Optional | Apply coupon code |
| DELETE | `/coupon` | Optional | Remove coupon |

### Checkout (`/api/checkout`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/stripe/create-payment-intent` | Optional | Create Stripe PaymentIntent |
| POST | `/stripe/confirm` | Optional | Confirm payment, create order |
| POST | `/paypal/create-order` | Optional | Create PayPal order |
| POST | `/paypal/capture/:orderId` | Optional | Capture PayPal payment, create order |
| POST | `/guest` | No | Guest checkout (no account required) |
| GET | `/shipping-rates` | Optional | Get shipping options for address |

### Orders (`/api/orders`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | List current user's orders |
| GET | `/:id` | Yes | Get order by ID (owner or admin) |
| POST | `/:id/cancel` | Yes | Cancel order (only if PENDING) |
| GET | `/:id/tracking` | Yes | Get shipping tracking info |

### Custom Orders (`/api/custom-orders`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Optional | Submit bespoke custom order intake |
| GET | `/` | Yes | List customer's custom orders |
| GET | `/:id` | Yes | Get custom order detail |
| POST | `/:id/approve-quote` | Yes | Customer approves admin quote |
| POST | `/:id/reject-quote` | Yes | Customer rejects admin quote |
| POST | `/:id/pay-deposit` | Yes | Customer pays deposit (Stripe) |
| POST | `/:id/pay-final` | Yes | Customer pays final balance |

### Wishlist (`/api/wishlist`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Get wishlist items |
| POST | `/` | Yes | Add product to wishlist |
| DELETE | `/:productId` | Yes | Remove from wishlist |

### Reviews (`/api/reviews`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Yes | Submit review (requires verified purchase) |
| GET | `/product/:productId` | No | Get approved reviews for product |
| PATCH | `/:id` | Yes | Update own review |
| DELETE | `/:id` | Yes | Delete own review |

### User Account (`/api/users`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/me` | Yes | Get profile |
| PATCH | `/me` | Yes | Update profile (name, phone) |
| PATCH | `/me/password` | Yes | Change password |
| DELETE | `/me` | Yes | Request account deletion |
| GET | `/me/addresses` | Yes | List saved addresses |
| POST | `/me/addresses` | Yes | Add address |
| PATCH | `/me/addresses/:id` | Yes | Update address |
| DELETE | `/me/addresses/:id` | Yes | Delete address |
| PATCH | `/me/addresses/:id/default` | Yes | Set default address |

### Upload (`/api/upload`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/image` | Admin | Upload single image to Cloudinary |
| POST | `/images` | Admin | Upload multiple images |
| DELETE | `/image` | Admin | Delete image from Cloudinary by public_id |

### Webhooks (`/api/webhooks`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/stripe` | Sig | Stripe webhook (raw body, signature verified) |
| POST | `/paypal` | Header | PayPal IPN/webhook |

### Newsletter (`/api/newsletter`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/subscribe` | No | Subscribe email to newsletter |
| POST | `/unsubscribe` | No | Unsubscribe (token from email link) |

### Contact (`/api/contact`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | No | Submit contact form |
| POST | `/wholesale` | No | Submit wholesale inquiry |
| POST | `/press` | No | Submit press inquiry |

### Shipping (`/api/shipping`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/rates` | Optional | Get rates for address + items |
| GET | `/countries` | No | List supported shipping countries |

### Coupons (`/api/coupons`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/validate` | Optional | Validate coupon code, return discount |

### Admin (`/api/admin`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/dashboard` | Admin | Stats: revenue, orders, customers, custom orders |
| GET | `/orders` | Admin | All orders (filter, sort, paginate) |
| PATCH | `/orders/:id/status` | Admin | Update order status |
| PATCH | `/orders/:id/tracking` | Admin | Set tracking number |
| GET | `/custom-orders` | Admin | All custom orders |
| PATCH | `/custom-orders/:id/status` | Admin | Update custom order status |
| POST | `/custom-orders/:id/quote` | Admin | Create/update quote for custom order |
| GET | `/customers` | Admin | List all customers |
| GET | `/customers/:id` | Admin | Customer detail + orders |
| PATCH | `/customers/:id/status` | Admin | Activate/deactivate account |
| GET | `/inventory` | Admin | Products with stock levels |
| PATCH | `/inventory/:variantId` | Admin | Update stock quantity |
| GET | `/reviews` | Admin | All reviews pending/approved/rejected |
| PATCH | `/reviews/:id/status` | Admin | Approve/reject review |
| GET | `/inquiries` | Admin | Wholesale + press inquiries |
| PATCH | `/inquiries/:id/status` | Admin | Update inquiry status |
| GET | `/newsletter` | Admin | Subscriber list |
| GET | `/analytics` | Admin | Revenue charts, product performance |
| POST | `/coupons` | Admin | Create coupon |
| GET | `/coupons` | Admin | List coupons |
| PATCH | `/coupons/:id` | Admin | Update coupon |
| DELETE | `/coupons/:id` | Admin | Delete coupon |
| GET | `/settings` | Admin | Get all site settings |
| PATCH | `/settings` | SuperAdmin | Update site settings |
| POST | `/products/:id/duplicate` | Admin | Duplicate product |

**Total: 100+ endpoints**

---

## 12. Database Schema Plan

### Core Entities

```
User ←→ Address (1:many)
User ←→ Order (1:many)
User ←→ CustomOrder (1:many)
User ←→ Cart (1:1, optional — guest carts have sessionId instead)
User ←→ Wishlist (1:1)
User ←→ Review (1:many)

Product ←→ ProductImage (1:many)
Product ←→ ProductVariant (1:many)
Product ←→ Category (many:1)
Product ←→ Review (1:many)
Product ←→ WishlistItem (1:many)
Product ←→ CartItem (1:many)
Product ←→ OrderItem (1:many)
Product ←→ CollectionProduct (many:many via join table)

Collection ←→ CollectionProduct ←→ Product
Category ←→ Product (1:many)

Cart ←→ CartItem (1:many)
CartItem ←→ Product
CartItem ←→ ProductVariant (optional)

Order ←→ OrderItem (1:many)
Order ←→ Payment (1:many)
Order ←→ Address (address snapshot embedded as JSON)

CustomOrder ←→ CustomOrderImage (1:many)
CustomOrder ←→ CustomOrderQuote (1:many)
CustomOrder ←→ Payment (1:many)

Coupon ←→ Order (1:many, applied coupons)

InventoryLog ←→ ProductVariant (many:1)
AuditLog ←→ User (admin who performed action)
```

### Key Design Decisions

1. **Soft deletes** on User, Product, CustomOrder — never delete records that have financial history
2. **Address snapshot on Order** — shipping address is embedded JSON, not a FK, so it's immutable after order placement
3. **Cart duality** — `Cart.userId` OR `Cart.sessionId`, never both null, with DB-level constraint
4. **Payment records** — every payment attempt is logged regardless of success/failure
5. **Review gating** — reviews require a verified order item (enforced at service layer)
6. **Inventory via ProductVariant** — even single-variant products have a ProductVariant record with stock count
7. **All prices as Decimal(10,2)** — never store money as float

---

## 13. Prisma Schema

The full Prisma schema is at `lady-b-be/prisma/schema.prisma`. Key notes:

### Enums
```
UserRole:            CUSTOMER | ADMIN | SUPER_ADMIN
ProductStatus:       DRAFT | ACTIVE | ARCHIVED
OrderStatus:         PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED
PaymentStatus:       PENDING | COMPLETED | FAILED | REFUNDED | PARTIALLY_REFUNDED
PaymentProvider:     STRIPE | PAYPAL | MANUAL
CustomOrderStatus:   SUBMITTED | REVIEWING | QUOTED | APPROVED_BY_CUSTOMER |
                     DEPOSIT_PAID | IN_PRODUCTION | READY_FOR_FINAL_PAYMENT |
                     FINAL_PAYMENT_PAID | SHIPPED | COMPLETED | CANCELLED | REJECTED
InquiryStatus:       NEW | IN_PROGRESS | COMPLETED | ARCHIVED
ReviewStatus:        PENDING | APPROVED | REJECTED
DiscountType:        PERCENTAGE | FIXED_AMOUNT | FREE_SHIPPING
InventoryAction:     RESTOCK | SALE | ADJUSTMENT | RETURN
AuditAction:         CREATE | UPDATE | DELETE | STATUS_CHANGE | LOGIN | LOGOUT
CustomProductType:   BAG | NECKLACE | EARRINGS | BRACELET | SET | OTHER
```

### Critical Fields
- `Product.slug` — unique, URL-safe, generated from name
- `Collection.slug` — unique
- `Category.slug` — unique
- `User.deletedAt` — soft delete (queries always include `WHERE deletedAt IS NULL`)
- `Product.deletedAt` — soft delete
- `Order.shippingAddressSnapshot` — `Json` type (immutable after order)
- `CustomOrder.depositAmount` + `finalAmount` — calculated at quote time as 50/50
- `Payment.stripePaymentIntentId` / `paypalOrderId` — provider-specific IDs for reconciliation

---

## 14. Authentication and Authorization Plan

### Token Architecture

```
POST /auth/login response:
{
  accessToken: JWT (15m expiry, signed with JWT_ACCESS_SECRET)
  refreshToken: JWT (7d expiry, signed with JWT_REFRESH_SECRET)
  user: { id, email, firstName, lastName, role }
}
```

**Access token payload**:
```json
{ "sub": "user_id", "email": "email", "role": "CUSTOMER", "iat": 000, "exp": 000 }
```

**Refresh token**:
- Stored in `User.refreshToken` (hashed with bcrypt) in the database
- Single active refresh token per user — login invalidates previous
- On refresh: verify signature → hash compare → issue new pair → rotate stored hash
- On logout: null out stored hash

**Token storage (frontend)**:
- `accessToken` in Zustand store (memory — not localStorage)
- `refreshToken` in Zustand with `persist` middleware → localStorage
- On 401: axios interceptor calls `POST /auth/refresh`, retries original request once

### Role-Based Access Control

```
UserRole.CUSTOMER:
  - Own orders, custom orders, wishlist, addresses, profile
  - Public shop, product pages, search

UserRole.ADMIN:
  - All CUSTOMER permissions
  - /admin/products, /admin/orders, /admin/custom-orders, /admin/customers
  - /admin/inventory, /admin/reviews, /admin/inquiries, /admin/coupons
  - /admin/analytics, /admin/newsletter

UserRole.SUPER_ADMIN:
  - All ADMIN permissions
  - /admin/settings (site configuration)
  - Account management (promote/demote roles)
```

### Middleware Chain for Protected Routes

```
Router → authenticate → requireRole('ADMIN') → controller
Router → authenticate → controller                          (customer routes)
Router → optionalAuth → controller                          (cart, product — works with or without auth)
```

### Password Security
- Passwords hashed with bcrypt (12 rounds)
- Password reset tokens: `crypto.randomBytes(32).toString('hex')`, stored hashed, 1-hour expiry
- Rate limiting on `/auth/login`: 10 attempts per 15 minutes per IP

---

## 15. Custom Order Workflow

### 12-Status State Machine

```
SUBMITTED
  ↓ Admin reviews intake
REVIEWING
  ↓ Admin creates quote
QUOTED ←────────────────────────── Admin can re-quote
  ↓ Customer approves            ↓ Customer rejects → back to REVIEWING
APPROVED_BY_CUSTOMER
  ↓ Customer pays 50% deposit
DEPOSIT_PAID
  ↓ Admin starts production
IN_PRODUCTION (admin posts progress updates)
  ↓ Production complete
READY_FOR_FINAL_PAYMENT
  ↓ Customer pays remaining 50%
FINAL_PAYMENT_PAID
  ↓ Admin ships, adds tracking
SHIPPED
  ↓ Confirmed delivered (manual or webhook from shipping provider)
COMPLETED

At any stage (before DEPOSIT_PAID):
  → CANCELLED (customer)
  → REJECTED (admin)
```

### Quote Structure

```json
{
  "productionCost": 600.00,
  "depositAmount": 300.00,
  "finalAmount": 300.00,
  "estimatedLeadWeeks": 10,
  "notes": "Includes Swarovski crystal beading as requested",
  "validUntilDate": "2026-07-10"
}
```

### Intake Form Fields
- `productType` (CustomProductType enum)
- `colorPalette` (text — e.g. "emerald, ivory, gold")
- `dimensions` (text — e.g. "handheld clutch, roughly 25cm x 15cm")
- `occasion` (text)
- `beadPreferences` (text)
- `referenceImages` (array of Cloudinary URLs)
- `budgetRange` (e.g. "$500–$800")
- `timelineFlexibility` (boolean + text)
- `additionalNotes` (text)
- `contactEmail` (string — for unauthenticated submissions)

### Admin Actions Per Status
| Status | Available Admin Actions |
|---|---|
| SUBMITTED | → REVIEWING |
| REVIEWING | Create quote → QUOTED, → REJECTED |
| QUOTED | Re-quote, → REJECTED |
| APPROVED_BY_CUSTOMER | Wait for deposit (system) |
| DEPOSIT_PAID | → IN_PRODUCTION |
| IN_PRODUCTION | Post progress update, → READY_FOR_FINAL_PAYMENT |
| READY_FOR_FINAL_PAYMENT | Wait for final payment (system) |
| FINAL_PAYMENT_PAID | Add tracking → SHIPPED |
| SHIPPED | → COMPLETED |

---

## 16. Product Catalog Architecture

### Product Model Key Fields

```
name, slug, description (rich text HTML), shortDescription
price (Decimal), compareAtPrice (Decimal — for sale display)
category (FK), collections (many:many)
status: DRAFT | ACTIVE | ARCHIVED
featured, bestSeller, newArrival, madeToOrder (booleans)
leadDays (int — for made-to-order ETA)
lowStockThreshold (int)
weight (Decimal — for shipping calculations)
materials, dimensions, careInstructions (text)
metaTitle, metaDescription, metaKeywords (SEO)
images (1:many ProductImage)
variants (1:many ProductVariant)
```

### ProductVariant Fields
```
sku (unique), name (e.g. "Ivory / Medium")
color, size, material (optional text fields)
stock (int), price (Decimal — optional override of product base price)
```

### Filtering & Sorting

Supported query params on `GET /products`:
```
?page=1&limit=24
?category=bags
?collection=new-arrivals
?minPrice=100&maxPrice=500
?color=ivory,emerald
?sort=price_asc|price_desc|newest|featured|best_seller
?featured=true
?newArrival=true
?bestSeller=true
?q=necklace    (full-text search on name + description)
```

### Slug Generation

```typescript
generateUniqueProductSlug(name: string): Promise<string>
// 1. slugify(name) → lowercase, hyphens, no special chars
// 2. Query DB: does slug exist?
// 3. If yes, append -2, -3, etc. until unique
// 4. Return unique slug
```

---

## 17. Cart and Checkout Flow

### Cart Architecture

**Dual-mode cart** — works for both authenticated users and guests:

```
Authenticated: Cart identified by userId
Guest:         Cart identified by sessionId (UUID in localStorage via X-Session-Id header)
Login:         POST /cart/merge → merge guest cart items into user cart
```

**Cart calculation at checkout**:
```
subtotal     = Σ (item.price × item.quantity)
discount     = couponDiscount (percentage or fixed)
shipping     = calculated from carrier API or flat rate
tax          = 0% (for now — expand later per state)
total        = subtotal - discount + shipping
```

### Checkout Flow Detail

```
1. GET /checkout/shipping-rates?address=...&items=...
   → Returns available shipping methods with prices

2. POST /checkout/stripe/create-payment-intent
   Body: { cartId, shippingAddressId, shippingMethodId, email (if guest) }
   → Calculates final total
   → Creates PaymentIntent with metadata
   → Returns: { clientSecret, orderId (draft) }

3. Frontend: Stripe.confirmPayment({ elements, clientSecret })
   → Stripe processes payment

4. Stripe webhook: payment_intent.succeeded
   POST /api/webhooks/stripe
   → Verify signature
   → Update draft Order to PROCESSING
   → Decrement inventory
   → Clear cart
   → Send confirmation email

5. Frontend: redirected to /checkout/success?orderId=xxx
```

### Guest Checkout Additional Step
- Guest provides email at checkout start
- On success page, offered "Create account to track your order"
- If they register, their guest order history is linked by email

---

## 18. Payment Architecture

### Stripe Integration

```typescript
// Create PaymentIntent
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(totalInUSD * 100), // cents
  currency: 'usd',
  metadata: {
    cartId,
    userId: userId ?? 'guest',
    sessionId: sessionId ?? '',
  },
  automatic_payment_methods: { enabled: true },
});
```

**Webhook events handled**:
| Event | Action |
|---|---|
| `payment_intent.succeeded` | Confirm order, decrement stock, send confirmation |
| `payment_intent.payment_failed` | Update payment record to FAILED |
| `charge.refunded` | Update order/payment to REFUNDED |
| `customer.subscription.*` | (future — loyalty/subscription) |

**Webhook security**: Raw body parser at `/api/webhooks/stripe`, `stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)`.

### PayPal Integration

```
1. POST /checkout/paypal/create-order
   → PayPal Orders API v2: createOrder({ intent: 'CAPTURE', ... })
   → Returns: { paypalOrderId }

2. Frontend: PayPal JS SDK renders button, user approves
   → PayPal calls onApprove({ orderID })

3. POST /checkout/paypal/capture/:orderId
   → PayPal Orders API: captureOrder(paypalOrderId)
   → On success: create Order record, same flow as Stripe success
```

### Future: Flutterwave / Paystack
- Mobile money integration for Nigerian/West African customers
- Paystack for cards + bank transfers in NGN
- Flutterwave for multi-currency African payments
- Architecture supports this via `PaymentProvider` enum — add new enum value + handler

### Refund Flow
- Admin initiates from `/admin/orders/:id`
- `POST /admin/orders/:id/refund` with `{ amount, reason }`
- Service calls `stripe.refunds.create({ payment_intent: ... })`
- Webhook `charge.refunded` → update Order + Payment records
- Email sent to customer

---

## 19. Admin Dashboard Specification

### Dashboard KPIs (real-time from DB)

```
Revenue Today       SUM(orders.total WHERE date = today AND status ≠ CANCELLED)
Revenue MTD         SUM(orders.total WHERE date >= start_of_month)
Pending Orders      COUNT(orders WHERE status = PENDING | PROCESSING)
New Customers       COUNT(users WHERE createdAt >= 7 days ago)
Custom Orders       COUNT(customOrders WHERE status IN [SUBMITTED, REVIEWING, QUOTED])
Low Stock Items     COUNT(productVariants WHERE stock <= lowStockThreshold)
```

### Recent Orders Table
Columns: Order #, Customer, Date, Items, Total, Status (badge), Actions (View)

### Quick Actions
- Create new product
- View pending custom orders
- View new inquiries
- Export orders CSV

### Admin Product Form Fields
- Name, Slug (auto + manual override)
- Description (rich text — Tiptap or Quill)
- Short description
- Category (select)
- Collections (multi-select)
- Price, Compare-at-price
- Status (Draft / Active / Archived)
- Flags: Featured, Best Seller, New Arrival, Made to Order
- Lead days (if Made to Order)
- Materials, Dimensions, Care Instructions
- Weight (for shipping)
- SEO: Meta Title, Meta Description, Keywords
- Images: drag-and-drop upload, reorder, set primary
- Variants: add/remove rows (SKU, Color, Size, Stock, Price override)

---

## 20. Component Library Specification

### Primitive UI Components

**Button**
```tsx
<Button variant="primary|secondary|ghost|danger" size="sm|md|lg" loading={bool} disabled={bool}>
```
- primary: charcoal-900 bg, ivory text
- secondary: transparent, charcoal-900 border + text
- ghost: transparent, no border, charcoal text

**Input**
```tsx
<Input label="Email" error="Required" hint="We'll never share this" type="text|email|password" />
```
- `.input-luxury` class: ivory bg, charcoal-900 border-b, focus ring in gold-champagne

**Badge**
```tsx
<Badge variant="success|warning|error|info|gold|neutral">SHIPPED</Badge>
```

**ProductCard**
```tsx
<ProductCard product={Product} showWishlist={bool} />
```
- 3:4 aspect ratio image with hover zoom
- Name, price, optional compare-at-price with strikethrough
- Badge overlay: "New" | "Made to Order" | "Low Stock"
- Wishlist heart button
- Quick-add button on hover

**CartDrawer**
- Framer Motion `AnimatePresence` + `motion.div` from right
- Overlay backdrop with `onClick` to close
- Item list: image, name, variant, quantity stepper, remove
- Subtotal + "Proceed to Checkout" CTA
- Free shipping progress bar

**FadeIn** (scroll animation wrapper)
```tsx
<FadeIn delay={0.1} direction="up|left|right|none">
  <Child />
</FadeIn>
```
Uses `react-intersection-observer` useInView + Framer Motion variants.

**PageLoader**
Skeleton shimmer blocks matching the page layout. Shown as Suspense fallback.

**SEOHead**
```tsx
<SEOHead title="Product Name | Lady B" description="..." ogImage="..." />
```
Uses `react-helmet-async`.

---

## 21. API Response Standards

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total": 156,
    "totalPages": 7,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Product not found",
  "details": [ ... ]   // Only for validation errors (Zod)
}
```

### HTTP Status Codes

| Code | When |
|---|---|
| 200 | Successful GET, PATCH, DELETE |
| 201 | Successful POST (resource created) |
| 400 | Validation error (Zod failure) |
| 401 | Missing or invalid auth token |
| 403 | Authenticated but insufficient role |
| 404 | Resource not found |
| 409 | Unique constraint conflict (duplicate email, slug) |
| 422 | Business logic error (e.g. out of stock, coupon expired) |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |

---

## 22. Error Handling Standards

### Backend Error Classes

```typescript
class AppError extends Error {
  constructor(public message: string, public statusCode: number, public code: string) {}
}

class NotFoundError extends AppError       // 404
class ValidationError extends AppError    // 400
class UnauthorizedError extends AppError  // 401
class ForbiddenError extends AppError     // 403
class ConflictError extends AppError      // 409
class BusinessError extends AppError      // 422
```

### Global Error Handler catches:
- Prisma `P2002` (unique constraint) → 409 ConflictError
- Prisma `P2025` (record not found) → 404 NotFoundError
- JWT `JsonWebTokenError` → 401 UnauthorizedError
- JWT `TokenExpiredError` → 401 UnauthorizedError
- Zod `ZodError` → 400 with `details` array
- All `AppError` subclasses → their `statusCode`
- Everything else → 500 (logged, sanitized message in production)

### Frontend Error Handling
- TanStack Query `onError` callbacks → toast notification
- Axios 401 → token refresh attempt → redirect to /login on failure
- React `ErrorBoundary` wraps all route pages → shows `ErrorPage` component
- Form errors from `react-hook-form` → inline field messages

---

## 23. Validation Strategy

### Backend — Zod + validate middleware

```typescript
// Schema definition
const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    price: z.number().positive(),
    categoryId: z.string().cuid(),
    // ...
  }),
});

// Route usage
router.post('/', authenticate, requireAdmin, validate(createProductSchema), controller.create);

// Middleware
const validate = (schema: ZodSchema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!result.success) throw new ValidationError(formatZodErrors(result.error));
  req.body = result.data.body;
  next();
};
```

### Frontend — React Hook Form + Zod

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### Environment Variables — Zod at startup

`validateEnv()` in `src/config/env.ts` is called before Express starts. Any missing or invalid env var throws with a descriptive list of failures. The server refuses to start with a bad config.

---

## 24. Security Strategy

### Authentication
- Bcrypt (12 rounds) for password hashing — resistant to brute force
- JWT access tokens (15m) — short window limits damage from token theft
- Refresh token rotation — old token invalidated on each refresh
- Single active session per user (refresh token stored in DB)

### Input Security
- Zod validation on all request bodies — rejects unexpected fields
- Helmet.js — sets 15+ HTTP security headers (CSP, HSTS, X-Frame-Options)
- `sanitize-html` on rich text fields (product descriptions, custom order notes)
- SQL injection impossible via Prisma parameterized queries
- No `eval`, no `innerHTML` in frontend

### Rate Limiting

| Endpoint | Limit |
|---|---|
| `POST /auth/login` | 10 req / 15 min per IP |
| `POST /auth/register` | 5 req / 1 hour per IP |
| `POST /auth/forgot-password` | 3 req / 1 hour per IP |
| `POST /contact` | 5 req / 1 hour per IP |
| `POST /newsletter/subscribe` | 5 req / 1 hour per IP |
| All other routes | 200 req / min per IP |

### Payment Security
- Stripe webhook verified via `stripe.webhooks.constructEvent` signature check
- Raw body parser for webhook endpoint only — never parsed by JSON middleware first
- Card data never touches Lady B servers — Stripe Elements handles it client-side
- PCI DSS SAQ-A compliance (iFrame-based card collection)

### CORS
- Allow-list: `CORS_ORIGIN` env var (e.g. `https://ladybdesigns.com`)
- Credentials: true (for cookie-based session fallback if needed)
- Methods: GET, POST, PATCH, DELETE, OPTIONS

### Security Headers (Helmet)
- `Content-Security-Policy`: restrict scripts to self + Stripe + PayPal + Cloudinary
- `Strict-Transport-Security`: `max-age=31536000; includeSubDomains`
- `X-Content-Type-Options`: nosniff
- `X-Frame-Options`: SAMEORIGIN
- `Referrer-Policy`: strict-origin-when-cross-origin

### Data Privacy
- Soft deletes — user data retained for order history/legal compliance
- Account deletion request: anonymize PII, keep order records with user ID nulled
- Email unsubscribe via token link — no login required
- No third-party tracking pixels by default (add cookie consent gate before adding)

---

## 25. Docker and Container Setup

### 5-Container Architecture

```
lady-b-postgres   — PostgreSQL 16 (data store)
lady-b-redis      — Redis 7 (cache)
lady-b-be         — Express backend
lady-b-fe         — Vite dev server / Nginx in production
lady-b-nginx      — Reverse proxy (routes /api to backend, / to frontend)
```

### Development Compose (`docker-compose.yml`)

- Backend: `target: development`, volume-mounted source, ts-node-dev for hot reload
- Frontend: `target: development`, volume-mounted source, Vite HMR on port 3000
- Nginx: `infrastructure/nginx/default.conf`
- Postgres + Redis with health checks

### Production Compose (`docker-compose.prod.yml`)

- Backend: `target: production`, compiled JS, no source mount
- Frontend: `target: production` — Nginx serving built static files from `/usr/share/nginx/html`
- Resource limits: backend 1 CPU / 1GB RAM, frontend 0.5 CPU / 512MB RAM
- `restart: always` on all services
- Separate `.env.prod` files

### Multi-Stage Dockerfiles

**Backend**:
```dockerfile
FROM node:20-alpine AS development
# ts-node-dev, source mount

FROM node:20-alpine AS builder
# npm ci, tsc build, prisma generate

FROM node:20-alpine AS production
# Copy /dist from builder, run node dist/server.js
# Run as non-root user
```

**Frontend**:
```dockerfile
FROM node:20-alpine AS development
# Vite dev server

FROM node:20-alpine AS builder
# npm ci, vite build (VITE_ args from docker build --build-arg)

FROM nginx:alpine AS production
# Copy /dist from builder to /usr/share/nginx/html
# Copy nginx.conf
```

---

## 26. Nginx Configuration Plan

### Development (`infrastructure/nginx/default.conf`)

```nginx
upstream backend  { server lady-b-be:4000; }
upstream frontend { server lady-b-fe:3000; }

server {
  listen 80;

  location /api/ { proxy_pass http://backend; }
  location /api/webhooks/stripe {
    proxy_request_buffering off;  # Critical: preserve raw body for Stripe sig
    proxy_pass http://backend;
  }
  location / { proxy_pass http://frontend; }

  # WebSocket for Vite HMR
  location /ws { proxy_pass http://frontend; proxy_http_version 1.1; upgrade; }
}
```

### Production (`infrastructure/nginx/nginx.prod.conf`)

```nginx
# HTTP → HTTPS redirect
server { listen 80; return 301 https://$host$request_uri; }

server {
  listen 443 ssl http2;
  ssl_certificate     /etc/nginx/ssl/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;

  # HSTS
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

  # API
  location /api/ { proxy_pass http://lady-b-be:4000; }

  # Static frontend (served directly by this Nginx, not proxied to container)
  root /usr/share/nginx/html;
  location / { try_files $uri $uri/ /index.html; }
  location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
}
```

---

## 27. CI/CD Workflows

### 5 GitHub Actions Workflows

**1. `frontend-ci.yml`** — triggers on push to main/develop when `lady-b-fe/**` changes
```
Install → ESLint → TypeScript check → Vitest → Vite build
```

**2. `backend-ci.yml`** — triggers on push to main/develop when `lady-b-be/**` changes
```
Install → ESLint → TypeScript check → Prisma generate → Prisma validate → DB migrate (test DB) → Tests (with postgres + redis services) → Build
```

**3. `docker-build.yml`** — triggers on push to main
```
Login to ghcr.io → Build + push backend image → Build + push frontend image (with VITE_ build args from secrets)
```
Tags: `sha-<commit>` + `latest`

**4. `security-scan.yml`** — triggers weekly (Monday 2am UTC) + on push to main
```
npm audit (high severity) → Gitleaks secret scanning → CodeQL SAST
```

**5. `deploy.yml`** — triggers on push to main + workflow_dispatch
```
SSH to production server → git pull → docker compose pull → prisma migrate deploy → docker compose up -d → health check
```

### Branch Strategy

```
main          — production-ready code, auto-deploys
develop       — integration branch, CI runs but no deploy
feature/*     — feature branches, PR → develop
hotfix/*      — hotfix branches, PR → main + develop
```

### Required GitHub Secrets

```
DEPLOY_SSH_KEY          — SSH private key for production server
DEPLOY_HOST             — Server IP/hostname
DEPLOY_USER             — SSH user
APP_URL                 — https://ladybdesigns.com
VITE_API_URL
VITE_STRIPE_PUBLIC_KEY
VITE_PAYPAL_CLIENT_ID
VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET
GITLEAKS_LICENSE        — Optional (Gitleaks Pro)
```

---

## 28. Testing Strategy

### Frontend Testing (Vitest + Testing Library)

**Unit tests** — pure functions and hooks:
- `lib/utils.ts` — formatPrice, formatDate, cn()
- `store/*.ts` — Zustand store actions
- Zod schemas — valid/invalid inputs

**Component tests** — Testing Library:
- `ProductCard` — renders name, price, badge variants
- `Button` — renders variants, handles loading state, disabled state
- `CartDrawer` — renders items, quantity update, remove
- `CheckoutForm` — validation errors, submit flow

**Integration tests** — msw (Mock Service Worker) for API:
- Add to cart flow
- Checkout form submission
- Login form with error states

**Setup**: `vitest.config.ts` → `environment: 'jsdom'`, `setupFiles: ['./src/test/setup.ts']`

### Backend Testing (Jest + Supertest)

**Unit tests** — services in isolation:
- `auth.service.ts` — hashing, token generation
- `product.service.ts` — slug generation, filtering logic
- `cart.service.ts` — price calculation, coupon application

**Integration tests** — full HTTP stack with test database:
- Auth endpoints: register, login, refresh, logout
- Product CRUD (admin)
- Cart add/update/remove
- Checkout flow (Stripe mock)
- Custom order intake + status transition

**Test database**: PostgreSQL instance in Docker (matches CI services config). Each test suite runs in a transaction that's rolled back after the test.

**Mocks**:
- Stripe SDK — `jest.mock('stripe')` for payment-related tests
- Nodemailer — `jest.mock('nodemailer')` to prevent real email sends
- Cloudinary — `jest.mock('cloudinary')` for upload tests

### Coverage Targets
- Services: 80% line coverage
- Controllers: 70% (tested via integration)
- Utils: 95%

---

## 29. SEO Strategy

### Technical SEO

- **React Helmet Async** for dynamic `<title>`, `<meta>`, Open Graph, Twitter Card tags on every page
- **Canonical URLs** set on all pages to prevent duplicate content
- **Sitemap.xml**: dynamically generated endpoint at `/api/sitemap.xml` — includes all active products, collections, categories, and static pages
- **robots.txt**: served from public folder — allow all, disallow `/admin`, `/account`
- **Structured data (JSON-LD)**:
  - Product pages: `Product` schema (name, image, description, price, availability, reviews)
  - Homepage: `Organization` schema (name, address, phone, email, social profiles)
  - Breadcrumbs: `BreadcrumbList` schema on product + collection pages

### On-Page SEO

- Product slugs are human-readable and keyword-rich (e.g. `/products/ivory-arch-bead-bag`)
- `metaTitle` and `metaDescription` fields on Product, Category, Collection models — admin-editable
- Image `alt` text required for all product images
- Heading hierarchy: H1 = product/page name, H2 = section titles, H3 = subsections

### Performance SEO (Core Web Vitals)

- Hero images: `width` + `height` attributes to prevent CLS, `loading="eager"`, `fetchpriority="high"`
- Product card images: `loading="lazy"`, explicit dimensions, Cloudinary auto-format + quality
- Font preconnect in `index.html`: `<link rel="preconnect" href="https://fonts.googleapis.com">`
- Critical CSS inlined via Vite plugin

---

## 30. Content Strategy

### Homepage Content Blocks

1. **Hero** — Full-screen image, headline, sub-headline, dual CTA ("Shop Collection" + "Commission Yours")
2. **Featured Collections** — 4 editorial collection cards with names and images
3. **Signature Product Spotlight** — Hero product (Ivory Arch Bead Bag), large editorial image, description, add-to-bag
4. **Craftsmanship Process** — 4 steps (Sketch → Materials → Beading → Finishing), each with icon + copy
5. **Bespoke Experience** — Emerald background section, tagline, process overview, "Commission Yours" CTA
6. **Why Lady B** — 6 value pillars: Handcrafted, Made to Last, Globally Shipped, Bespoke Available, Free Returns, Secure Checkout
7. **Testimonials** — 3 customer quotes with star ratings and customer names
8. **Footer** with newsletter sign-up

### Product Description Template

```
[Short emotive sentence about the piece] — 1 sentence.

[Craftsmanship detail] — describe the hours, technique, or material.

[Styling guidance] — what occasions, what to wear it with.

Materials: [list]
Dimensions: [list]
Care: [specific instructions]
```

### Email Content Templates

| Email | Subject Pattern |
|---|---|
| Order confirmation | "Your Lady B order is confirmed (#XXXXX)" |
| Shipping notification | "Your piece is on its way 🚚" |
| Custom order received | "We've received your bespoke request" |
| Quote sent | "Your custom quote from Lady B is ready" |
| Deposit received | "Deposit received — production begins soon" |
| Final payment due | "Your piece is ready — final payment now due" |
| Shipped (custom) | "Your bespoke piece has been shipped" |
| Password reset | "Reset your Lady B password" |
| Welcome | "Welcome to Lady B Designs and Handcraft" |

---

## 31. Conversion Optimization Strategy

### Checkout Friction Reduction
- Guest checkout — no forced account creation
- Address autocomplete (Google Places API or Radar.io)
- Stripe Payment Element — accepts Apple Pay, Google Pay, cards, BNPL
- PayPal button as one-click alternative
- Progress indicator: Cart → Information → Payment → Confirmation
- Order summary visible at all checkout steps (sticky on desktop)

### Trust Signals
- "Free shipping over $150" bar (from site settings)
- Secure checkout badge (Stripe SSL)
- Return policy text near checkout
- "Crafted by hand in Indianapolis, IN" beneath product names
- Real customer reviews with star ratings and verified purchase badge

### Urgency / Scarcity
- "Only 3 left" badge when stock ≤ low stock threshold
- "Ships in X–Y days" lead time on made-to-order items
- "X people have this in their cart" (optional, powered by Redis counter)

### Post-Purchase
- Order confirmation page offers account creation (one click, password set)
- "You might also love" product recommendations on confirmation page
- Email sequence: confirmation → shipping update → delivery → review request (7 days later)

### Cart Recovery
- CartDrawer always accessible via icon
- "Your cart has been saved" toast when user closes drawer with items
- Persistent cart via localStorage for guests
- Email cart abandonment sequence (future: Klaviyo integration)

---

## 32. Email Notification Strategy

### Email Infrastructure

- **Provider**: Nodemailer with SMTP (works with SendGrid, Mailgun, Postmark, or Gmail SMTP for dev)
- **Template engine**: Handlebars or simple string interpolation — HTML templates in `lady-b-be/src/emails/templates/`
- **Sender**: `Lady B Designs <noreply@ladybdesigns.com>`
- **Reply-to**: `Adebiyiblessing55@gmail.com`

### Transactional Email Triggers

| Trigger | Template | Recipient |
|---|---|---|
| User registration | `welcome.html` | Customer |
| Order placed | `order-confirmation.html` | Customer + Admin |
| Order shipped | `order-shipped.html` | Customer |
| Order delivered | `order-delivered.html` | Customer |
| Custom order received | `custom-order-received.html` | Customer + Admin |
| Custom order quote ready | `custom-order-quote.html` | Customer |
| Custom order quote rejected | `custom-order-re-quote.html` | Admin |
| Deposit received | `deposit-received.html` | Customer |
| Custom order shipped | `custom-order-shipped.html` | Customer |
| Password reset | `password-reset.html` | Customer |
| Low stock alert | `low-stock-alert.html` | Admin |
| New wholesale inquiry | `wholesale-inquiry.html` | Admin |
| New press inquiry | `press-inquiry.html` | Admin |
| Contact form submission | `contact-form.html` | Admin |

### Email Templates Structure

```
lady-b-be/src/emails/
├── templates/
│   ├── base.html              # Header + footer wrapper
│   ├── welcome.html
│   ├── order-confirmation.html
│   ├── order-shipped.html
│   ├── custom-order-received.html
│   ├── custom-order-quote.html
│   ├── deposit-received.html
│   └── password-reset.html
└── email.service.ts           # sendEmail(to, subject, templateName, data)
```

---

## 33. Deployment Strategy

### Infrastructure

**Recommended**: Single VPS or cloud VM (DigitalOcean Droplet, Linode, or AWS EC2 t3.medium minimum)

```
Server: Ubuntu 22.04 LTS
CPU:    2 vCPU
RAM:    4 GB
Disk:   80 GB SSD
Region: US-East (closest to Indianapolis target market)
```

**Domain**: `ladybdesigns.com` (or similar)
**DNS**: Cloudflare (free tier) — handles CDN, DDoS protection, SSL termination optional

**SSL**: Let's Encrypt via Certbot — auto-renews, certs mounted to Nginx container volume

### Initial Server Setup

```bash
# 1. Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER

# 2. Clone repo
git clone <repo> /opt/lady-b-commerce
cd /opt/lady-b-commerce

# 3. Environment
cp lady-b-be/.env.example lady-b-be/.env.prod
# Edit .env.prod with production values

# 4. SSL certs
certbot certonly --standalone -d ladybdesigns.com
# Mount to nginx container

# 5. Start
docker compose -f docker-compose.prod.yml up -d

# 6. DB setup
docker compose -f docker-compose.prod.yml exec lady-b-be npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec lady-b-be npx prisma db seed
```

### Zero-Downtime Deployment

GitHub Actions `deploy.yml` does a rolling restart:
```bash
git pull origin main
docker compose -f docker-compose.prod.yml pull    # Pull new images
docker compose -f docker-compose.prod.yml up -d   # Rolling update (old containers kept until new ones healthy)
docker image prune -f                              # Clean up
```

Health check after deploy: `curl -f https://ladybdesigns.com/api/health`

### Backup Strategy (from `infrastructure/scripts/backup-db.sh`)

```bash
# Runs on cron: 0 3 * * * (3am daily)
pg_dump → compressed .gz file
Upload to S3 or DigitalOcean Spaces
Retain 30 days
Alert on failure via email/Slack
```

---

## 34. Monitoring and Logging Strategy

### Application Logging

- **Logger**: `winston` with structured JSON output in production
- **Log levels**: error, warn, info, debug
- **Output**: stdout (Docker captures → Docker daemon log driver)
- **Log rotation**: Docker `--log-opt max-size=10m --log-opt max-file=3`

**What is logged**:
- Every HTTP request: method, path, status, duration (ms), userId if authenticated
- All errors with stack traces (in development)
- Payment events: intent created, succeeded, failed, refunded
- Order status transitions
- Custom order status transitions
- Admin actions (via AuditLog model in DB)
- Redis connection events

**What is NOT logged**:
- Passwords, tokens, card numbers, full email addresses (only hashed/truncated)
- Request bodies on payment endpoints

### Health Check Endpoint

`GET /api/health` returns:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-10T12:00:00Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  },
  "version": "1.0.0"
}
```

### Error Monitoring (Production)

**Recommended**: Sentry (free tier handles ~5k errors/month)
```bash
npm install @sentry/node @sentry/react
```
- Backend: `Sentry.init` before express middleware
- Frontend: `Sentry.init` + `Sentry.ErrorBoundary` wrapper
- Captures unhandled rejections, uncaught exceptions, React render errors

### Uptime Monitoring

**Recommended**: UptimeRobot (free) or Better Uptime
- Monitor `https://ladybdesigns.com` every 5 minutes
- Alert on email + SMS if down
- Public status page optional

### Performance Monitoring

- **Backend**: `response-time` express middleware logs duration per request
- **Frontend**: Vercel Speed Insights or Google Search Console Core Web Vitals
- **Database**: Prisma query logging in development, slow query alerts via pg_stat_statements in production

---

## 35. Launch Checklist

### Pre-Launch Technical

- [ ] All environment variables set in production
- [ ] `NODE_ENV=production` confirmed
- [ ] SSL certificate installed and auto-renewal configured
- [ ] Database migrations run successfully
- [ ] Seed data created (admin account, categories, sample products)
- [ ] Stripe webhook endpoint registered in Stripe dashboard, secret set in env
- [ ] PayPal live credentials configured
- [ ] Cloudinary production account connected
- [ ] SMTP email verified (send test email)
- [ ] Health check endpoint responding: `/api/health`
- [ ] All 5 Docker containers running and healthy
- [ ] Nginx serving HTTPS with valid cert
- [ ] HSTS header present
- [ ] robots.txt accessible
- [ ] sitemap.xml generated and accessible
- [ ] 404 page returns correct HTTP 404 status
- [ ] Stripe test payment completed end-to-end
- [ ] PayPal test payment completed end-to-end
- [ ] Order confirmation email received
- [ ] Custom order intake form submits and sends email
- [ ] Admin can log in and access dashboard
- [ ] Admin can create a product with images
- [ ] Rate limiting functional (test with rapid requests)
- [ ] DB backup script running on cron

### Pre-Launch Content

- [ ] Homepage hero image uploaded (high-res, optimized)
- [ ] 3+ categories created with images
- [ ] 2+ collections created
- [ ] 10+ products active with real images, descriptions, pricing
- [ ] About page content written and reviewed
- [ ] Craftsmanship page content written
- [ ] Contact page details correct (address, phone, email)
- [ ] Legal pages reviewed by stakeholder (Privacy, Terms, Returns, Shipping)
- [ ] Footer links all working
- [ ] Announcement bar text set in site settings

### Pre-Launch Marketing

- [ ] Google Analytics 4 property created, tracking ID in frontend
- [ ] Facebook Pixel (if running FB ads)
- [ ] Instagram business account linked
- [ ] Google Search Console domain verified
- [ ] Sitemap submitted to Google Search Console

---

## 36. Post-Launch Roadmap

### Month 1–2: Stability and Optimization

- Monitor error rates, fix any production bugs
- Performance audit — optimize LCP on product pages
- Customer feedback loop — contact form monitoring
- Admin UX refinements based on real usage
- Email open/click rates — optimize subject lines

### Month 3–4: Feature Expansion

- **Product reviews** — enable review submission after purchase (already modeled, needs UI)
- **Size guide** — modal or dedicated page with measurement guide
- **Gift wrapping** option at checkout (+$15)
- **Bundle / gift set** product type
- **Loyalty points** (simple: earn 1 point per $1, redeem $1 per 10 points)
- **Saved payment methods** via Stripe Customer + PaymentMethod

### Month 5–6: Growth Features

- **Abandoned cart email** integration (Klaviyo or similar)
- **Instagram Shopping** feed integration
- **Product Q&A** section (customers can ask questions, admin answers)
- **Referral program** (give $20, get $20 model)
- **Live chat** (Tidio or Crisp free tier)

---

## 37. Scaling Roadmap

### When to Scale (Triggers)

| Signal | Action |
|---|---|
| DB query p95 > 100ms | Add PostgreSQL read replica |
| Redis memory > 80% | Increase Redis memory allocation |
| API response p95 > 300ms | Horizontal scale backend containers |
| Traffic > 1000 concurrent users | Move to Kubernetes or Fargate |
| Image Cloudinary bandwidth high | Implement aggressive browser caching |
| Search queries causing DB load | Add Meilisearch or Typesense |

### Database Scaling Path

1. **Now**: Single Postgres container, all queries on one node
2. **~10k orders/month**: Add PgBouncer connection pooling (already architecture-friendly)
3. **~50k orders/month**: Read replica for analytics + reporting queries
4. **~200k orders/month**: Migrate to managed Postgres (RDS, Supabase, Neon)

### Search Scaling Path

1. **Now**: `ILIKE` full-text search in PostgreSQL — good for < 10k products
2. **Future**: Meilisearch sidecar container — instant-search, typo tolerance, faceting
3. **Alternative**: Typesense — similar feature set, easier cloud hosting

### Infrastructure Scaling Path

1. **Now**: Single server, Docker Compose
2. **Next**: Multi-container on single host with resource limits
3. **Scale**: Docker Swarm (minimal change) or Kubernetes (major migration)
4. **Cloud**: AWS ECS/Fargate, GCP Cloud Run, or DigitalOcean Managed Kubernetes

### Payment Scaling Path

1. **Now**: Stripe + PayPal (US + global cards)
2. **Expansion**: Flutterwave / Paystack for Nigerian/African markets (enum already supports this)
3. **Future**: Afterpay / Klarna for BNPL (buy now, pay later) targeting $300+ AOV

### CDN and Media Scaling

1. **Now**: Cloudinary for image hosting + transformation
2. **Optimization**: Cloudinary auto-format (serve WebP/AVIF where supported)
3. **Future**: Cloudflare CDN in front of Nginx for static assets and geographic caching

---

*This blueprint is the authoritative reference for the Lady B Designs and Handcraft commerce platform. All architectural decisions should be validated against this document before implementation.*

*© 2026 Lady B Designs and Handcraft. Confidential.*
