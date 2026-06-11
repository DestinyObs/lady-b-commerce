# Lady B Designs — Complete API Endpoint Reference

Every endpoint the frontend calls, organised by domain. This is the full build spec for the backend.

**Base URL (dev):** `http://localhost:4000/api`  
**Auth header:** `Authorization: Bearer <accessToken>`  
**Standard success envelope:** `{ success: true, message: string, data: T }`  
**Standard error envelope:** `{ success: false, message: string, errors?: object }`

---

## 1. Authentication  `/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Create new customer account |
| POST | `/auth/login` | — | Email + password login |
| POST | `/auth/logout` | ✅ | Invalidate refresh token |
| POST | `/auth/refresh-token` | — | Exchange refresh token for new access token |
| POST | `/auth/forgot-password` | — | Send password-reset email |
| POST | `/auth/reset-password` | — | Consume reset token, set new password |
| GET | `/auth/me` | ✅ | Return authenticated user profile |

### Request bodies

**POST /auth/register**
```json
{ "firstName": "Grace", "lastName": "Adeyemi", "email": "...", "password": "..." }
```

**POST /auth/login**
```json
{ "email": "...", "password": "..." }
```
Response `data`: `{ user: User, accessToken: string, refreshToken: string }`

**POST /auth/refresh-token**
```json
{ "refreshToken": "..." }
```

**POST /auth/forgot-password**
```json
{ "email": "..." }
```

**POST /auth/reset-password**
```json
{ "token": "...", "password": "..." }
```

---

## 2. Products  `/products`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/products` | — | List products with filters |
| GET | `/products/search` | — | Search products by keyword |
| GET | `/products/slug/:slug` | — | Get single product by URL slug |
| GET | `/products/:id` | — | Get single product by ID |
| GET | `/products/:id/reviews` | — | Paginated reviews for a product |
| POST | `/products/:id/notify` | — | Back-in-stock email signup |
| POST | `/products` | Admin | Create product |
| PATCH | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| PATCH | `/products/:id/publish` | Admin | Publish draft product |
| PATCH | `/products/:id/archive` | Admin | Archive product |

### Query params — GET /products
```
page, limit, status (ACTIVE|DRAFT|ARCHIVED), categoryId, categorySlug,
collection, sort (newest|price_asc|price_desc|featured), q (search),
exclude (id to exclude), lowStock (boolean)
```

### Query params — GET /products/search
```
q (required), limit
```
Response `data`: `{ products: Product[] }`

### GET /products/:id/reviews
```
limit, page, sort
```
Response `data`: `{ reviews: Review[], total: number, page: number }`

### POST /products/:id/notify
```json
{ "email": "customer@example.com" }
```

---

## 3. Categories  `/categories`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/categories` | — | List all categories |

### Query params — GET /categories
```
isActive (boolean), limit
```
Response `data`: `{ categories: Category[] }`

---

## 4. Collections  `/collections`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/collections` | — | List collections |
| GET | `/collections/slug/:slug` | — | Get collection by slug (with products) |

### Query params — GET /collections
```
status (ACTIVE|DRAFT), includeCount (boolean — include product count per collection)
```
Response `data`: `{ collections: Collection[] }`

### GET /collections/slug/:slug
Response `data`: `{ collection: Collection & { products: Product[] }, total: number }`

---

## 5. Reviews  `/reviews`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/products/:id/reviews` | ✅ Customer | Submit a product review |

**POST /products/:id/reviews**
```json
{ "rating": 5, "title": "Beautiful piece", "body": "..." }
```

---

## 6. Coupons  `/coupons`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/coupons/validate` | — | Validate coupon code against a subtotal |

**POST /coupons/validate**
```json
{ "code": "LADYB20", "subtotal": 280.00 }
```
Response `data`: `{ code: string, discountAmount: number, discountType: "PERCENTAGE"|"FIXED" }`

---

