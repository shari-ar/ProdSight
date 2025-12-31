# UI & Localization

The UI is designed for Persian (Farsi) users with an elegant, corporate look and RTL layout.

## Language & Direction

- **Language:** Persian (Farsi)
- **Layout direction:** `dir="rtl"`
- **Dates:** Jalali (Shamsi) format
- **Numbers:** Persian locale formatting (`fa-IR`)

## Page Header

- Company logo from `COMPANY_LOGO_BASE64`
- Title from `PAGE_TITLE`
- Formal typography and spacing for readability

## Status Line

- Shows last refresh time in Jalali format
- Includes a **manual refresh button**
- Auto refresh operates at `AUTO_REFRESH_INTERVAL_MS`

## Table Behavior

- Responsive RTL table suitable for standard laptop resolution
- Latest row is emphasized with highlight, thick border, and badge `آخرین`
- Unparseable or missing values show a Persian placeholder (e.g., `—`)

## Error State

On critical failures (configuration, date parsing, or file access):

- Render a clear Persian error card
- Hide the data table completely

See [Data Pipeline](./data-handling.md) for data rules and [Configuration](./configuration.md) for required values.
