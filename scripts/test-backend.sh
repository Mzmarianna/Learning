#!/usr/bin/env bash
set -euo pipefail

TARGET_STAGE=${1:-local}

if [[ -z "${VITE_NETLIFY_FUNCTIONS_URL:-}" ]]; then
  echo "VITE_NETLIFY_FUNCTIONS_URL not set. Skipping function smoke tests."
  exit 0
fi

SERVER_ENDPOINT="${VITE_NETLIFY_FUNCTIONS_URL%/}/server"
EMAIL_ENDPOINT="${VITE_NETLIFY_FUNCTIONS_URL%/}/send-email"

printf '(%s) Testing server function... ' "${TARGET_STAGE}"
if curl --fail --silent --show-error --max-time 10 "${SERVER_ENDPOINT}" > /dev/null; then
  echo "ok"
else
  echo "failed"
  exit 1
fi

printf '(%s) Testing send-email function... ' "${TARGET_STAGE}"
if curl --fail --silent --show-error --max-time 10 "${EMAIL_ENDPOINT}" > /dev/null; then
  echo "ok"
else
  echo "failed"
  exit 1
fi

echo "Backend smoke tests passed."
