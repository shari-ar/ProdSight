#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

REQUIRED_KEYS=(
  "PAGE_TITLE"
  "COMPANY_LOGO_BASE64"
  "EXCEL_FILE_PATH"
  "ROWS_PER_PAGE"
  "AUTO_REFRESH_INTERVAL_MS"
)

if [ ! -f "$ENV_FILE" ]; then
  printf "⚠️  .env not found. Skipping validation.\n"
  exit 0
fi

missing=()
extra=()

for key in "${REQUIRED_KEYS[@]}"; do
  if ! grep -qE "^${key}=" "$ENV_FILE"; then
    missing+=("$key")
  fi
done

while IFS='=' read -r key _; do
  if [ -z "$key" ] || [[ "$key" =~ ^# ]]; then
    continue
  fi
  if ! printf '%s\n' "${REQUIRED_KEYS[@]}" | grep -qx "$key"; then
    extra+=("$key")
  fi
done < "$ENV_FILE"

if [ ${#missing[@]} -gt 0 ]; then
  printf "❌ Missing required .env keys: %s\n" "${missing[*]}"
  exit 1
fi

if [ ${#extra[@]} -gt 0 ]; then
  printf "❌ Extra .env keys are not allowed: %s\n" "${extra[*]}"
  exit 1
fi

printf "✅ .env validated successfully.\n"