## 7. Newsletter  `/newsletter`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/newsletter/subscribe` | — | Subscribe email to newsletter |

**POST /newsletter/subscribe**
```json
{ "email": "...", "source": "footer" | "popup" }
```

---

## 8. Gift Cards  `/gift-cards`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/gift-cards` | — | Purchase and email a gift card |

**POST /gift-cards**
```json
{
  "amount": 100,
  "recipientName": "Jane",
  "recipientEmail": "jane@example.com",
  "message": "Happy birthday!"
}
```
Response `data`: `{ giftCard: { code: string, amount: number, expiresAt: string } }`

---

## 9. Journal  `/journal`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/journal` | — | List published journal posts |
| GET | `/journal/:slug` | — | Get single journal post with related posts |

### GET /journal/:slug
Response `data`:
```json
{
  "id": "...", "slug": "...", "title": "...", "excerpt": "...", "body": "...",
  "coverImage": "...", "category": "...", "tags": [],
  "readTimeMinutes": 5, "publishedAt": "...",
  "author": { "name": "...", "role": "...", "avatar": "..." },
  "relatedPosts": [{ "id": "...", "slug": "...", "title": "...", "coverImage": "...", "category": "...", "publishedAt": "..." }]
}
```

---

## 10. Contact  `/contact`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/contact` | — | Submit a contact form message |

**POST /contact**
```json
{ "name": "...", "email": "...", "subject": "...", "message": "..." }
```

---

## 11. Custom Orders  `/custom-orders`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/custom-orders` | ✅ Customer | Submit a bespoke order request |
| GET | `/custom-orders/:requestId` | ✅ Customer | Track a custom order request |

**POST /custom-orders**
```json
{
  "bagStyle": "clutch",
  "primaryColor": "cobalt blue",
  "secondaryColor": "gold",
  "dimensions": "10x6 inches",
  "occasion": "Wedding",
  "budget": 350,
  "deadline": "2024-12-01",
  "description": "...",
  "inspirationImages": ["url1", "url2"]
}
```
Response `data`: `{ request: CustomOrder }`

### GET /custom-orders/:requestId
Response `data`: `{ request: CustomOrder & { messages: Message[], timeline: TimelineEvent[] } }`

---

## 12. Checkout  `/checkout`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/checkout/create-payment-intent` | ✅ | Create Stripe PaymentIntent and order draft |

**POST /checkout/create-payment-intent**
```json
{
  "items": [{ "productId": "...", "variantId": "...", "quantity": 2, "price": 120.00 }],
  "shippingAddressId": "...",
  "couponCode": "LADYB20",
  "giftCardCode": "..."
}
```
Response `data`: `{ clientSecret: string, orderId: string, amount: number }`

---

## 13. Orders  `/orders`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/orders/:orderId` | ✅ | Get a specific order (checkout success page) |

---

## 14. Uploads  `/upload`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/upload/images` | Admin | Upload product / collection images |

**POST /upload/images** — `multipart/form-data`, field: `images[]`  
Response `data`: `{ images: [{ id: string, url: string, altText: string }] }`

---

---

## 15. Account Routes  `/account`  *(all require authentication)*

### Profile

| Method | Path | Description |
|--------|------|-------------|
| PATCH | `/account/profile` | Update name, phone, avatar |
| PATCH | `/account/password` | Change password (requires currentPassword) |

**PATCH /account/profile**
```json
{ "firstName": "Grace", "lastName": "Adeyemi", "phone": "+1234567890", "avatarUrl": "..." }
```

**PATCH /account/password**
```json
{ "currentPassword": "...", "newPassword": "..." }
```

---

### Dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/account/dashboard` | Summary stats for account home |

Response `data`:
```json
{
  "recentOrders": Order[],
  "totalOrders": 12,
  "totalSpent": 2400.00,
  "wishlistCount": 5,
  "activeCustomOrders": 1,
  "loyaltyPoints": 240
}
```

---

### Orders

