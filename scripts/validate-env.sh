#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

# Required configuration keys (must exist and be non-empty).
REQUIRED_KEYS=(
  "PAGE_TITLE"
  "COMPANY_LOGO_ASSET_PATH"
  "EXCEL_FILE_PATH"
  "ROWS_PER_PAGE"
  "AUTO_REFRESH_INTERVAL_MS"
)

# Trim leading and trailing whitespace from a string.
log_info() {
  printf "[INFO] %s\n" "$1"
}

log_warn() {
  printf "[WARN] %s\n" "$1"
}

log_error() {
  printf "[ERROR] %s\n" "$1"
}

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

# Skip validation when no .env is present (build or commit can proceed).
if [ ! -f "$ENV_FILE" ]; then
  log_warn ".env not found. Skipping validation."
  exit 0
fi

# Track which keys are present and collect validation errors.
declare -A seen_keys=()
missing=()
extra=()
empty=()

# Parse .env line-by-line, supporting comments, export prefixes, and CRLF.
while IFS= read -r raw_line || [ -n "$raw_line" ]; do
  line="${raw_line%$'\r'}"
  line="$(trim "$line")"
  if [ -z "$line" ] || [[ "$line" == \#* ]]; then
    continue
  fi

  if [[ "$line" == export\ * ]]; then
    line="${line#export }"
    line="$(trim "$line")"
  fi

  # Ignore lines without key/value delimiters.
  if [[ "$line" != *"="* ]]; then
    continue
  fi

  key="${line%%=*}"
  value="${line#*=}"
  key="$(trim "$key")"
  value="$(trim "$value")"

  # Skip entries with empty keys.
  if [ -z "$key" ]; then
    continue
  fi

  seen_keys["$key"]=1

  # Record unexpected keys immediately.
  if ! printf '%s\n' "${REQUIRED_KEYS[@]}" | grep -qx "$key"; then
    extra+=("$key")
    continue
  fi

  # Required keys must not be empty.
  if [ -z "$value" ]; then
    empty+=("$key")
  fi
done < "$ENV_FILE"

# Check for required keys that never appeared.
for key in "${REQUIRED_KEYS[@]}"; do
  if [ -z "${seen_keys[$key]+present}" ]; then
    missing+=("$key")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  log_error "Missing required .env keys: ${missing[*]}"
  exit 1
fi

if [ ${#extra[@]} -gt 0 ]; then
  log_error "Extra .env keys are not allowed: ${extra[*]}"
  exit 1
fi

if [ ${#empty[@]} -gt 0 ]; then
  log_error "Required .env keys must be non-empty: ${empty[*]}"
  exit 1
fi

log_info ".env validated successfully."
