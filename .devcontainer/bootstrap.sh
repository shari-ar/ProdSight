#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log_info() {
  printf "[INFO] %s\n" "$1"
}

log_warn() {
  printf "[WARN] %s\n" "$1"
}

log_info "Bootstrapping ProdSight dev environment..."

cd "$ROOT_DIR"

# Configure repository-local git hooks when running inside a work tree.
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git config --local core.hooksPath .githooks
  log_info "Configured git hooks path to .githooks."
fi

# Update npm
npm install -g npm

# Install dependencies only when a package manifest exists.
if [ -f package.json ]; then
  if [ -f package-lock.json ]; then
    # Use deterministic installs when a lockfile is present.
    npm ci --no-audit --no-fund
  else
    # Fall back to a standard install when no lockfile exists.
    npm install --no-audit --no-fund
  fi
else
  log_warn "No package.json found. Skipping npm install."
fi

# Ensure helper scripts are executable.
if [ -f scripts/validate-env.sh ]; then
  chmod +x scripts/validate-env.sh
  log_info "Ensured scripts/validate-env.sh is executable."
fi

if [ -f .githooks/pre-commit ]; then
  chmod +x .githooks/pre-commit
  log_info "Ensured .githooks/pre-commit is executable."
fi

log_info "Dev environment ready."
