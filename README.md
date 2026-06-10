# Lady B Designs and Handcraft — Commerce Platform

> Wearable Art, Crafted by Hand.

A production-grade luxury ecommerce platform for Lady B Designs and Handcraft, a global artisan fashion house specializing in handcrafted bead bags, statement necklaces, and bespoke accessories, based in Indianapolis, IN.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma + PostgreSQL 16 |
| Cache | Redis 7 |
| Payments | Stripe + PayPal |
| Storage | Cloudinary |
| Reverse Proxy | Nginx |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## Monorepo Structure

```
lady-b-commerce/
├── lady-b-fe/          # React frontend
├── lady-b-be/          # Express backend
├── infrastructure/
│   ├── nginx/          # Nginx configs (dev + prod)
│   └── scripts/        # Dev, deploy, backup scripts
├── docs/
│   └── BLUEPRINT.md    # Full architecture blueprint
├── .github/workflows/  # 5 CI/CD workflows
├── docker-compose.yml
└── docker-compose.prod.yml
```

---

## Quick Start (Development)

### Prerequisites

- Node.js 20+
- Docker Desktop
- npm 10+

### 1. Clone and install

```bash
git clone <repo-url> lady-b-commerce
cd lady-b-commerce
npm install
```

### 2. Configure environment

```bash
cp lady-b-be/.env.example lady-b-be/.env
cp lady-b-fe/.env.example lady-b-fe/.env
```

Edit `lady-b-be/.env` with your credentials:

```env
DATABASE_URL=postgresql://ladyb:ladyb_password@localhost:5432/ladybcommerce
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=<min 32 chars>
JWT_REFRESH_SECRET=<min 32 chars>
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

### 3. Start with Docker

```bash
# Start all 5 containers
docker compose up -d

# Run DB migrations + seed
npm run db:migrate
npm run db:seed
```

### 4. Start without Docker (local Node)

```bash
# Start only infrastructure
docker compose up -d lady-b-postgres lady-b-redis

# Run backend + frontend concurrently
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api/docs
- Nginx proxy: http://localhost:80

---

## Default Admin Account

After seeding:
- **Email**: Adebiyiblessing55@gmail.com
- **Password**: AdminLadyB2024!

---

## Database

```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Generate Prisma client (after schema changes)
npm run db:generate
```

---

## Testing

```bash
# Frontend tests (Vitest + Testing Library)
cd lady-b-fe && npm test

# Backend tests
cd lady-b-be && npm test

# All tests from root
npm test
```

---

## Docker Commands

```bash
# Development
npm run docker:up      # Start all containers
npm run docker:down    # Stop all containers
npm run docker:logs    # Stream logs

# Production
npm run docker:prod:up    # Start production stack
npm run docker:prod:down  # Stop production stack
```

---

## Production Deployment

See [`docs/BLUEPRINT.md`](docs/BLUEPRINT.md) — Section 32: Deployment Strategy.

### Quick deploy

```bash
# Build production images
npm run docker:build

# On the server
docker compose -f docker-compose.prod.yml up -d
```

CI/CD via GitHub Actions: push to `main` triggers deployment to production. See `.github/workflows/deploy.yml`.

---

## API Documentation

Swagger UI is available at `/api/docs` in non-production environments.

**Base URL**: `http://localhost:4000/api`

Key route groups:
- `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`
- `GET /products`, `GET /products/:slug`
- `GET /cart`, `POST /cart/items`, `DELETE /cart/items/:id`
- `POST /orders`, `GET /orders/:id`
- `POST /custom-orders`, `GET /custom-orders/:id`
- `POST /checkout/stripe/create-payment-intent`
- `GET /admin/dashboard`, `GET /admin/orders`, etc.

---

## Environment Variables Reference

### Backend (`lady-b-be/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `JWT_ACCESS_SECRET` | Yes | Min 32 chars |
| `JWT_REFRESH_SECRET` | Yes | Min 32 chars |
| `JWT_ACCESS_EXPIRES_IN` | Yes | e.g. `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Yes | e.g. `7d` |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `PAYPAL_CLIENT_ID` | Yes | PayPal REST API |
| `PAYPAL_CLIENT_SECRET` | Yes | PayPal REST API |
| `CLOUDINARY_CLOUD_NAME` | Yes | Image uploads |
| `CLOUDINARY_API_KEY` | Yes | |
| `CLOUDINARY_API_SECRET` | Yes | |
| `SMTP_HOST` | Yes | Email server |
| `SMTP_PORT` | Yes | |
| `SMTP_USER` | Yes | |
| `SMTP_PASS` | Yes | |
| `CORS_ORIGIN` | Yes | Frontend URL |
| `PORT` | No | Default: 4000 |
| `NODE_ENV` | No | development/production/test |

### Frontend (`lady-b-fe/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend URL |
| `VITE_STRIPE_PUBLIC_KEY` | Yes | Stripe publishable key |
| `VITE_PAYPAL_CLIENT_ID` | Yes | PayPal client ID |
| `VITE_CLOUDINARY_CLOUD_NAME` | Yes | |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Yes | |

---

## Brand

**Lady B Designs and Handcraft**
Luxury artisan fashion house — handcrafted bead bags, statement necklaces, bespoke accessories.

- 731 Westbury West Dr, Indianapolis IN 46224
- +1 (317) 333-1333
- Adebiyiblessing55@gmail.com

---

## License

Proprietary. All rights reserved. © Lady B Designs and Handcraft.
