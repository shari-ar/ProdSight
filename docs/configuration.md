# Configuration (.env)

All runtime and UI configuration is read from a `.env` file and **validated before initialization**. The application will not start unless all required variables are present and non‑empty.

## Required Variables

| Variable | Type | Description |
|---|---|---|
| `PAGE_TITLE` | string | Visible page title in the UI (Persian). |
| `COMPANY_LOGO_BASE64` | string | Base64‑encoded image string for the logo. |
| `EXCEL_FILE_PATH` | string | Absolute or relative path to the Excel file. |
| `ROWS_PER_PAGE` | integer | Number of rows displayed in the table. |
| `AUTO_REFRESH_INTERVAL_MS` | integer | Auto refresh interval in milliseconds. |

## Validation Rules

- **All variables must exist and be non-empty**.
- `ROWS_PER_PAGE` and `AUTO_REFRESH_INTERVAL_MS` must be valid integers.
- Failure to validate results in a **Persian error state**, and the app halts.

## Example `.env`

```env
PAGE_TITLE=برنامه تولید کارخانه
COMPANY_LOGO_BASE64=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
EXCEL_FILE_PATH=./data/production.xlsx
ROWS_PER_PAGE=20
AUTO_REFRESH_INTERVAL_MS=30000
```

## Security Notes

- The `.env` file is intended for **local build-time configuration**.
- The generated `index.html` includes the resolved values, so treat it as **production output**.

For build configuration details, see [Build & Packaging](./build-and-run.md).