| Method | Path | Description |
|--------|------|-------------|
| GET | `/account/orders` | Paginated order history |
| GET | `/account/orders/:orderId` | Full order detail |

**GET /account/orders** query params: `page, limit, status, q`

Response `data`: `{ orders: Order[], total: number, page: number, totalPages: number }`

---

### Addresses

| Method | Path | Description |
|--------|------|-------------|
| GET | `/account/addresses` | List saved addresses |
| POST | `/account/addresses` | Add address |
| PATCH | `/account/addresses/:id` | Update address |
| DELETE | `/account/addresses/:id` | Delete address |
| PATCH | `/account/addresses/:id` (body `isDefault: true`) | Set as default |

**Address body**
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

### Wishlist

| Method | Path | Description |
|--------|------|-------------|
| GET | `/account/wishlist` | Get wishlist items (supports `?limit=1` for count) |
| POST | `/account/wishlist` | Add product to wishlist |
| DELETE | `/account/wishlist/:itemId` | Remove from wishlist |

Response `data`: `{ items: WishlistItem[], total: number }`

---

### Custom Orders (Account view)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/account/custom-orders` | List customer's custom order requests |

Query params: `page, limit`

---

### Payment Methods / Billing

| Method | Path | Description |
|--------|------|-------------|
| GET | `/account/payment-methods` | List saved Stripe payment methods |
| POST | `/account/payment-methods/setup-intent` | Create Stripe SetupIntent for saving a card |
| PATCH | `/account/payment-methods/:id/default` | Set default payment method |
| DELETE | `/account/payment-methods/:id` | Remove saved card |
| GET | `/account/invoices` | List past invoices / receipts |

**POST /account/payment-methods/setup-intent**  
Response `data`: `{ clientSecret: string }`

---

### Settings

| Method | Path | Description |
|--------|------|-------------|
| GET | `/account/settings` | Get notification and preference settings |
| PATCH | `/account/settings` | Update settings |

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

---

## 16. Admin Routes  `/admin`  *(all require ADMIN or SUPER_ADMIN role)*

### Dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/dashboard` | Sales stats, recent orders, low stock, top products |

Response `data`:
```json
{
  "revenue": { "today": 0, "week": 0, "month": 0, "allTime": 0 },
  "orders": { "pending": 0, "processing": 0, "total": 0 },
  "customers": { "total": 0, "new": 0 },
  "products": { "total": 0, "lowStock": 0, "outOfStock": 0 },
  "recentOrders": Order[],
  "topProducts": Product[],
  "revenueChart": [{ "date": "2024-01-01", "revenue": 0 }]
}
```

---

### Products (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/products` | List all products (any status) |
| GET | `/admin/products/:id` | Get product with full detail (variants, images, inventory) |
| POST | `/admin/products` | Create product |
| PATCH | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Delete product |
| PATCH | `/admin/products/:id/stock` | Update stock quantity |
| DELETE | `/admin/products/:id/images/:imageId` | Remove a product image |

**GET /admin/products** query params: `page, limit, q, status, lowStock`

**POST / PATCH /admin/products** body:
```json
{
  "name": "Cobalt Evening Clutch",
  "slug": "cobalt-evening-clutch",
  "description": "...",
  "price": 280.00,
  "compareAtPrice": 340.00,
  "status": "DRAFT",
  "categoryId": "...",
  "collectionIds": ["..."],
  "images": [{ "url": "...", "altText": "...", "position": 0 }],
  "variants": [{ "name": "Navy", "price": 280, "stock": 5, "isAvailable": true }],
  "stock": 10,
  "isMadeToOrder": false,
  "madeToOrderLeadDays": null,
  "isNewArrival": true,
  "materials": "Japanese seed beads, brass clasp",
  "dimensions": "10 x 6 inches",
  "careInstructions": "...",
  "craftDetails": "...",
  "seoTitle": "...",
  "seoDescription": "..."
}
```

