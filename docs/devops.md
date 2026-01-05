# DevOps Architecture

## Purpose
This document defines the DevOps architecture for the ProdSight offline application. The system delivers a **single, fully self-contained HTML file** (`index.html`) that runs entirely offline via `file://`, includes all dependencies, and can be distributed through internal networks or removable media.

## Core Principles
- **Single-file runtime:** Only `index.html` is required at runtime.
- **Offline-first:** No servers, no services, no runtime environment dependencies.
- **Deterministic builds:** Pinned tooling and strict configuration validation.
- **Secure distribution:** Checksummed output with offline verification.

## Build Model
The build is **authoritative and build-time only**. All configuration, assets, and dependencies are inlined during build and emitted as a single-line, fully minified HTML file.

**Runtime deliverable:**
- `dist/index.html` (single-line, self-contained, and offline-capable)

## Configuration Management
Configuration is **build-time only** and sourced from either local `.env` files or CI secrets.

**Allowed variables (exactly five):**
- `PAGE_TITLE`
- `COMPANY_LOGO_SVG`
- `EXCEL_FILE_PATH`
- `ROWS_PER_PAGE`
- `AUTO_REFRESH_INTERVAL_MS`

**Validation rules:**
- All five variables must be present and valid.
- Any extra variable causes the build to fail.
- Values are inlined into the output at build time.

## Tooling
- **Node.js 25.x (pinned)**
- **esbuild** for bundling and minification
- HTML/CSS/JS minified to **a single line**
- Third-party libraries (SheetJS + Jalali) fully inlined
- Fonts can optionally be embedded for future-proofing

## Build Flow (Local & CI)
1. Load configuration from `.env` (local) or secrets (CI).
2. Validate configuration (presence, types, and no extras).
3. Bundle the application and vendor libraries.
4. Inline configuration and assets.
5. Aggressively minify to a single-line output.
6. Emit `dist/index.html`.
7. Generate `SHA256SUMS.txt` for integrity verification.

## CI/CD (GitHub Actions)
CI produces the same deterministic artifact as local builds and never uses `.env` files.

**Triggers:**
- Manual
- Commit-based
- Hotfix

**Outputs:**
- `index.html`
- `SHA256SUMS.txt`

Artifacts are published to the release or exported for distribution.

## Runtime Excel Handling
Runtime behavior supports both automatic path loading and manual fallback.

**Load strategy:**
1. **Auto-load** using `EXCEL_FILE_PATH` (best-effort across OS/path formats).
2. **Fallback** to a manual “Select Excel file” picker.

**Refresh logic:**
- Periodic polling based on `AUTO_REFRESH_INTERVAL_MS`.
- Change detection uses `lastModified` when a file handle exists, otherwise a content hash.
- On failure: show a Persian error, hide the table, and continue retrying silently.
- Manual refresh is disabled while a file is being read.

## Compatibility Guarantees
- Works in all modern browsers.
- Runs on all major operating systems.
- Opens via `file://` without any servers.
- Network share access is governed by OS authentication.

## Security & Integrity
- Builds are deterministic (pinned dependencies).
- SHA-256 checksums are required for output verification.
- Offline integrity verification is supported in regulated or air-gapped environments.

## Definition of Done
- Single output file: `index.html`.
- Output is fully minified to a single line.
- No runtime dependencies or servers.
- Excel auto-load with manual fallback.
- Signed or checksummed output for distribution.
