# Overview

ProdSight is a **single-file offline HTML** application for monitoring factory production plans and outputs stored in an Excel file. It renders a professional, Persian (پارسی), RTL interface, supports **all major operating systems and browsers**, and refreshes data on a schedule or via a manual refresh button.

## Goals

- Deliver a **single static `index.html`** file that runs fully offline.
- Read **Excel data** from a local path or network share and render a sortable, paginated table.
- Provide a **formal, premium UI** with clear status and error states.
- Ensure strict **configuration validation** via `.env` at build initialization.

## Non‑Goals

- Server-side data fetching or hosting.
- Multi-file deployments.
- Online/CDN dependencies.

## Constraints

- All code (HTML/CSS/JS) is inlined in the single output file.
- Output is **single-line, minified `index.html`** suitable for distribution.
- Tool versions are locked (Tailwind, SheetJS, Vite, etc.).
- Scheduled refresh updates data in-place using file modification time (mtime) checks; manual refresh triggers a full page reload.

## Primary User Flow

1. The user opens the `index.html` file via `file://` from local disk or USB.
2. Excel file is loaded from the configured path (often a network share).
3. Data is parsed, normalized, and validated.
4. UI renders a RTL Persian table with latest row emphasis.
5. Automatic refresh runs at the configured interval.

If the configured path is unavailable or the browser blocks access, the user can manually select the Excel file via a file picker fallback. Access control is assumed to be handled by OS login and share permissions.

For technical details, see [Architecture](./architecture.md) and [Data Pipeline](./data-handling.md).
