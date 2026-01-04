# Configuration (.env)

All UI configuration is read from a `.env` file and **validated before building**. The application will not build unless all required variables are present and non‑empty, and **no extra variables** beyond the required five are included.

## Required Variables

| Variable | Type | Description |
|---|---|---|
| `PAGE_TITLE` | string | Visible page title in the UI (Persian). |
| `COMPANY_LOGO_BASE64` | string | Base64‑encoded image string for the logo. |
| `EXCEL_FILE_PATH` | string | Absolute or relative path to the Excel file. |
| `ROWS_PER_PAGE` | number | Number of rows displayed in the table. |
| `AUTO_REFRESH_INTERVAL_MS` | bigint | Auto refresh interval in milliseconds. |

## Validation Rules

- **All variables must exist and be non-empty**.
- **No additional keys** are allowed; the build fails on unknown `.env` entries.
- `ROWS_PER_PAGE` and `AUTO_REFRESH_INTERVAL_MS` must be valid integers.

## Example `.env`

```env
PAGE_TITLE=برنامه تولید کارخانه
COMPANY_LOGO_BASE64=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
EXCEL_FILE_PATH=\\\\server\\share\\production.xlsx
ROWS_PER_PAGE=10
AUTO_REFRESH_INTERVAL_MS=1800000
```

## Security Notes

- The `.env` file is intended for **local build-time configuration**.
- The generated `index.html` includes the resolved values, so treat it as **production output**.
- CI should use **encrypted secrets** instead of committing `.env` to source control.

For build configuration details, see [Build & Packaging](./build-and-run.md).
