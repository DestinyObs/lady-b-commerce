#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Starting Lady B Commerce development environment..."

# Copy env files if not present
[ ! -f ./lady-b-be/.env ] && cp ./lady-b-be/.env.example ./lady-b-be/.env && echo "✅ Backend .env created from example"
[ ! -f ./lady-b-fe/.env ] && cp ./lady-b-fe/.env.example ./lady-b-fe/.env && echo "✅ Frontend .env created from example"

# Start services
docker compose up --build "$@"
