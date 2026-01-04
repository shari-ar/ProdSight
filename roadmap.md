# ProdSight Delivery Roadmap

This roadmap follows the project’s offline, single-file output constraints and IaC-only DevOps requirements. Steps are ordered by dependencies and split by role. Each step includes an observable outcome and explicit verification so progress can be checked without reading code.

## Phase 0 — Alignment & Inputs (Shared)

### 0.1 Confirm baseline requirements and deliverable scope
**Outcome:** Written agreement on the single-file, offline runtime target and exact config variables.

**Verification:**
- Meeting notes or ticket comment explicitly listing the five required `.env` variables and stating the single-file `index.html` deliverable.

---

## Phase 1 — DevOps: Developer Environment (Devcontainer, IaC)

### 1.1 Create Devcontainer specification (IaC)
**Outcome:** Developers can open the repo in a Devcontainer with pinned Node 25.x and required tooling preinstalled.

**Verification:**
- `devcontainer.json` and Dockerfile (or image reference) committed to the repo.
- CI log or local terminal output showing `node --version` returning `v25.x` inside the container.

### 1.2 Add container bootstrap scripts (IaC)
**Outcome:** One command bootstraps the environment (dependencies, env validation hooks, tooling).

**Verification:**
- CI or local container log showing successful execution of the bootstrap script with a non-error exit status.

### 1.3 Document Devcontainer usage
**Outcome:** Clear, repeatable steps for developers to start work in the container.

**Verification:**
- README or docs page updated with Devcontainer start instructions.
- Screenshot of the editor/terminal inside the Devcontainer showing the repo opened.

---

## Phase 2 — Developers: Minimal Application Skeleton

### 2.1 Initialize project scaffold
**Outcome:** A minimal build pipeline exists (Vite/esbuild setup per constraints).

**Verification:**
- `npm run build` (or equivalent) completes successfully in the container.
- CI log or terminal output shows build success.

### 2.2 Produce the first minimal `index.html`
**Outcome:** Single-line, offline-capable `dist/index.html` is generated with a basic UI shell.

**Verification:**
- `dist/index.html` exists and is a single line.
- Screenshot of `dist/index.html` opened via `file://` showing the placeholder UI.

### 2.3 Add strict config validation stub
**Outcome:** Build fails when required `.env` variables are missing or extra variables are present.

**Verification:**
- CI log or terminal output showing a failed build when `.env` is incomplete/over-specified.

---

## Phase 3 — DevOps: CI/CD, Packaging, and Distribution (IaC)

### 3.1 Set up CI build pipeline (IaC)
**Outcome:** GitHub Actions (or equivalent) builds the single-file artifact using secrets (no `.env` in CI).

**Verification:**
- CI workflow file committed.
- CI run log showing environment variables injected from secrets and build success.

### 3.2 Enforce deterministic, single-line output
**Outcome:** Build process guarantees `dist/index.html` is one line and all dependencies are inlined.

**Verification:**
- CI log or terminal output showing a single-line check pass (e.g., line count = 1).
- Artifact inspection in CI showing only `index.html` (plus checksum file).

### 3.3 Generate integrity checksums
**Outcome:** `SHA256SUMS.txt` produced for `index.html`.

**Verification:**
- CI artifacts list includes `SHA256SUMS.txt`.
- CI log shows checksum generation command executed successfully.

### 3.4 Publish build artifacts
**Outcome:** `index.html` and checksum are available from CI artifacts or release page.

**Verification:**
- CI artifacts page or release page shows downloadable `index.html` and `SHA256SUMS.txt`.

---

## Phase 4 — Developers: Full Feature Implementation

### 4.1 Implement Excel loading and parsing pipeline
**Outcome:** Excel data is read from `EXCEL_FILE_PATH`, normalized, and validated.

**Verification:**
- Screenshot of UI showing parsed data rows from a sample Excel file.
- Runtime log panel or console output (screenshot) showing successful load.

### 4.2 Build RTL Persian UI and status components
**Outcome:** UI matches the Persian RTL design with header, status line, and table rendering.

**Verification:**
- Screenshot of the UI in `file://` with Persian labels and RTL layout.

### 4.3 Implement refresh logic and error states
**Outcome:** Auto-refresh and manual refresh function correctly with visible error handling.

**Verification:**
- Screen recording or screenshots showing:
  - Manual refresh triggers reload.
  - Auto-refresh updates after a modified Excel file.
  - Error card appears when file is inaccessible.

### 4.4 Finalize configuration validation
**Outcome:** Build fails on missing/extra `.env` variables per schema.

**Verification:**
- CI logs demonstrating failure on invalid config and success on valid config.

### 4.5 Release-ready build output
**Outcome:** Production build yields only `dist/index.html` and checksum, fully minified.

**Verification:**
- CI artifact list showing only `index.html` and `SHA256SUMS.txt`.
- `wc -l dist/index.html` = 1 (logged in CI).

---

## Phase 5 — Acceptance & Handover (Shared)

### 5.1 Offline runtime validation
**Outcome:** App runs fully offline on a target machine from local disk or USB.

**Verification:**
- Photo or screenshot of the app opened via `file://` on the target OS.
- Checklist in a ticket confirming no server dependencies.

### 5.2 Distribution integrity verification
**Outcome:** Recipient can verify the `index.html` checksum offline.

**Verification:**
- Screenshot or log of checksum verification command output on target environment.

### 5.3 Documentation and operational readiness
**Outcome:** Runbook and troubleshooting steps are complete.

**Verification:**
- Docs page updated and linked from README.
- Sign-off comment in the release ticket.
