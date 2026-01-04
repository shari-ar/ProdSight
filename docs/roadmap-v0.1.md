# ProdSight Delivery Roadmap for v0.1

This roadmap follows the project’s offline, single-file output constraints and IaC-only DevOps requirements. Steps are ordered by dependencies and split by role. Each step includes an observable outcome.

## Phase 1 — DevOps: Developer Environment (Devcontainer, IaC)

### 1.1 Create Devcontainer (IaC)
**Outcome:** Developers can open the repo in a Devcontainer with pinned Node 25.x, required tooling preinstalled, and One command bootstraps the environment (dependencies, env validation hooks, tooling).

## Phase 2 — Developers: Minimal Application Skeleton

### 2.1 Initialize project scaffold
**Outcome:** A minimal build pipeline exists (Vite/esbuild setup per constraints).

### 2.2 Produce the first minimal `index.html`
**Outcome:** Single-line, offline-capable `dist/index.html` is generated with a basic UI shell.

### 2.3 Add strict config validation stub
**Outcome:** Build fails when required `.env` variables are missing or extra variables are present.

## Phase 3 — DevOps: CI/CD, Packaging, and Distribution (IaC)

### 3.1 Set up CI build pipeline (IaC)
**Outcome:** GitHub Actions (or equivalent) builds the single-file artifact using secrets (no `.env` in CI).

### 3.2 Enforce deterministic, single-line output
**Outcome:** Build process guarantees `dist/index.html` is one line and all dependencies are inlined.

### 3.3 Generate integrity checksums
**Outcome:** `SHA256SUMS.txt` produced for `index.html`.

### 3.4 Publish build artifacts
**Outcome:** `index.html` and checksum are available from CI artifacts or release page.

## Phase 4 — Developers: Full Feature Implementation

### 4.1 Implement Excel loading and parsing pipeline
**Outcome:** Excel data is read from `EXCEL_FILE_PATH`, normalized, and validated.

### 4.2 Build RTL Persian UI and status components
**Outcome:** UI matches the Persian RTL design with header, status line, and table rendering.

### 4.3 Implement refresh logic and error states
**Outcome:** Auto-refresh and manual refresh function correctly with visible error handling.

### 4.4 Finalize configuration validation
**Outcome:** Build fails on missing/extra `.env` variables per schema.

### 4.5 Release-ready build output
**Outcome:** Production build yields only `dist/index.html` and checksum, fully minified.
