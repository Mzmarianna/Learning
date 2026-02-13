#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT=${1:-production}

echo "Building client for ${ENVIRONMENT}..."
npm run build

echo "Deploying to Vercel..."
vercel deploy --prod

echo "Deploying Supabase functions..."
supabase functions deploy server
supabase functions deploy send-email

echo "Running smoke tests..."
"$(dirname "$0")/test-backend.sh" "${ENVIRONMENT}"

echo "Deployment finished."
