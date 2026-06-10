#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="lady-b-db-${DATE}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "📦 Creating database backup: $FILENAME"
docker exec lady-b-postgres pg_dump -U "${POSTGRES_USER:-ladyb}" "${POSTGRES_DB:-ladybcommerce}" | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "✅ Backup saved to ${BACKUP_DIR}/${FILENAME}"

# Keep only last 30 backups
find "$BACKUP_DIR" -name "lady-b-db-*.sql.gz" -type f | sort -r | tail -n +31 | xargs rm -f 2>/dev/null || true
echo "🧹 Old backups cleaned up"