**PATCH /admin/products/:id/stock**
```json
{ "stockQuantity": 15 }
```

---

### Collections (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/collections` | List all collections |
| POST | `/admin/collections` | Create collection |
| PATCH | `/admin/collections/:id` | Update collection |
| DELETE | `/admin/collections/:id` | Delete collection |

**POST / PATCH body:**
```json
{
  "name": "Evening Edit",
  "slug": "evening-edit",
  "description": "...",
  "image": "...",
  "status": "ACTIVE",
  "isFeatured": true
}
```

---

### Categories (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/categories` | List all categories |
| POST | `/admin/categories` | Create category |
| PATCH | `/admin/categories/:id` | Update category |
| DELETE | `/admin/categories/:id` | Delete category |

**POST / PATCH body:**
```json
{ "name": "Clutch Bags", "slug": "clutch-bags", "description": "...", "isActive": true }
```

---

### Orders (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/orders` | List all orders |
| GET | `/admin/orders/:id` | Full order detail |
| PATCH | `/admin/orders/:id` | Update order status / tracking |

**GET /admin/orders** query params: `page, limit, q, status`

**PATCH /admin/orders/:id**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "1Z999AA10123456784",
  "trackingCarrier": "UPS",
  "notes": "..."
}
```

---

### Custom Orders (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/custom-orders` | List all bespoke requests |
| GET | `/admin/custom-orders/:id` | Full bespoke request detail |
| PATCH | `/admin/custom-orders/:id` | Update status, price, notes |
| POST | `/admin/custom-orders/:id/messages` | Send message to customer |

**GET /admin/custom-orders** query params: `page, limit, q, status`

**PATCH /admin/custom-orders/:id**
```json
{ "status": "IN_PROGRESS", "quotedPrice": 450.00, "estimatedCompletionDate": "2024-12-01", "notes": "..." }
```

**POST /admin/custom-orders/:id/messages**
```json
{ "content": "Your piece is ready for review..." }
```

---

### Customers (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/customers` | List all customers |
| PATCH | `/admin/customers/:id` | Ban / unban customer |

**GET /admin/customers** query params: `page, limit, q`

**PATCH /admin/customers/:id**
```json
{ "isActive": false }
```

---

### Reviews (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/reviews` | List all reviews |
| PATCH | `/admin/reviews/:id` | Approve / reject review |
| DELETE | `/admin/reviews/:id` | Delete review |

**GET /admin/reviews** query params: `page, limit, q, status (PENDING|APPROVED|REJECTED)`

**PATCH /admin/reviews/:id**
```json
{ "status": "APPROVED" }
```

---

### Coupons (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/coupons` | List all coupons |
| POST | `/admin/coupons` | Create coupon |
| PATCH | `/admin/coupons/:id` | Update coupon |
| DELETE | `/admin/coupons/:id` | Delete coupon |

**POST / PATCH body:**
```json
{
  "code": "LADYB20",
  "type": "PERCENTAGE",
  "value": 20,
  "minOrderAmount": 100,
  "maxUses": 500,
  "usedCount": 0,
  "startsAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-12-31T23:59:59Z",
  "isActive": true
}
```

---

### Newsletter (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/newsletter` | List all subscribers |
| POST | `/admin/newsletter/broadcast` | Send broadcast email to all subscribers |
| GET | `/admin/newsletter/export` | Download subscriber CSV (blob response) |
| DELETE | `/admin/newsletter/:id` | Unsubscribe / delete subscriber |

**GET /admin/newsletter** query params: `page, limit, q`

**POST /admin/newsletter/broadcast**
```json
{ "subject": "New Collection Drop", "body": "<p>HTML content...</p>" }
```

---

### Contact Messages (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/contact-messages` | List all contact form submissions |
| PATCH | `/admin/contact-messages/:id` | Mark as read |
| POST | `/admin/contact-messages/:id/reply` | Send reply email to sender |
| DELETE | `/admin/contact-messages/:id` | Delete message |

