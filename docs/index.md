# ProdSight Technical Documentation

Welcome to the ProdSight technical documentation. This documentation describes the architecture, configuration, data pipeline, UI behavior, and build process for the **single-file offline HTML** deliverable.

## Contents

- [Overview](./overview.md)
- [Architecture](./architecture.md)
- [Configuration (.env)](./configuration.md)
- [Build & Packaging](./build-and-run.md)
- [Data Pipeline](./data-handling.md)
- [UI & Localization](./ui-and-i18n.md)
- [Testing & Quality](./testing.md)
- [Operations & Troubleshooting](./troubleshooting.md)

## Key Requirements (Quick Reference)

- **Single-file output**: exactly one `index.html` for deployment.
- **Offline operation**: all assets and dependencies are embedded.
- **RTL Persian UI**: `dir="rtl"`, Jalali dates, Persian number formatting.
- **Excel source**: first worksheet only; header-driven column detection.
- **Strict config validation**: exactly five `.env` variables required; no extras allowed.
- **Auto refresh**: interval with mtime detection, retry-on-failure, and manual refresh supported.
- **Local `file://` usage**: index opened from disk/USB with Excel on local or network share.

Start with [Overview](./overview.md) for a concise summary of the system.
