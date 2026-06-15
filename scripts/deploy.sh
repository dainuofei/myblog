#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Configuration — change these to match your server
# ============================================================
SERVER="blog-server"
REMOTE_PATH="/var/www/blog"

# ============================================================
# Build and deploy
# ============================================================
echo "==> Building site..."
pnpm build

echo "==> Deploying to ${SERVER}:${REMOTE_PATH}..."
rsync -avz --delete --checksum \
  dist/ \
  "${SERVER}:${REMOTE_PATH}/"

echo "==> Done. Visit http://106.75.209.37"
