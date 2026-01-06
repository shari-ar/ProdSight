# UI & Localization

The UI is designed for Persian (Farsi) users with an elegant, corporate look and RTL layout.

## Language & Direction

- **Language:** Persian (پارسی)
- **Layout direction:** `dir="rtl"`
- **Dates:** Jalali (Shamsi) format, **date-only** (no time)
- **Numbers:** Persian locale formatting (`fa-IR`) with support for English/Persian/Arabic digits

## Page Header

- Company logo from `COMPANY_LOGO_ASSET_PATH` (static SVG asset)
- Title from `PAGE_TITLE`
- Formal typography and spacing for readability

## Status Line

- Shows last refresh time in Jalali format
- Includes a **manual refresh button** that is **disabled while a read is in progress**
- Auto refresh operates at `AUTO_REFRESH_INTERVAL_MS` and re-reads only when the source file mtime changes
- Provides a **manual “select file” fallback** when the configured path is unavailable

## Table Behavior

- Responsive RTL table suitable for standard laptop resolution
- Latest row is emphasized with highlight, thick border, and badge `واپَسین`
- Unparseable or missing values show a Persian placeholder (e.g., `—`)

## Error State

On critical failures (date parsing or file access):

- Render a clear Persian error card
- Hide the data table completely
- If an automatic refresh fails (e.g., network share temporarily unavailable), show the error once and keep retrying silently until recovery

See [Data Pipeline](./data-handling.md) for data rules and [Configuration](./configuration.md) for required values.