**GET /admin/contact-messages** query params: `page, limit, q`

**PATCH /admin/contact-messages/:id**
```json
{ "isRead": true }
```

**POST /admin/contact-messages/:id/reply**
```json
{ "body": "Thank you for your message..." }
```

---

### Wholesale Enquiries (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/wholesale` | List wholesale applications |
| PATCH | `/admin/wholesale/:id` | Update status |

**GET /admin/wholesale** query params: `page, limit, q`

**PATCH /admin/wholesale/:id**
```json
{ "status": "APPROVED" }
```

---

### Press Enquiries (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/press` | List press enquiries |
| PATCH | `/admin/press/:id` | Update status |

**PATCH /admin/press/:id**
```json
{ "status": "RESPONDED" }
```

---

### Inventory (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/products` | Reused — filtered with `?lowStock=true` |
| PATCH | `/admin/products/:id/stock` | Update stock |

---

### Settings (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/settings` | Get global site settings |
| PATCH | `/admin/settings` | Update site settings |

**PATCH /admin/settings**
```json
{
  "siteName": "Lady B Designs and Handcraft",
  "siteTagline": "Wearable Art, Crafted by Hand",
  "contactEmail": "...",
  "contactPhone": "...",
  "address": "...",
  "freeShippingThreshold": 250,
  "currency": "USD",
  "metaTitle": "...",
  "metaDescription": "...",
  "socialInstagram": "...",
  "socialFacebook": "...",
  "socialPinterest": "...",
  "maintenanceMode": false
}
```

---

### Audit Logs (Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/audit-logs` | List admin action audit trail |

**GET /admin/audit-logs** query params: `page, limit, q`

---

---

## 17. Standard Response Shapes

### Paginated list
```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 100,
    "page": 1,
    "totalPages": 10,
    "limit": 10
  }
}
```

### User object
```json
{
  "id": "...", "email": "...", "firstName": "...", "lastName": "...",
  "role": "CUSTOMER | ADMIN | SUPER_ADMIN",
  "isEmailVerified": true, "isActive": true,
  "avatarUrl": null, "phone": null,
  "createdAt": "...", "updatedAt": "..."
}
```

### Order object
```json
{
  "id": "...", "orderNumber": "LB-2024-0001",
  "status": "PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED",
  "items": [{ "id": "...", "product": {}, "variant": {}, "quantity": 1, "price": 280 }],
  "subtotal": 280, "discount": 0, "shipping": 0, "tax": 0, "total": 280,
  "shippingAddress": {}, "trackingNumber": null, "trackingCarrier": null,
  "createdAt": "...", "updatedAt": "..."
}
```

---

## 18. HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Validation error |
| 401 | Missing / invalid token |
| 403 | Insufficient role |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, slug) |
| 422 | Business rule violation (e.g. coupon expired) |
| 429 | Rate limited |
| 500 | Internal server error |

---

## 19. Middleware Required

- `authenticate` — verify JWT, attach `req.user`
- `requireAdmin` — require role `ADMIN | SUPER_ADMIN`
- `authRateLimit` — strict rate limit on login/register/forgot-password
- `validate(schema, target?)` — Zod schema validation (body or query)
- `upload` — multer for image uploads
- `pagination` — parse `page` + `limit` query params into skip/take

---

## 20. Endpoints Summary Count

| Domain | Endpoints |
|--------|-----------|
| Auth | 7 |
| Products | 11 |
| Categories | 1 |
| Collections | 2 |
| Reviews | 1 |
| Coupons | 1 |
| Newsletter | 1 |
| Gift Cards | 1 |
| Journal | 2 |
| Contact | 1 |
| Custom Orders (public) | 2 |
| Checkout | 1 |
| Orders | 1 |
| Uploads | 1 |
| Account | 17 |
| Admin | 42 |
| **Total** | **92** |
