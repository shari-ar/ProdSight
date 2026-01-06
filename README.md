# ProdSight

ProdSight is a **single-file, offline HTML** application for monitoring factory production plans and outputs stored in an Excel file. It delivers a polished **Persian (پارسی), RTL** interface with Jalali dates, robust data validation, and scheduled refreshes—all packaged into a single `index.html` that runs via `file://` without any servers or external dependencies.

## Key Features

- **Offline-first, single-file runtime**: ship one `index.html` that includes all assets and libraries.
- **Excel-driven data**: reads from a configured local path or network share with a manual file-picker fallback.
- **Professional RTL UI**: Persian typography, Jalali dates, and visually emphasized latest row.
- **Strict configuration validation**: exactly five required `.env` variables; builds fail on missing or extra values.
- **Deterministic builds**: pinned tooling versions and fully inlined dependencies.

## How It Works

1. **Build time**: configuration is loaded from `.env`, validated, bundled, and inlined.
2. **Runtime**: the user opens `index.html` locally (no server). The app reads the Excel file, normalizes rows, and renders the latest data.
3. **Refresh**: automatic polling checks file mtime to reload only when the Excel source changes; manual refresh triggers a full reload.

## Configuration

ProdSight is configured **only at build time** using a `.env` file. All values are inlined into the final output.

**Required variables (exactly five):**

| Variable | Type | Description |
|---|---|---|
| `PAGE_TITLE` | string | Visible page title in the UI (Persian). |
| `COMPANY_LOGO_ASSET_PATH` | string | Path to the static SVG asset (checked into the repo). |
| `EXCEL_FILE_PATH` | string | Absolute or relative path to the Excel file. |
| `ROWS_PER_PAGE` | number | Number of rows displayed in the table. |
| `AUTO_REFRESH_INTERVAL_MS` | bigint | Auto refresh interval in milliseconds. |

> Builds fail if any required value is missing, empty, or if **any extra keys** are present.

See [docs/configuration.md](./docs/configuration.md) for full details.

## Build & Output

The build pipeline produces **one file only**:

- `dist/index.html` (single-line, minified, fully self-contained)

The build flow, locked tool versions, and packaging steps are documented in [docs/build-and-run.md](./docs/build-and-run.md).

## Data Rules (Excel)

- Single worksheet only.
- Column headers are detected left-to-right and stop at the first empty header.
- Every row must contain a valid Date value (supports Persian/Arabic/English digits).
- Rows are sorted by Date (descending), and the newest row is highlighted.

See [docs/data-handling.md](./docs/data-handling.md).

## Testing

Unit tests cover date parsing, Excel reading, and data normalization. Suggested validation checks and build verification are listed in [docs/testing.md](./docs/testing.md).

## Operations & Troubleshooting

Common runtime issues (file not found, date parsing errors, manual refresh problems) and resolutions are documented in [docs/troubleshooting.md](./docs/troubleshooting.md).

## Architecture & Localization

- **Architecture**: [docs/architecture.md](./docs/architecture.md)
- **UI & i18n**: [docs/ui-and-i18n.md](./docs/ui-and-i18n.md)
- **DevOps/CI**: [docs/devops.md](./docs/devops.md)

---

If you need a full technical walkthrough, start with [docs/overview.md](./docs/overview.md). 
