#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env ]]; then
  echo "Copying .env.example to .env"
  cp .env.example .env
fi

echo "Exporting Netlify environment variables"
netlify env:set VITE_SUPABASE_URL "${VITE_SUPABASE_URL:-}" || true
netlify env:set VITE_SUPABASE_ANON_KEY "${VITE_SUPABASE_ANON_KEY:-}" || true
netlify env:set SUPABASE_PROJECT_REF "${SUPABASE_PROJECT_REF:-}" || true

echo "Syncing Supabase secrets"
supabase secrets set SUPABASE_DB_PASSWORD="${SUPABASE_DB_PASSWORD:-}" || true
supabase secrets set VITE_NETLIFY_FUNCTIONS_URL="${VITE_NETLIFY_FUNCTIONS_URL:-}" || true

echo "Secrets setup complete. Review CLI output for skipped values."
