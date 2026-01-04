#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

printf "\n🔧 Bootstrapping ProdSight dev environment...\n"

cd "$ROOT_DIR"

git config --local core.hooksPath .githooks

if [ -f package.json ]; then
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
else
  printf "No package.json found. Skipping npm install.\n"
fi

if [ -f scripts/validate-env.sh ]; then
  chmod +x scripts/validate-env.sh
fi

if [ -f .githooks/pre-commit ]; then
  chmod +x .githooks/pre-commit
fi

printf "✅ Dev environment ready.\n\n"
