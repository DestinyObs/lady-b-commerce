export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Lady B Commerce API',
    version: '1.0.0',
    description: 'Lady B Designs and Handcraft — Global Luxury Artisan Fashion Platform\n\n**Base URL:** `/api`\n\n**Auth:** `Authorization: Bearer <accessToken>`\n\n**All money values are in cents.** `28000` = $280.00',
    contact: { name: 'Lady B Designs', email: 'hello@ladybdesigns.com' },
  },
  servers: [
    { url: 'http://localhost:4000/api', description: 'Local development' },
    { url: 'https://api.ladybdesigns.com/api', description: 'Production' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Access token from /auth/login or /auth/register' },
    },
    schemas: {
      Success: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'object' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string', nullable: true },
          avatarUrl: { type: 'string', nullable: true },
          role: { type: 'string', enum: ['CUSTOMER', 'ADMIN', 'SUPER_ADMIN'] },
          isEmailVerified: { type: 'boolean' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          sku: { type: 'string', nullable: true },
          description: { type: 'string', nullable: true },
          price: { type: 'integer', description: 'In cents' },
          compareAtPrice: { type: 'integer', nullable: true, description: 'In cents' },
          status: { type: 'string', enum: ['DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK'] },
          stockQuantity: { type: 'integer' },
          isFeatured: { type: 'boolean' },
          isBestSeller: { type: 'boolean' },
          isNewArrival: { type: 'boolean' },
          isMadeToOrder: { type: 'boolean' },
          images: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, altText: { type: 'string' }, isPrimary: { type: 'boolean' } } } },
          category: { type: 'object', nullable: true, properties: { id: { type: 'string' }, name: { type: 'string' }, slug: { type: 'string' } } },
          variants: { type: 'array' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          orderNumber: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] },
          subtotal: { type: 'integer', description: 'In cents' },
          discount: { type: 'integer', description: 'In cents' },
          shippingCost: { type: 'integer', description: 'In cents' },
          total: { type: 'integer', description: 'In cents' },
          items: { type: 'array' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CustomOrder: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          status: { type: 'string', enum: ['SUBMITTED', 'REVIEWING', 'QUOTED', 'APPROVED_BY_CUSTOMER', 'DEPOSIT_PAID', 'IN_PRODUCTION', 'READY_FOR_FINAL_PAYMENT', 'FINAL_PAYMENT_PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REJECTED'] },
          quotedPrice: { type: 'integer', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication — register, login, tokens, password' },
    { name: 'Products', description: 'Product catalog, search, reviews, notifications' },
    { name: 'Categories', description: 'Product categories' },
    { name: 'Collections', description: 'Curated product collections' },
    { name: 'Reviews', description: 'Customer product reviews' },
    { name: 'Coupons', description: 'Discount codes' },
    { name: 'Newsletter', description: 'Email newsletter subscriptions' },
    { name: 'Gift Cards', description: 'Digital gift card purchase and redemption' },
    { name: 'Journal', description: 'Brand blog / journal posts' },
    { name: 'FAQ', description: 'Frequently asked questions' },
    { name: 'Contact', description: 'Contact form, wholesale, press enquiries' },
    { name: 'Custom Orders', description: 'Bespoke commission requests' },
    { name: 'Checkout', description: 'Shipping methods, payment intents, order confirmation' },
    { name: 'Orders', description: 'Order history and tracking' },
    { name: 'Uploads', description: 'Image upload endpoints' },
    { name: 'Account', description: 'Authenticated customer account — profile, addresses, wishlist, orders, settings' },
    { name: 'Admin — Dashboard', description: 'KPIs, analytics, audit logs' },
    { name: 'Admin — Products', description: 'Product CRUD, images, variants, stock' },
    { name: 'Admin — Categories', description: 'Category management' },
    { name: 'Admin — Collections', description: 'Collection management' },
    { name: 'Admin — Orders', description: 'Order management and fulfilment' },
    { name: 'Admin — Custom Orders', description: 'Bespoke commission management' },
    { name: 'Admin — Customers', description: 'Customer account management' },
    { name: 'Admin — Reviews', description: 'Review moderation' },
    { name: 'Admin — Coupons', description: 'Discount code management' },
    { name: 'Admin — Newsletter', description: 'Newsletter subscriber management and broadcasts' },
    { name: 'Admin — Contact', description: 'Contact message management' },
    { name: 'Admin — Wholesale', description: 'Wholesale application management' },
    { name: 'Admin — Press', description: 'Press enquiry management' },
    { name: 'Admin — Journal', description: 'Blog / journal CMS' },
    { name: 'Admin — Gift Cards', description: 'Gift card management' },
    { name: 'Admin — FAQ', description: 'FAQ management' },
    { name: 'Admin — Inventory', description: 'Stock level monitoring' },
    { name: 'Admin — Settings', description: 'Site configuration' },
    { name: 'Webhooks', description: 'Stripe webhook events' },
    { name: 'Health', description: 'Service health check' },
  ],
  paths: {
    // ── Health ────────────────────────────────────────────────────────────────
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Service health check',
        responses: {
          200: { description: 'API, database, and Redis are operational' },
        },
      },
    },

    // ── Auth ──────────────────────────────────────────────────────────────────
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Create customer account',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password', 'firstName', 'lastName'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8 }, firstName: { type: 'string' }, lastName: { type: 'string' }, phone: { type: 'string' } } } } } },
        responses: { 201: { description: 'Account created — returns user + tokens' }, 409: { description: 'Email already in use' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Email + password sign in',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } } } } } },
        responses: { 200: { description: 'Login successful — returns user + tokens' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Invalidate refresh token', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Logged out' } } },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Exchange refresh token for new token pair',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['refreshToken'], properties: { refreshToken: { type: 'string' } } } } } },
        responses: { 200: { description: 'New access + refresh tokens' }, 401: { description: 'Invalid or expired refresh token' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Send password reset email',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { 200: { description: 'Reset link sent (always 200 to prevent enumeration)' } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Consume reset token, set new password',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['token', 'password'], properties: { token: { type: 'string' }, password: { type: 'string', minLength: 8 } } } } } },
        responses: { 200: { description: 'Password reset' }, 400: { description: 'Invalid or expired token' } },
      },
    },
    '/auth/me': {
      get: { tags: ['Auth'], summary: 'Return authenticated user', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Current user object' } } },
    },
    '/auth/change-password': {
      patch: {
        tags: ['Auth'],
        summary: 'Change password (requires current password)',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['currentPassword', 'newPassword'], properties: { currentPassword: { type: 'string' }, newPassword: { type: 'string', minLength: 8 } } } } } },
        responses: { 200: { description: 'Password changed' }, 400: { description: 'Current password incorrect' } },
      },
    },
    '/auth/verify-email': {
      get: {
        tags: ['Auth'],
        summary: 'Verify email address from link',
        parameters: [{ in: 'query', name: 'token', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Email verified' }, 400: { description: 'Invalid token' } },
      },
    },
    '/auth/resend-verification': {
      post: {
        tags: ['Auth'],
        summary: 'Resend email verification link',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { 200: { description: 'Link sent (always 200 to prevent enumeration)' } },
      },
    },

    // ── Products ──────────────────────────────────────────────────────────────
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Paginated product list with filters',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 12 } },
          { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Full-text search' },
          { in: 'query', name: 'categoryId', schema: { type: 'string' } },
          { in: 'query', name: 'status', schema: { type: 'string', enum: ['ACTIVE', 'DRAFT', 'ARCHIVED'] } },
          { in: 'query', name: 'featured', schema: { type: 'string', enum: ['true', 'false'] } },
          { in: 'query', name: 'bestSeller', schema: { type: 'string', enum: ['true', 'false'] } },
          { in: 'query', name: 'newArrival', schema: { type: 'string', enum: ['true', 'false'] } },
          { in: 'query', name: 'sortBy', schema: { type: 'string', enum: ['price', 'name', 'createdAt', 'updatedAt'] } },
          { in: 'query', name: 'sortOrder', schema: { type: 'string', enum: ['asc', 'desc'] } },
        ],
        responses: { 200: { description: 'Paginated product list' } },
      },
      post: {
        tags: ['Admin — Products'],
        summary: 'Create product',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
        responses: { 201: { description: 'Product created' }, 403: { description: 'Admin only' } },
      },
    },
    '/products/search': {
      get: {
        tags: ['Products'],
        summary: 'Instant search (header autocomplete)',
        parameters: [
          { in: 'query', name: 'q', required: true, schema: { type: 'string', minLength: 2 } },
          { in: 'query', name: 'limit', schema: { type: 'integer', default: 5, maximum: 20 } },
        ],
        responses: { 200: { description: 'Matching products' } },
      },
    },
    '/products/slug/{slug}': {
      get: {
        tags: ['Products'],
        summary: 'Product detail by URL slug',
        parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Product object' }, 404: { description: 'Not found' } },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Product detail by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Product object' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Admin — Products'],
        summary: 'Update product',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Updated product' } },
      },
      delete: {
        tags: ['Admin — Products'],
        summary: 'Soft-delete product',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/products/{id}/reviews': {
      get: {
        tags: ['Products', 'Reviews'],
        summary: 'Paginated approved reviews for a product',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }, { in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'limit', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Paginated reviews + avg rating' } },
      },
    },
    '/products/{id}/notify': {
      post: {
        tags: ['Products'],
        summary: 'Back-in-stock email signup',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } },
        responses: { 200: { description: 'Registered for notification' } },
      },
    },
    '/products/{id}/publish': {
      patch: { tags: ['Admin — Products'], summary: 'Publish draft product', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Published' } } },
    },
    '/products/{id}/archive': {
      patch: { tags: ['Admin — Products'], summary: 'Archive product', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Archived' } } },
    },
    '/products/{id}/stock': {
      patch: { tags: ['Admin — Products'], summary: 'Update stock quantity', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { stockQuantity: { type: 'integer' } } } } } }, responses: { 200: { description: 'Stock updated' } } },
    },
    '/products/{id}/images': {
      post: { tags: ['Admin — Products'], summary: 'Upload product images (multipart)', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 201: { description: 'Images uploaded' } } },
    },
    '/products/{id}/images/{imageId}': {
      patch: { tags: ['Admin — Products'], summary: 'Update image metadata', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }, { in: 'path', name: 'imageId', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin — Products'], summary: 'Delete product image', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }, { in: 'path', name: 'imageId', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/products/{id}/variants': {
      get: { tags: ['Admin — Products'], summary: 'List product variants', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Variants' } } },
      post: { tags: ['Admin — Products'], summary: 'Create product variant', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 201: { description: 'Created' } } },
    },
    '/products/{id}/variants/{variantId}': {
      patch: { tags: ['Admin — Products'], summary: 'Update variant', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }, { in: 'path', name: 'variantId', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin — Products'], summary: 'Delete variant', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }, { in: 'path', name: 'variantId', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/products/{id}/inventory-logs': {
      get: { tags: ['Admin — Inventory'], summary: 'Product inventory history', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Inventory log entries' } } },
    },

    // ── Categories ────────────────────────────────────────────────────────────
    '/categories': {
      get: { tags: ['Categories'], summary: 'List all active categories', responses: { 200: { description: 'Category array' } } },
    },
    '/admin/categories': {
      get: { tags: ['Admin — Categories'], summary: 'List all categories (any status)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'All categories' } } },
      post: { tags: ['Admin — Categories'], summary: 'Create category', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, slug: { type: 'string' }, description: { type: 'string' }, isActive: { type: 'boolean' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/admin/categories/{id}': {
      patch: { tags: ['Admin — Categories'], summary: 'Update category', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin — Categories'], summary: 'Delete category', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },

    // ── Collections ───────────────────────────────────────────────────────────
    '/collections': {
      get: { tags: ['Collections'], summary: 'List all active collections', responses: { 200: { description: 'Collection array' } } },
    },
    '/collections/slug/{slug}': {
      get: { tags: ['Collections'], summary: 'Collection detail + paginated products', parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Collection with products' }, 404: { description: 'Not found' } } },
    },
    '/admin/collections': {
      get: { tags: ['Admin — Collections'], summary: 'List all collections', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Collections' } } },
      post: { tags: ['Admin — Collections'], summary: 'Create collection', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } },
    },
    '/admin/collections/{id}': {
      get: { tags: ['Admin — Collections'], summary: 'Get collection by ID', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Collection' } } },
      patch: { tags: ['Admin — Collections'], summary: 'Update collection', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin — Collections'], summary: 'Delete collection', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/admin/collections/{id}/products': {
      post: { tags: ['Admin — Collections'], summary: 'Add product to collection', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 201: { description: 'Added' } } },
    },
    '/admin/collections/{id}/products/{productId}': {
      delete: { tags: ['Admin — Collections'], summary: 'Remove product from collection', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }, { in: 'path', name: 'productId', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Removed' } } },
    },

    // ── Reviews ───────────────────────────────────────────────────────────────
    '/reviews': {
      post: { tags: ['Reviews'], summary: 'Submit a review (verified purchase only)', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['productId', 'rating', 'body'], properties: { productId: { type: 'string' }, rating: { type: 'integer', minimum: 1, maximum: 5 }, title: { type: 'string' }, body: { type: 'string', minLength: 10 } } } } } }, responses: { 201: { description: 'Review submitted (pending approval)' } } },
    },
    '/reviews/{id}': {
      delete: { tags: ['Reviews'], summary: 'Delete own review (or admin)', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/admin/reviews': {
      get: { tags: ['Admin — Reviews'], summary: 'Paginated review list', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'status', schema: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] } }], responses: { 200: { description: 'Reviews' } } },
    },
    '/admin/reviews/{id}/approve': {
      patch: { tags: ['Admin — Reviews'], summary: 'Approve review', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Approved' } } },
    },
    '/admin/reviews/{id}/reject': {
      patch: { tags: ['Admin — Reviews'], summary: 'Reject review', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Rejected' } } },
    },
    '/admin/reviews/{id}': {
      delete: { tags: ['Admin — Reviews'], summary: 'Delete review', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },

    // ── Coupons ───────────────────────────────────────────────────────────────
    '/coupons/validate': {
      post: { tags: ['Coupons'], summary: 'Validate coupon code against cart subtotal', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['code', 'subtotal'], properties: { code: { type: 'string' }, subtotal: { type: 'number', description: 'Cart subtotal in cents' } } } } } }, responses: { 200: { description: 'Coupon is valid + discount amount' }, 400: { description: 'Invalid, expired, or minimum not met' } } },
    },
    '/admin/coupons': {
      get: { tags: ['Admin — Coupons'], summary: 'List all coupons', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Coupons' } } },
      post: { tags: ['Admin — Coupons'], summary: 'Create coupon', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } },
    },
    '/admin/coupons/{id}': {
      get: { tags: ['Admin — Coupons'], summary: 'Get coupon by ID', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Coupon' } } },
      patch: { tags: ['Admin — Coupons'], summary: 'Update coupon', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin — Coupons'], summary: 'Delete coupon', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },

    // ── Newsletter ────────────────────────────────────────────────────────────
    '/newsletter/subscribe': {
      post: { tags: ['Newsletter'], summary: 'Subscribe email (footer + popup)', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' }, source: { type: 'string', enum: ['footer', 'popup', 'checkout'] } } } } } }, responses: { 201: { description: 'Subscribed' }, 409: { description: 'Already subscribed' } } },
    },
    '/newsletter/unsubscribe': {
      post: { tags: ['Newsletter'], summary: 'Unsubscribe from newsletter', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } } } } }, responses: { 200: { description: 'Unsubscribed' } } },
    },
    '/admin/newsletter': {
      get: { tags: ['Admin — Newsletter'], summary: 'Paginated subscriber list', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Subscribers' } } },
    },
    '/admin/newsletter/broadcast': {
      post: { tags: ['Admin — Newsletter'], summary: 'Send broadcast email to all active subscribers', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['subject', 'body'], properties: { subject: { type: 'string' }, body: { type: 'string' } } } } } }, responses: { 200: { description: 'Broadcast sent' } } },
    },
    '/admin/newsletter/export': {
      get: { tags: ['Admin — Newsletter'], summary: 'Download subscriber CSV', security: [{ bearerAuth: [] }], responses: { 200: { description: 'CSV blob' } } },
    },
    '/admin/newsletter/{id}': {
      delete: { tags: ['Admin — Newsletter'], summary: 'Delete subscriber', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },

    // ── Gift Cards ────────────────────────────────────────────────────────────
    '/gift-cards': {
      post: { tags: ['Gift Cards'], summary: 'Purchase and email a digital gift card', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['amount'], properties: { amount: { type: 'integer', description: 'In cents, min 1000' }, recipientName: { type: 'string' }, recipientEmail: { type: 'string', format: 'email' }, senderName: { type: 'string' }, message: { type: 'string' } } } } } }, responses: { 201: { description: 'Gift card created + emailed' } } },
    },
    '/gift-cards/redeem': {
      post: { tags: ['Gift Cards'], summary: 'Validate gift card code at checkout', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['code'], properties: { code: { type: 'string' }, orderId: { type: 'string' } } } } } }, responses: { 200: { description: 'Gift card balance' }, 400: { description: 'Invalid or expired' } } },
    },
    '/admin/gift-cards': {
      get: { tags: ['Admin — Gift Cards'], summary: 'List all issued gift cards', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Gift cards' } } },
    },
    '/admin/gift-cards/{id}': {
      get: { tags: ['Admin — Gift Cards'], summary: 'Gift card detail + redemption history', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Gift card' } } },
      patch: { tags: ['Admin — Gift Cards'], summary: 'Deactivate / adjust gift card', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
    },

    // ── Journal ───────────────────────────────────────────────────────────────
    '/journal': {
      get: { tags: ['Journal'], summary: 'Paginated list of published posts', parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'limit', schema: { type: 'integer' } }, { in: 'query', name: 'category', schema: { type: 'string' } }], responses: { 200: { description: 'Posts' } } },
    },
    '/journal/{slug}': {
      get: { tags: ['Journal'], summary: 'Single post with related posts', parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Post + relatedPosts' }, 404: { description: 'Not found' } } },
    },
    '/admin/journal': {
      get: { tags: ['Admin — Journal'], summary: 'List all posts (any status)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Posts' } } },
      post: { tags: ['Admin — Journal'], summary: 'Create journal post', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } },
    },
    '/admin/journal/{id}': {
      get: { tags: ['Admin — Journal'], summary: 'Get post by ID', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Post' } } },
      patch: { tags: ['Admin — Journal'], summary: 'Update post', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin — Journal'], summary: 'Delete post', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/admin/journal/{id}/publish': {
      patch: { tags: ['Admin — Journal'], summary: 'Publish draft post', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Published' } } },
    },
    '/admin/journal/{id}/unpublish': {
      patch: { tags: ['Admin — Journal'], summary: 'Revert post to draft', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Reverted to draft' } } },
    },

    // ── FAQ ───────────────────────────────────────────────────────────────────
    '/faq': {
      get: { tags: ['FAQ'], summary: 'All active FAQ items', responses: { 200: { description: 'FAQ array grouped by category' } } },
    },
    '/admin/faqs': {
      get: { tags: ['Admin — FAQ'], summary: 'All FAQs (any status)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'FAQs' } } },
      post: { tags: ['Admin — FAQ'], summary: 'Create FAQ', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Created' } } },
    },
    '/admin/faqs/{id}': {
      patch: { tags: ['Admin — FAQ'], summary: 'Update FAQ', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin — FAQ'], summary: 'Delete FAQ', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },

    // ── Contact ───────────────────────────────────────────────────────────────
    '/contact': {
      post: { tags: ['Contact'], summary: 'Submit contact form', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'subject', 'message'], properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, phone: { type: 'string' }, subject: { type: 'string' }, message: { type: 'string' } } } } } }, responses: { 201: { description: 'Message received' } } },
    },
    '/wholesale/inquiry': {
      post: { tags: ['Contact'], summary: 'Submit wholesale application', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['business', 'name', 'email', 'country', 'message'], properties: { business: { type: 'string' }, name: { type: 'string' }, email: { type: 'string', format: 'email' }, phone: { type: 'string' }, country: { type: 'string' }, message: { type: 'string' } } } } } }, responses: { 201: { description: 'Application received' } } },
    },
    '/press/inquiry': {
      post: { tags: ['Contact'], summary: 'Submit press / media enquiry', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'publication', 'message'], properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, publication: { type: 'string' }, role: { type: 'string' }, message: { type: 'string' } } } } } }, responses: { 201: { description: 'Enquiry received' } } },
    },
    '/admin/contact-messages': {
      get: { tags: ['Admin — Contact'], summary: 'List contact form submissions', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'isRead', schema: { type: 'string', enum: ['true', 'false'] } }], responses: { 200: { description: 'Messages' } } },
    },
    '/admin/contact-messages/{id}': {
      patch: { tags: ['Admin — Contact'], summary: 'Mark message as read', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Admin — Contact'], summary: 'Delete contact message', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/admin/contact-messages/{id}/reply': {
      post: { tags: ['Admin — Contact'], summary: 'Reply to contact message by email', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['body'], properties: { body: { type: 'string' } } } } } }, responses: { 200: { description: 'Reply sent' } } },
    },
    '/admin/wholesale': {
      get: { tags: ['Admin — Wholesale'], summary: 'Paginated wholesale applications', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Applications' } } },
    },
    '/admin/wholesale/{id}': {
      patch: { tags: ['Admin — Wholesale'], summary: 'Update wholesale application status', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
    },
    '/admin/press': {
      get: { tags: ['Admin — Press'], summary: 'Paginated press enquiries', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Enquiries' } } },
    },
    '/admin/press/{id}': {
      patch: { tags: ['Admin — Press'], summary: 'Update press enquiry status', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
    },

    // ── Custom Orders ─────────────────────────────────────────────────────────
    '/custom-orders': {
      post: { tags: ['Custom Orders'], summary: 'Submit bespoke order request', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Request submitted' } } },
      get: { tags: ['Custom Orders'], summary: "List current user's custom orders", security: [{ bearerAuth: [] }], responses: { 200: { description: 'Custom orders' } } },
    },
    '/custom-orders/{id}': {
      get: { tags: ['Custom Orders'], summary: 'Track request status + messages', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Custom order' } } },
    },
    '/admin/custom-orders': {
      get: { tags: ['Admin — Custom Orders'], summary: 'Paginated bespoke request list', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'status', schema: { type: 'string' } }], responses: { 200: { description: 'Custom orders' } } },
    },
    '/admin/custom-orders/{id}': {
      get: { tags: ['Admin — Custom Orders'], summary: 'Full request with messages + timeline', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Custom order detail' } } },
    },
    '/admin/custom-orders/{id}/status': {
      patch: { tags: ['Admin — Custom Orders'], summary: 'Update custom order status', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
    },
    '/admin/custom-orders/{id}/quote': {
      post: { tags: ['Admin — Custom Orders'], summary: 'Send price quote to customer', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['quotedPrice'], properties: { quotedPrice: { type: 'integer' }, notes: { type: 'string' }, estimatedCompletionDate: { type: 'string', format: 'date' } } } } } }, responses: { 200: { description: 'Quote sent' } } },
    },
    '/admin/custom-orders/{id}/reject': {
      post: { tags: ['Admin — Custom Orders'], summary: 'Reject custom order request', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Rejected' } } },
    },

    // ── Checkout ──────────────────────────────────────────────────────────────
    '/checkout/shipping-methods': {
      get: { tags: ['Checkout'], summary: 'Available shipping options', responses: { 200: { description: 'Standard, Express, Overnight' } } },
    },
    '/checkout/create-payment-intent': {
      post: { tags: ['Checkout'], summary: 'Create Stripe PaymentIntent + order draft', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['items', 'shippingAddress'], properties: { items: { type: 'array' }, shippingAddress: { type: 'object' }, shippingMethodId: { type: 'string' }, couponCode: { type: 'string' } } } } } }, responses: { 201: { description: '{ clientSecret, orderId, amount }' } } },
    },
    '/checkout/confirm': {
      post: { tags: ['Checkout'], summary: 'Confirm order after Stripe payment succeeds', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['orderId', 'paymentIntentId'], properties: { orderId: { type: 'string' }, paymentIntentId: { type: 'string' } } } } } }, responses: { 200: { description: 'Order confirmed' } } },
    },

    // ── Orders ────────────────────────────────────────────────────────────────
    '/orders': {
      post: { tags: ['Orders'], summary: 'Create order from cart', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Order created' } } },
      get: { tags: ['Orders'], summary: 'List orders for current user', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Orders' } } },
    },
    '/orders/{id}': {
      get: { tags: ['Orders'], summary: 'Get order detail', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Order' }, 404: { description: 'Not found' } } },
    },
    '/admin/orders': {
      get: { tags: ['Admin — Orders'], summary: 'Paginated order list', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'status', schema: { type: 'string' } }, { in: 'query', name: 'q', schema: { type: 'string' } }], responses: { 200: { description: 'Orders' } } },
    },
    '/admin/orders/{id}': {
      get: { tags: ['Admin — Orders'], summary: 'Full order with items, customer, shipping', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Order detail' } } },
    },
    '/admin/orders/{id}/status': {
      patch: { tags: ['Admin — Orders'], summary: 'Update order status', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['status'], properties: { status: { type: 'string', enum: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] } } } } } }, responses: { 200: { description: 'Status updated' } } },
    },
    '/admin/orders/{id}/tracking': {
      patch: { tags: ['Admin — Orders'], summary: 'Update tracking info', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { trackingNumber: { type: 'string' }, trackingCarrier: { type: 'string' } } } } } }, responses: { 200: { description: 'Tracking updated' } } },
    },

    // ── Uploads ───────────────────────────────────────────────────────────────
    '/uploads/images': {
      post: { tags: ['Uploads'], summary: 'Upload product/collection images (multipart)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Uploaded URLs' } } },
    },
    '/uploads/avatar': {
      post: { tags: ['Uploads'], summary: 'Upload user avatar (multipart)', security: [{ bearerAuth: [] }], responses: { 201: { description: 'avatarUrl' } } },
    },

    // ── Account ───────────────────────────────────────────────────────────────
    '/account/profile': {
      get: { tags: ['Account'], summary: 'Get full profile', security: [{ bearerAuth: [] }], responses: { 200: { description: 'User profile' } } },
      patch: { tags: ['Account'], summary: 'Update name / phone', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { firstName: { type: 'string' }, lastName: { type: 'string' }, phone: { type: 'string' } } } } } }, responses: { 200: { description: 'Updated profile' } } },
    },
    '/account/avatar': {
      post: { tags: ['Account'], summary: 'Upload new avatar (multipart)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'avatarUrl' } } },
    },
    '/account/password': {
      patch: { tags: ['Account'], summary: 'Change password', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Password changed' } } },
    },
    '/account/dashboard': {
      get: { tags: ['Account'], summary: 'Summary: recent orders + stats', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Dashboard data' } } },
    },
    '/account/settings': {
      get: { tags: ['Account'], summary: 'Get notification + preference settings', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Settings' } } },
      patch: { tags: ['Account'], summary: 'Update settings', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Updated settings' } } },
    },
    '/account/addresses': {
      get: { tags: ['Account'], summary: 'List saved addresses', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Addresses' } } },
      post: { tags: ['Account'], summary: 'Add new address', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Address created' } } },
    },
    '/account/addresses/{id}': {
      get: { tags: ['Account'], summary: 'Get address by ID', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Address' } } },
      patch: { tags: ['Account'], summary: 'Update address', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Account'], summary: 'Delete address', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/account/addresses/{id}/default': {
      patch: { tags: ['Account'], summary: 'Set address as default', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Default set' } } },
    },
    '/account/wishlist': {
      get: { tags: ['Account'], summary: 'List wishlist items', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'limit', schema: { type: 'integer' } }], responses: { 200: { description: 'Wishlist items + total' } } },
      post: { tags: ['Account'], summary: 'Add product to wishlist', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['productId'], properties: { productId: { type: 'string' } } } } } }, responses: { 201: { description: 'Added' }, 200: { description: 'Already in wishlist' } } },
    },
    '/account/wishlist/{itemId}': {
      delete: { tags: ['Account'], summary: 'Remove item from wishlist', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'itemId', required: true, schema: { type: 'string' }, description: 'WishlistItem ID or productId' }], responses: { 200: { description: 'Removed' } } },
    },
    '/account/wishlist/check/{productId}': {
      get: { tags: ['Account'], summary: 'Check if product is in wishlist', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'string' } }], responses: { 200: { description: '{ inWishlist: boolean, itemId: string | null }' } } },
    },
    '/account/orders': {
      get: { tags: ['Account'], summary: 'Paginated order history', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'status', schema: { type: 'string' } }, { in: 'query', name: 'q', schema: { type: 'string' }, description: 'Order number search' }], responses: { 200: { description: 'Orders' } } },
    },
    '/account/orders/{id}': {
      get: { tags: ['Account'], summary: 'Full order detail with line items', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Order detail' } } },
    },
    '/account/custom-orders': {
      get: { tags: ['Account'], summary: "List customer's bespoke requests", security: [{ bearerAuth: [] }], responses: { 200: { description: 'Custom orders' } } },
    },
    '/account/custom-orders/{id}': {
      get: { tags: ['Account'], summary: 'Custom order detail', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Custom order' } } },
    },
    '/account/payment-methods': {
      get: { tags: ['Account'], summary: 'List saved Stripe payment methods', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Payment methods array' } } },
    },
    '/account/payment-methods/setup-intent': {
      post: { tags: ['Account'], summary: 'Create Stripe SetupIntent for saving a card', security: [{ bearerAuth: [] }], responses: { 201: { description: '{ clientSecret }' } } },
    },
    '/account/payment-methods/{id}': {
      delete: { tags: ['Account'], summary: 'Remove saved card', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Removed' } } },
    },
    '/account/invoices': {
      get: { tags: ['Account'], summary: 'List past invoices / receipts', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Invoices' } } },
    },

    // ── Admin Dashboard ───────────────────────────────────────────────────────
    '/admin/dashboard': {
      get: { tags: ['Admin — Dashboard'], summary: 'KPIs, revenue chart, recent activity', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Dashboard data' } } },
    },
    '/admin/analytics/sales': {
      get: { tags: ['Admin — Dashboard'], summary: 'Sales analytics with date range', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'from', schema: { type: 'string', format: 'date' } }, { in: 'query', name: 'to', schema: { type: 'string', format: 'date' } }], responses: { 200: { description: 'Sales data' } } },
    },
    '/admin/audit-logs': {
      get: { tags: ['Admin — Dashboard'], summary: 'Admin action audit trail', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }], responses: { 200: { description: 'Audit log entries' } } },
    },

    // ── Admin Customers ───────────────────────────────────────────────────────
    '/admin/customers': {
      get: { tags: ['Admin — Customers'], summary: 'Paginated customer list', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'q', schema: { type: 'string' } }], responses: { 200: { description: 'Customers' } } },
    },
    '/admin/customers/{id}': {
      patch: { tags: ['Admin — Customers'], summary: 'Update customer (ban/unban)', security: [{ bearerAuth: [] }], parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { isActive: { type: 'boolean' } } } } } }, responses: { 200: { description: 'Updated' } } },
    },

    // ── Admin Inventory ───────────────────────────────────────────────────────
    '/admin/inventory': {
      get: { tags: ['Admin — Inventory'], summary: 'Low-stock product list', security: [{ bearerAuth: [] }], parameters: [{ in: 'query', name: 'lowStock', schema: { type: 'string', enum: ['true'] } }], responses: { 200: { description: 'Products with stock levels' } } },
    },

    // ── Admin Settings ────────────────────────────────────────────────────────
    '/admin/settings': {
      get: { tags: ['Admin — Settings'], summary: 'Get site configuration', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Settings key-value map' } } },
      patch: { tags: ['Admin — Settings'], summary: 'Update site configuration', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Updated settings' } } },
    },

    // ── Webhooks ──────────────────────────────────────────────────────────────
    '/payments/stripe/webhook': {
      post: { tags: ['Webhooks'], summary: 'Stripe webhook receiver', description: 'Processes: payment_intent.succeeded, payment_intent.payment_failed, setup_intent.succeeded', responses: { 200: { description: 'Event processed' }, 400: { description: 'Signature verification failed' } } },
    },
  },
};
