#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Deploying Lady B Commerce to production..."

IMAGE_TAG="${IMAGE_TAG:-latest}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-}"

# Build images
echo "📦 Building images..."
docker compose -f docker-compose.prod.yml build

# Run DB migrations
echo "🗄️  Running database migrations..."
docker compose -f docker-compose.prod.yml run --rm lady-b-be npx prisma migrate deploy

# Start/restart services
echo "🔄 Starting services..."
docker compose -f docker-compose.prod.yml up -d

# Health check
echo "🏥 Waiting for health check..."
sleep 10
curl -f http://localhost/api/health && echo "✅ Health check passed" || echo "❌ Health check failed"

echo "🎉 Deployment complete"
