#!/usr/bin/env bash
set -euo pipefail

if [[ ! -f .env.local ]]; then
  echo "Creating .env.local from .env.example"
  cp .env.example .env.local
  echo "Please edit .env.local and add your environment variables"
fi

echo "Setting Vercel environment variables..."
echo "Note: Use 'vercel env add' to set environment variables"
echo "Run: vercel env add VITE_SUPABASE_URL"
echo "Run: vercel env add VITE_SUPABASE_ANON_KEY"
echo "Run: vercel env add SUPABASE_PROJECT_REF"

echo ""
echo "Syncing Supabase secrets..."
supabase secrets set SUPABASE_DB_PASSWORD="${SUPABASE_DB_PASSWORD:-}" || true

echo ""
echo "Environment setup instructions:"
echo "1. Edit .env.local with your local development credentials"
echo "2. Use 'vercel env add KEY_NAME' to set production environment variables"
echo "3. Supabase secrets are managed via 'supabase secrets set'"
