# Lady B Designs — Complete Backend API Specification

Compiled from every page, component, form, and hook in the frontend codebase.
Includes endpoints already wired, endpoints behind fake `setTimeout` stubs, and
implied endpoints needed to power every piece of UI.

**Base URL (dev):** `http://localhost:4000/api`
**Auth header:** `Authorization: Bearer <accessToken>`
**Envelope (success):** `{ success: true, message: string, data: T }`
**Envelope (error):** `{ success: false, message: string, errors?: Record<string, string> }`

---

## TABLE OF CONTENTS

1. [Auth](#1-auth)
2. [Products](#2-products)
3. [Categories](#3-categories)
4. [Collections](#4-collections)
5. [Reviews](#5-reviews)
6. [Coupons](#6-coupons)
7. [Newsletter](#7-newsletter)
8. [Gift Cards](#8-gift-cards)
9. [Journal](#9-journal)
10. [FAQ](#10-faq)
11. [Contact](#11-contact)
12. [Wholesale Enquiries](#12-wholesale-enquiries)
13. [Press Enquiries](#13-press-enquiries)
14. [Custom Orders (Public)](#14-custom-orders-public)
15. [Checkout & Payments](#15-checkout--payments)
16. [Orders (Public)](#16-orders-public)
17. [Uploads](#17-uploads)
18. [Account — Profile](#18-account--profile)
19. [Account — Dashboard](#19-account--dashboard)
20. [Account — Orders](#20-account--orders)
21. [Account — Addresses](#21-account--addresses)
22. [Account — Wishlist](#22-account--wishlist)
23. [Account — Custom Orders](#23-account--custom-orders)
24. [Account — Billing & Payment Methods](#24-account--billing--payment-methods)
25. [Account — Settings](#25-account--settings)
26. [Admin — Dashboard](#26-admin--dashboard)
27. [Admin — Products](#27-admin--products)
28. [Admin — Collections](#28-admin--collections)
29. [Admin — Categories](#29-admin--categories)
30. [Admin — Orders](#30-admin--orders)
31. [Admin — Custom Orders](#31-admin--custom-orders)
32. [Admin — Customers](#32-admin--customers)
33. [Admin — Reviews](#33-admin--reviews)
34. [Admin — Coupons](#34-admin--coupons)
35. [Admin — Newsletter](#35-admin--newsletter)
36. [Admin — Contact Messages](#36-admin--contact-messages)
37. [Admin — Wholesale](#37-admin--wholesale)
38. [Admin — Press](#38-admin--press)
39. [Admin — Journal (CMS)](#39-admin--journal-cms)
40. [Admin — Inventory](#40-admin--inventory)
41. [Admin — Gift Cards](#41-admin--gift-cards)
42. [Admin — Settings](#42-admin--settings)
43. [Admin — Audit Logs](#43-admin--audit-logs)
44. [Webhooks](#44-webhooks)
45. [Health Check](#45-health-check)
46. [Middleware Reference](#46-middleware-reference)
47. [Response Shape Reference](#47-response-shape-reference)
48. [Status Codes](#48-status-codes)
49. [Total Endpoint Count](#49-total-endpoint-count)

---

## 1. Auth

> Rate-limited endpoints are protected by `authRateLimit` middleware (5 req/15 min per IP).

| # | Method | Path | Auth | Rate | Description |
|---|--------|------|------|------|-------------|
| 1 | POST | `/auth/register` | — | ✅ | Create customer account |
| 2 | POST | `/auth/login` | — | ✅ | Email + password sign in |
| 3 | POST | `/auth/logout` | ✅ Bearer | — | Invalidate refresh token |
| 4 | POST | `/auth/refresh-token` | — | — | Exchange refresh → new access token |
| 5 | POST | `/auth/forgot-password` | — | ✅ | Send reset link email |
| 6 | POST | `/auth/reset-password` | — | — | Consume token, set new password |
| 7 | GET  | `/auth/me` | ✅ Bearer | — | Return full authenticated user |
| 8 | GET  | `/auth/verify-email/:token` | — | — | Verify email address from link |
| 9 | POST | `/auth/resend-verification` | ✅ Bearer | ✅ | Resend email verification link |

### Payloads

**POST /auth/register**
```json
{
  "firstName": "Grace",
  "lastName": "Adeyemi",
  "email": "grace@example.com",
  "password": "MinLength8WithUpperAndNumber1"
}
```
Response `data`: `{ user: User, accessToken: string, refreshToken: string }`

**POST /auth/login**
```json
{ "email": "grace@example.com", "password": "..." }
```
Response `data`: `{ user: User, accessToken: string, refreshToken: string }`

**POST /auth/refresh-token**
```json
{ "refreshToken": "..." }
```
Response `data`: `{ accessToken: string, refreshToken: string }`

**POST /auth/forgot-password**
```json
{ "email": "grace@example.com" }
```

**POST /auth/reset-password**
```json
{ "token": "uuid-from-email-link", "password": "NewPassword123!" }
```

---

## 2. Products

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 10 | GET | `/products` | — | Paginated product list with filters |
| 11 | GET | `/products/search` | — | Keyword search (header autocomplete) |
| 12 | GET | `/products/slug/:slug` | — | Product detail by URL slug |
| 13 | GET | `/products/:id` | — | Product detail by ID |
| 14 | GET | `/products/:id/reviews` | — | Paginated reviews for a product |
| 15 | POST | `/products/:id/notify` | — | Back-in-stock email signup |

### GET /products — Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Default 1 |
| `limit` | number | Default 12 |
| `status` | `ACTIVE\|DRAFT\|ARCHIVED` | Default ACTIVE for public |
| `categoryId` | string | Filter by category ID |
| `categorySlug` | string | Filter by category slug |
| `collection` | string | Filter by collection slug |
| `sort` | `newest\|price_asc\|price_desc\|featured` | |
| `q` | string | Full-text search |
| `exclude` | string | Exclude product ID (related products) |
| `isNewArrival` | boolean | Filter new arrivals |
| `lowStock` | boolean | Admin: stock ≤ 5 |

Response `data`: `{ products: Product[], total: number, page: number, totalPages: number }`

### GET /products/search — Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Required, min 2 chars |
| `limit` | number | Default 5 |

Response `data`: `{ products: Product[] }`

### POST /products/:id/notify
```json
{ "email": "grace@example.com" }
```

---

## 3. Categories

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 16 | GET | `/categories` | — | List active categories |

**GET /categories** query params: `isActive` (boolean), `limit` (default 20)

Response `data`: `{ categories: Category[] }`

```json
// Category shape
{ "id": "...", "name": "Clutch Bags", "slug": "clutch-bags", "description": "...", "isActive": true }
```

---

## 4. Collections

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 17 | GET | `/collections` | — | List all active collections |
| 18 | GET | `/collections/slug/:slug` | — | Collection detail + paginated products |

**GET /collections** query params: `status` (ACTIVE\|DRAFT), `includeCount` (boolean)

Response `data`: `{ collections: Collection[] }`

**GET /collections/slug/:slug** — includes paginated products

Response `data`:
```json
{
  "collection": { "id": "...", "name": "...", "slug": "...", "description": "...", "image": "...", "status": "ACTIVE" },
  "products": Product[],
  "total": 24,
  "page": 1,
  "totalPages": 2
}
```

---

## 5. Reviews

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 19 | POST | `/products/:id/reviews` | ✅ Customer | Submit a review (verified purchase only) |

```json
{ "rating": 5, "title": "Extraordinary craftsmanship", "body": "Every bead perfectly placed..." }
```

---

## 6. Coupons

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 20 | POST | `/coupons/validate` | — | Validate coupon code against cart subtotal |

```json
// Request
{ "code": "LADYB20", "subtotal": 280.00 }

// Response data
{ "code": "LADYB20", "discountAmount": 56.00, "discountType": "PERCENTAGE", "value": 20 }
```

---

## 7. Newsletter

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 21 | POST | `/newsletter/subscribe` | — | Subscribe email (footer + popup) |

```json
// Request — footer sends { "email": "..." }, popup sends { "email": "...", "source": "popup" }
{ "email": "grace@example.com", "source": "footer" }
```

---

## 8. Gift Cards

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 22 | POST | `/gift-cards` | — | Purchase and email a digital gift card |
| 23 | POST | `/gift-cards/redeem` | ✅ | Apply gift card code at checkout |

**POST /gift-cards**
```json
{
  "amount": 100,
  "recipientName": "Jane Doe",
  "recipientEmail": "jane@example.com",
  "message": "Happy birthday! Enjoy something beautiful."
}
```
Response `data`: `{ giftCard: { code: string, amount: number, expiresAt: string } }`

**POST /gift-cards/redeem** (called inside checkout flow)
```json
{ "code": "LBGC-XXXX-XXXX", "orderId": "..." }
```

---

## 9. Journal

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 24 | GET | `/journal` | — | Paginated list of published posts |
| 25 | GET | `/journal/:slug` | — | Single post with related posts |

**GET /journal** query params: `page`, `limit`, `category`

Response `data`:
```json
{
  "posts": [{
    "id": "...", "slug": "...", "title": "...", "excerpt": "...", "coverImage": "...",
    "category": "...", "readTimeMinutes": 5, "publishedAt": "..."
  }],
  "total": 12, "page": 1, "totalPages": 2
}
```

**GET /journal/:slug**
Response `data`:
```json
{
  "id": "...", "slug": "...", "title": "...", "excerpt": "...", "body": "HTML string",
  "coverImage": "...", "category": "...", "tags": ["beadwork", "luxury"],
  "readTimeMinutes": 6, "publishedAt": "...",
  "author": { "name": "Lady B", "role": "Designer & Founder", "avatar": "..." },
  "relatedPosts": [{ "id": "...", "slug": "...", "title": "...", "coverImage": "...", "category": "...", "publishedAt": "..." }]
}
```

---

## 10. FAQ

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 26 | GET | `/faq` | — | All FAQ items (currently hardcoded, needs DB) |

Response `data`: `{ faqs: [{ id, question, answer, category, order }] }`

> FaqPage currently has hardcoded questions. This endpoint will replace them.

---

## 11. Contact

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 27 | POST | `/contact` | — | Submit contact form (currently uses fake setTimeout) |

```json
{
  "name": "Grace Adeyemi",
  "email": "grace@example.com",
  "phone": "+13175551234",
  "subject": "Order enquiry",
  "message": "I would like to know more about bespoke commissions..."
}
```

> ContactPage currently fakes submission with `await new Promise(r => setTimeout(r, 1200))`. Replace with real API call.

---

## 12. Wholesale Enquiries

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 28 | POST | `/wholesale` | — | Submit wholesale application (currently fake setTimeout) |

```json
{
  "business": "Fashion Boutique Lagos",
  "name": "Adaeze Okafor",
  "email": "adaeze@boutique.com",
  "phone": "+2348012345678",
  "country": "Nigeria",
  "message": "We are interested in carrying Lady B pieces..."
}
```

> WholesalePage currently fakes submission. Replace with real API call.

---

## 13. Press Enquiries

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 29 | POST | `/press` | — | Submit press / media enquiry (currently fake setTimeout) |

```json
{
  "name": "Victoria Mills",
  "email": "victoria@vogue.com",
  "publication": "Vogue",
  "role": "Fashion Editor",
  "message": "We'd love to feature Lady B in our September issue..."
}
```

---

## 14. Custom Orders (Public)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 30 | POST | `/custom-orders` | ✅ Customer | Submit bespoke order request |
| 31 | GET  | `/custom-orders/:requestId` | ✅ Customer | Track request status + messages |

**POST /custom-orders**
```json
{
  "bagStyle": "clutch",
  "primaryColor": "cobalt blue",
  "secondaryColor": "gold",
  "beadType": "Japanese seed beads",
  "dimensions": "10x6 inches",
  "occasion": "Wedding",
  "budget": 350,
  "deadline": "2024-12-01",
  "description": "I'd love a cobalt clutch with gold accents for my sister's wedding...",
  "inspirationImages": ["https://cloudinary.com/..."]
}
```
Response `data`: `{ request: CustomOrder }`

**GET /custom-orders/:requestId**
Response `data`:
```json
{
  "request": {
    "id": "...", "status": "SUBMITTED|REVIEWING|QUOTED|IN_PROGRESS|COMPLETED|CANCELLED",
    "bagStyle": "clutch", "quotedPrice": null, "estimatedCompletionDate": null,
    "messages": [{ "id": "...", "sender": "ADMIN|CUSTOMER", "content": "...", "createdAt": "..." }],
    "timeline": [{ "status": "SUBMITTED", "date": "...", "note": "Request received" }]
  }
}
```

---

## 15. Checkout & Payments

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 32 | GET  | `/checkout/shipping-methods` | — | Available shipping options |
| 33 | POST | `/checkout/create-payment-intent` | ✅ | Create Stripe PaymentIntent + order draft |
| 34 | POST | `/checkout/confirm` | ✅ | Confirm order after Stripe payment succeeds |

**GET /checkout/shipping-methods** — Frontend shows Standard ($12.99, free ≥$250) and Express options
```json
// Response data
{
  "methods": [
    { "id": "standard", "name": "Standard Shipping", "description": "5–7 business days", "price": 1299, "freeThreshold": 25000 },
    { "id": "express", "name": "Express Shipping", "description": "2–3 business days", "price": 2999 }
  ]
}
```

**POST /checkout/create-payment-intent**
```json
{
  "items": [
    { "productId": "...", "variantId": "...", "quantity": 2 }
  ],
  "shippingAddress": {
    "firstName": "Grace", "lastName": "Adeyemi",
    "email": "grace@example.com",
    "phone": "+13175551234",
    "address1": "123 Main St", "address2": "Apt 4B",
    "city": "Indianapolis", "state": "IN",
    "postalCode": "46201", "country": "US"
  },
  "shippingMethodId": "standard",
  "couponCode": "LADYB20"
}
```
Response `data`: `{ clientSecret: string, orderId: string, amount: number }`

**POST /checkout/confirm** — Called after `stripe.confirmCardPayment` succeeds
```json
{ "orderId": "...", "paymentIntentId": "pi_..." }
```

---

## 16. Orders (Public)

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 35 | GET | `/orders/:orderId` | ✅ | Get order detail (checkout success page) |

Response `data`: Full `Order` object (see shape in §47)

---

## 17. Uploads

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 36 | POST | `/upload/images` | Admin | Upload one or more product/collection images |
| 37 | POST | `/upload/avatar` | ✅ Customer | Upload user avatar (AccountProfile has TODO for this) |

**POST /upload/images** — `multipart/form-data`, field: `images[]` (max 10 files, 5MB each)
Response `data`: `{ images: [{ id: string, url: string, altText: string, width: number, height: number }] }`

**POST /upload/avatar** — `multipart/form-data`, field: `avatar`
Response `data`: `{ avatarUrl: string }`

---

## 18. Account — Profile

> All `/account/*` require `Authorization: Bearer <accessToken>`

| # | Method | Path | Description |
|---|--------|------|-------------|
| 38 | PATCH | `/account/profile` | Update name, phone |
| 39 | POST  | `/account/avatar` | Upload new avatar image |
| 40 | PATCH | `/account/password` | Change password (requires current password) |

**PATCH /account/profile**
```json
{ "firstName": "Grace", "lastName": "Adeyemi", "phone": "+13175551234" }
```

**POST /account/avatar** — `multipart/form-data`, field: `avatar`
Response `data`: `{ avatarUrl: string }`

**PATCH /account/password**
```json
{ "currentPassword": "OldPassword1!", "newPassword": "NewPassword2!" }
```

---

## 19. Account — Dashboard

| # | Method | Path | Description |
|---|--------|------|-------------|
| 41 | GET | `/account/dashboard` | Summary: recent orders, stats, loyalty points |

Response `data`:
```json
{
  "recentOrders": Order[],
  "stats": {
    "totalOrders": 12,
    "totalSpent": 2400.00,
    "wishlistCount": 5,
    "activeCustomOrders": 1
  },
  "loyaltyPoints": 240,
  "memberSince": "2023-04-01T00:00:00Z"
}
```

---

## 20. Account — Orders

| # | Method | Path | Description |
|---|--------|------|-------------|
| 42 | GET | `/account/orders` | Paginated order history |
| 43 | GET | `/account/orders/:orderId` | Full order detail with line items |

**GET /account/orders** query params: `page`, `limit`, `status`, `q` (order number search)

Response `data`: `{ orders: Order[], total: number, page: number, totalPages: number }`

---

## 21. Account — Addresses

| # | Method | Path | Description |
|---|--------|------|-------------|
| 44 | GET    | `/account/addresses` | List all saved addresses |
| 45 | POST   | `/account/addresses` | Add new address |
| 46 | PATCH  | `/account/addresses/:id` | Update existing address |
| 47 | DELETE | `/account/addresses/:id` | Delete address |
| 48 | PATCH  | `/account/addresses/:id` (body `{ isDefault: true }`) | Set as default |

**Address body (POST / PATCH)**
```json
{
  "label": "Home",
  "firstName": "Grace", "lastName": "Adeyemi",
  "line1": "123 Main St", "line2": "Apt 4B",
  "city": "Indianapolis", "state": "IN",
  "postalCode": "46201", "country": "US",
  "phone": "+13175551234",
  "isDefault": false
}
```

---

## 22. Account — Wishlist

| # | Method | Path | Description |
|---|--------|------|-------------|
| 49 | GET    | `/account/wishlist` | List wishlist items (supports `?limit=1` for badge count) |
| 50 | POST   | `/account/wishlist` | Add product to wishlist |
| 51 | DELETE | `/account/wishlist/:itemId` | Remove item from wishlist |

**POST /account/wishlist**
```json
{ "productId": "...", "variantId": "..." }
```

Response `data` (GET): `{ items: WishlistItem[], total: number }`

---

## 23. Account — Custom Orders

| # | Method | Path | Description |
|---|--------|------|-------------|
| 52 | GET | `/account/custom-orders` | List customer's bespoke requests |

Query params: `page`, `limit`

Response `data`: `{ requests: CustomOrder[], total: number, page: number, totalPages: number }`

---

## 24. Account — Billing & Payment Methods

| # | Method | Path | Description |
|---|--------|------|-------------|
| 53 | GET    | `/account/payment-methods` | List saved Stripe payment methods |
| 54 | POST   | `/account/payment-methods/setup-intent` | Create Stripe SetupIntent (for saving a new card) |
| 55 | PATCH  | `/account/payment-methods/:id/default` | Set as default payment method |
| 56 | DELETE | `/account/payment-methods/:id` | Remove saved card |
| 57 | GET    | `/account/invoices` | List past invoices / receipts |

**POST /account/payment-methods/setup-intent**
Response `data`: `{ clientSecret: string }`

**GET /account/invoices** — paginated
Response `data`: `{ invoices: Invoice[], total: number }`

---

## 25. Account — Settings

| # | Method | Path | Description |
|---|--------|------|-------------|
| 58 | GET   | `/account/settings` | Get notification and preference settings |
| 59 | PATCH | `/account/settings` | Update settings |

**PATCH /account/settings**
```json
{
  "emailMarketing": true,
  "emailOrders": true,
  "emailCustomOrders": true,
  "smsMarketing": false,
  "theme": "light"
}
```

---

## 26. Admin — Dashboard

> All `/admin/*` require `Authorization: Bearer <token>` + role `ADMIN | SUPER_ADMIN`

| # | Method | Path | Description |
|---|--------|------|-------------|
| 60 | GET | `/admin/dashboard` | KPIs, chart data, recent activity |

Response `data`:
```json
{
  "revenue": { "today": 0, "week": 0, "month": 0, "allTime": 0 },
  "orders": { "pending": 0, "processing": 0, "shipped": 0, "total": 0 },
  "customers": { "total": 0, "newThisMonth": 0 },
  "products": { "total": 0, "lowStock": 0, "outOfStock": 0 },
  "recentOrders": Order[],
  "topProducts": [{ "product": Product, "sold": 24, "revenue": 6720 }],
  "revenueChart": [{ "date": "2024-01-01", "revenue": 0, "orders": 0 }],
  "pendingCustomOrders": 3,
  "unreadMessages": 7
}
```

---

## 27. Admin — Products

| # | Method | Path | Description |
|---|--------|------|-------------|
| 61 | GET    | `/admin/products` | List all products (any status, with stock) |
| 62 | GET    | `/admin/products/:id` | Full product with variants, images, inventory history |
| 63 | POST   | `/admin/products` | Create product |
| 64 | PATCH  | `/admin/products/:id` | Update product |
| 65 | DELETE | `/admin/products/:id` | Delete product (soft delete) |
| 66 | PATCH  | `/admin/products/:id/publish` | Publish draft |
| 67 | PATCH  | `/admin/products/:id/archive` | Archive product |
| 68 | PATCH  | `/admin/products/:id/stock` | Update stock quantity |
| 69 | DELETE | `/admin/products/:id/images/:imageId` | Remove a product image |
| 70 | PATCH  | `/admin/products/:id/images/reorder` | Reorder product images |

**GET /admin/products** query params: `page`, `limit`, `q`, `status`, `lowStock` (boolean)

**POST / PATCH /admin/products body:**
```json
{
  "name": "Cobalt Evening Clutch",
  "slug": "cobalt-evening-clutch",
  "description": "A statement piece in cobalt Japanese seed beads...",
  "price": 28000,
  "compareAtPrice": 34000,
  "status": "DRAFT",
  "categoryId": "...",
  "collectionIds": ["..."],
  "images": [{ "url": "...", "altText": "Cobalt clutch front view", "position": 0 }],
  "variants": [
    { "name": "Navy", "price": 28000, "stock": 3, "isAvailable": true },
    { "name": "Cobalt", "price": 28000, "stock": 5, "isAvailable": true }
  ],
  "stock": 8,
  "isMadeToOrder": false,
  "madeToOrderLeadDays": null,
  "isNewArrival": true,
  "materials": "Premium Japanese seed beads, brass arch frame, silk lining",
  "dimensions": "10 x 6 x 2 inches",
  "careInstructions": "Store in dust bag. Avoid moisture and direct sunlight.",
  "craftDetails": "Each bead hand-strung over 40+ hours",
  "seoTitle": "Cobalt Evening Clutch | Lady B Designs",
  "seoDescription": "Hand-beaded cobalt clutch bag..."
}
```

**PATCH /admin/products/:id/stock**
```json
{ "stockQuantity": 15 }
```

**PATCH /admin/products/:id/images/reorder**
```json
{ "imageIds": ["id1", "id2", "id3"] }
```

---

## 28. Admin — Collections

| # | Method | Path | Description |
|---|--------|------|-------------|
| 71 | GET    | `/admin/collections` | List all collections |
| 72 | POST   | `/admin/collections` | Create collection |
| 73 | PATCH  | `/admin/collections/:id` | Update collection |
| 74 | DELETE | `/admin/collections/:id` | Delete collection |

**POST / PATCH body:**
```json
{
  "name": "Evening Edit",
  "slug": "evening-edit",
  "description": "Pieces for the woman who dresses with intention...",
  "image": "https://cloudinary.com/...",
  "status": "ACTIVE",
  "isFeatured": true
}
```

---

## 29. Admin — Categories

| # | Method | Path | Description |
|---|--------|------|-------------|
| 75 | GET    | `/admin/categories` | List all categories |
| 76 | POST   | `/admin/categories` | Create category |
| 77 | PATCH  | `/admin/categories/:id` | Update category |
| 78 | DELETE | `/admin/categories/:id` | Delete category |

**POST / PATCH body:**
```json
{ "name": "Clutch Bags", "slug": "clutch-bags", "description": "...", "isActive": true }
```

---

## 30. Admin — Orders

| # | Method | Path | Description |
|---|--------|------|-------------|
| 79 | GET   | `/admin/orders` | Paginated order list |
| 80 | GET   | `/admin/orders/:id` | Full order with items, customer, shipping |
| 81 | PATCH | `/admin/orders/:id` | Update status, tracking, notes |

**GET /admin/orders** query params: `page`, `limit`, `q`, `status`

**PATCH /admin/orders/:id**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "1Z999AA10123456784",
  "trackingCarrier": "UPS",
  "notes": "Customer requested signature on delivery"
}
```

---

## 31. Admin — Custom Orders

| # | Method | Path | Description |
|---|--------|------|-------------|
| 82 | GET   | `/admin/custom-orders` | Paginated bespoke request list |
| 83 | GET   | `/admin/custom-orders/:id` | Full request with messages + timeline |
| 84 | PATCH | `/admin/custom-orders/:id` | Update status, price, notes |
| 85 | POST  | `/admin/custom-orders/:id/messages` | Send message to customer |

**GET /admin/custom-orders** query params: `page`, `limit`, `q`, `status`

**PATCH /admin/custom-orders/:id**
```json
{
  "status": "QUOTED",
  "quotedPrice": 45000,
  "estimatedCompletionDate": "2024-12-15",
  "notes": "Customer approved cobalt blue with gold thread"
}
```

**POST /admin/custom-orders/:id/messages**
```json
{ "content": "Your piece is now in the beading phase. Expected completion in 3 weeks." }
```

---

## 32. Admin — Customers

| # | Method | Path | Description |
|---|--------|------|-------------|
| 86 | GET   | `/admin/customers` | Paginated customer list with order stats |
| 87 | PATCH | `/admin/customers/:id` | Ban / unban customer |

**GET /admin/customers** query params: `page`, `limit`, `q`

**PATCH /admin/customers/:id**
```json
{ "isActive": false }
```

---

## 33. Admin — Reviews

| # | Method | Path | Description |
|---|--------|------|-------------|
| 88 | GET    | `/admin/reviews` | Paginated review list |
| 89 | PATCH  | `/admin/reviews/:id` | Approve or reject review |
| 90 | DELETE | `/admin/reviews/:id` | Delete review |

**GET /admin/reviews** query params: `page`, `limit`, `q`, `status` (PENDING\|APPROVED\|REJECTED)

**PATCH /admin/reviews/:id**
```json
{ "status": "APPROVED" }
```

---

## 34. Admin — Coupons

| # | Method | Path | Description |
|---|--------|------|-------------|
| 91 | GET    | `/admin/coupons` | List all coupons |
| 92 | POST   | `/admin/coupons` | Create coupon |
| 93 | PATCH  | `/admin/coupons/:id` | Update coupon |
| 94 | DELETE | `/admin/coupons/:id` | Delete coupon |

**POST / PATCH body:**
```json
{
  "code": "LADYB20",
  "type": "PERCENTAGE",
  "value": 20,
  "minOrderAmount": 10000,
  "maxUses": 500,
  "usedCount": 0,
  "isActive": true,
  "startsAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

> All monetary values are stored in **cents** (integer). $100.00 → `10000`.

---

## 35. Admin — Newsletter

| # | Method | Path | Description |
|---|--------|------|-------------|
| 95 | GET    | `/admin/newsletter` | Paginated subscriber list |
| 96 | POST   | `/admin/newsletter/broadcast` | Send broadcast email to all subscribers |
| 97 | GET    | `/admin/newsletter/export` | Download CSV (blob response) |
| 98 | DELETE | `/admin/newsletter/:id` | Unsubscribe / delete subscriber |

**GET /admin/newsletter** query params: `page`, `limit`, `q`

**POST /admin/newsletter/broadcast**
```json
{ "subject": "New Collection Drop — The Ivory Edit", "body": "<p>HTML email content...</p>" }
```

---

## 36. Admin — Contact Messages

| # | Method | Path | Description |
|---|--------|------|-------------|
| 99  | GET    | `/admin/contact-messages` | List all contact form submissions |
| 100 | PATCH  | `/admin/contact-messages/:id` | Mark as read |
| 101 | POST   | `/admin/contact-messages/:id/reply` | Send reply email to sender |
| 102 | DELETE | `/admin/contact-messages/:id` | Delete message |

**PATCH /admin/contact-messages/:id**
```json
{ "isRead": true }
```

**POST /admin/contact-messages/:id/reply**
```json
{ "body": "Thank you for reaching out, Grace. Regarding your enquiry..." }
```

---

## 37. Admin — Wholesale

| # | Method | Path | Description |
|---|--------|------|-------------|
| 103 | GET   | `/admin/wholesale` | Paginated wholesale applications |
| 104 | PATCH | `/admin/wholesale/:id` | Update application status |

**PATCH /admin/wholesale/:id**
```json
{ "status": "APPROVED" }
```

---

## 38. Admin — Press

| # | Method | Path | Description |
|---|--------|------|-------------|
| 105 | GET   | `/admin/press` | Paginated press enquiries |
| 106 | PATCH | `/admin/press/:id` | Update enquiry status |

**PATCH /admin/press/:id**
```json
{ "status": "RESPONDED" }
```

---

## 39. Admin — Journal (CMS)

> No admin journal UI exists in the current FE — these endpoints power a future admin journal page.
> The public `GET /journal` and `GET /journal/:slug` already need this data.

| # | Method | Path | Description |
|---|--------|------|-------------|
| 107 | GET    | `/admin/journal` | List all posts (any status) |
| 108 | POST   | `/admin/journal` | Create journal post |
| 109 | GET    | `/admin/journal/:id` | Get post by ID |
| 110 | PATCH  | `/admin/journal/:id` | Update post |
| 111 | DELETE | `/admin/journal/:id` | Delete post |
| 112 | PATCH  | `/admin/journal/:id/publish` | Publish draft |
| 113 | PATCH  | `/admin/journal/:id/unpublish` | Revert to draft |

**POST / PATCH body:**
```json
{
  "title": "The Art of Bead Selection",
  "slug": "art-of-bead-selection",
  "excerpt": "How we choose every bead that goes into a Lady B piece.",
  "body": "<p>HTML article content...</p>",
  "coverImage": "https://cloudinary.com/...",
  "category": "Craft",
  "tags": ["beadwork", "process", "artisan"],
  "readTimeMinutes": 5,
  "status": "DRAFT",
  "publishedAt": null,
  "author": { "name": "Lady B", "role": "Designer & Founder", "avatar": "..." }
}
```

---

## 40. Admin — Inventory

> Reuses `/admin/products` — inventory page filters with `?lowStock=true`

| # | Method | Path | Description |
|---|--------|------|-------------|
| 114 | GET   | `/admin/products?lowStock=true` | Low-stock product list (reused) |
| 115 | PATCH | `/admin/products/:id/stock` | Bulk or individual stock update (reused) |

---

## 41. Admin — Gift Cards

| # | Method | Path | Description |
|---|--------|------|-------------|
| 116 | GET   | `/admin/gift-cards` | List all issued gift cards |
| 117 | GET   | `/admin/gift-cards/:id` | Get gift card detail + redemption history |
| 118 | PATCH | `/admin/gift-cards/:id` | Deactivate / adjust balance |

---

## 42. Admin — Settings

| # | Method | Path | Description |
|---|--------|------|-------------|
| 119 | GET   | `/admin/settings` | Get full site configuration |
| 120 | PATCH | `/admin/settings` | Update site configuration |

**PATCH /admin/settings**
```json
{
  "siteName": "Lady B Designs and Handcraft",
  "siteTagline": "Wearable Art, Crafted by Hand",
  "contactEmail": "hello@ladybdesigns.com",
  "contactPhone": "+1 (317) 333-1333",
  "address": "Indianapolis, Indiana, USA",
  "freeShippingThreshold": 25000,
  "currency": "USD",
  "announcementText": "Free shipping on orders over $250 · Bespoke commissions open",
  "announcementEnabled": true,
  "maintenanceMode": false,
  "metaTitle": "Lady B Designs | Luxury Artisan Fashion",
  "metaDescription": "...",
  "socialInstagram": "https://instagram.com/...",
  "socialFacebook": "https://facebook.com/...",
  "socialPinterest": "https://pinterest.com/...",
  "stripePublicKey": "pk_live_...",
  "googleAnalyticsId": "G-XXXXXXXX"
}
```

---

## 43. Admin — Audit Logs

| # | Method | Path | Description |
|---|--------|------|-------------|
| 121 | GET | `/admin/audit-logs` | Admin action audit trail |

**GET /admin/audit-logs** query params: `page`, `limit`, `q` (search by admin email / action)

Response `data`:
```json
{
  "logs": [{
    "id": "...", "adminId": "...", "admin": { "email": "...", "firstName": "..." },
    "action": "UPDATE_ORDER_STATUS", "targetId": "...", "targetType": "ORDER",
    "changes": { "status": { "from": "PROCESSING", "to": "SHIPPED" } },
    "createdAt": "..."
  }],
  "total": 340, "page": 1, "totalPages": 34
}
```

---

## 44. Webhooks

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 122 | POST | `/webhooks/stripe` | Stripe-Signature header | Handle all Stripe events |

**Events to handle:**
- `payment_intent.succeeded` → mark order PROCESSING, clear cart
- `payment_intent.payment_failed` → mark order FAILED, notify customer
- `customer.subscription.deleted` → (future subscription products)
- `invoice.paid` → record invoice
- `setup_intent.succeeded` → save payment method to customer

> **Never** use `req.body` after `express.json()` for this route — use raw buffer for Stripe signature verification.

---

## 45. Health Check

| # | Method | Path | Auth | Description |
|---|--------|------|------|-------------|
| 123 | GET | `/health` | — | Service health (used by docker compose healthcheck) |

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-06-11T09:00:00.000Z",
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

---

## 46. Middleware Reference

| Middleware | Description | Applied To |
|-----------|-------------|-----------|
| `authenticate` | Verify JWT, attach `req.user` | All protected routes |
| `requireAdmin` | Require role `ADMIN \| SUPER_ADMIN` | All `/admin/*` |
| `authRateLimit` | 5 req / 15 min per IP | `/auth/register`, `/auth/login`, `/auth/forgot-password`, `/auth/resend-verification` |
| `validate(schema, target?)` | Zod validation — body (default) or `'query'` | All routes with input |
| `upload` | Multer multipart | `/upload/*`, `/account/avatar` |
| `pagination` | Parse `page` + `limit` → `skip` + `take` | All list endpoints |
| `rawBody` | Preserve raw buffer for Stripe signature | `/webhooks/stripe` |

---

## 47. Response Shape Reference

### User
```json
{
  "id": "cuid", "email": "...", "firstName": "Grace", "lastName": "Adeyemi",
  "role": "CUSTOMER | ADMIN | SUPER_ADMIN",
  "isEmailVerified": true, "isActive": true,
  "avatarUrl": null, "phone": "+13175551234",
  "createdAt": "ISO8601", "updatedAt": "ISO8601"
}
```

### Product
```json
{
  "id": "cuid", "name": "Cobalt Evening Clutch", "slug": "cobalt-evening-clutch",
  "description": "...", "price": 28000, "compareAtPrice": 34000,
  "status": "ACTIVE | DRAFT | ARCHIVED",
  "stock": 8, "isMadeToOrder": false, "madeToOrderLeadDays": null,
  "isNewArrival": true,
  "images": [{ "id": "...", "url": "...", "altText": "...", "position": 0 }],
  "variants": [{ "id": "...", "name": "Navy", "price": 28000, "stock": 3, "isAvailable": true }],
  "category": { "id": "...", "name": "Clutch Bags", "slug": "clutch-bags" },
  "materials": "...", "dimensions": "...", "careInstructions": "...", "craftDetails": "...",
  "seoTitle": "...", "seoDescription": "...",
  "_count": { "reviews": 14 },
  "createdAt": "ISO8601", "updatedAt": "ISO8601"
}
```

### Order
```json
{
  "id": "cuid", "orderNumber": "LB-2024-0001",
  "status": "PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED",
  "items": [{
    "id": "...", "quantity": 1, "price": 28000,
    "product": { "id": "...", "name": "...", "slug": "...", "images": [] },
    "variant": { "id": "...", "name": "Navy" }
  }],
  "subtotal": 28000, "discount": 0, "shippingCost": 1299, "tax": 0, "total": 29299,
  "couponCode": null,
  "shippingAddress": { "firstName": "...", "line1": "...", "city": "...", "country": "US" },
  "trackingNumber": null, "trackingCarrier": null,
  "paymentIntentId": "pi_...",
  "createdAt": "ISO8601", "updatedAt": "ISO8601"
}
```

### CustomOrder
```json
{
  "id": "cuid",
  "status": "SUBMITTED | REVIEWING | QUOTED | IN_PROGRESS | COMPLETED | CANCELLED",
  "bagStyle": "clutch", "primaryColor": "cobalt blue",
  "occasion": "Wedding", "budget": 35000,
  "quotedPrice": null, "estimatedCompletionDate": null,
  "messages": [], "timeline": [],
  "createdAt": "ISO8601"
}
```

> **All monetary values are in cents.** `28000` = $280.00. This avoids floating-point precision errors.

---

## 48. Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Validation error — return `errors` object |
| 401 | Missing or invalid token |
| 403 | Insufficient role / action not permitted |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, slug, coupon code) |
| 422 | Business rule violation (coupon expired, out of stock at checkout) |
| 429 | Rate limited |
| 500 | Unhandled server error |

---

## 49. Total Endpoint Count

| Domain | Count |
|--------|-------|
| Auth | 9 |
| Products (public) | 6 |
| Categories | 1 |
| Collections | 2 |
| Reviews | 1 |
| Coupons | 1 |
| Newsletter | 1 |
| Gift Cards | 2 |
| Journal (public) | 2 |
| FAQ | 1 |
| Contact | 1 |
| Wholesale | 1 |
| Press | 1 |
| Custom Orders (public) | 2 |
| Checkout | 3 |
| Orders (public) | 1 |
| Uploads | 2 |
| Account (17 routes) | 17 |
| Admin — Dashboard | 1 |
| Admin — Products | 10 |
| Admin — Collections | 4 |
| Admin — Categories | 4 |
| Admin — Orders | 3 |
| Admin — Custom Orders | 4 |
| Admin — Customers | 2 |
| Admin — Reviews | 3 |
| Admin — Coupons | 4 |
| Admin — Newsletter | 4 |
| Admin — Contact Messages | 4 |
| Admin — Wholesale | 2 |
| Admin — Press | 2 |
| Admin — Journal (CMS) | 7 |
| Admin — Gift Cards | 3 |
| Admin — Settings | 2 |
| Admin — Audit Logs | 1 |
| Webhooks | 1 |
| Health Check | 1 |
| **TOTAL** | **123** |

---

## Notes for Backend Build

1. **Money in cents** — store and return all prices as integers (cents). The frontend uses `formatCurrency` which expects cents.
2. **Slugs** — auto-generate from name on create if not provided. Enforce uniqueness per model.
3. **Images** — integrate Cloudinary (or S3). Store URL + public_id. Return full URL in responses.
4. **Email** — use Nodemailer or Resend. Required for: order confirmation, password reset, custom order messages, newsletter broadcast, gift card delivery, contact reply.
5. **Stripe** — payment intents for checkout, setup intents for saving cards. Store `paymentIntentId` on orders.
6. **Redis** — use for: refresh token blacklist (logout), rate limiting, session caching.
7. **Prisma** — relations needed: User → Orders, User → Addresses, User → Wishlist, Product → Images, Product → Variants, Product → Reviews, Order → OrderItems, Collection ↔ Products (many-to-many).
8. **Fake stubs to replace** — ContactPage, WholesalePage, PressPage all have `await new Promise(r => setTimeout(r, 1200))` fake delays. Wire to real API calls once endpoints exist.
9. **JWT** — access token: 15 min, refresh token: 7 days. Refresh tokens stored in Redis (invalidated on logout).
10. **Roles** — `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`. Admin routes require `ADMIN | SUPER_ADMIN`. Some admin actions (delete admin users, change roles) require `SUPER_ADMIN` only.
