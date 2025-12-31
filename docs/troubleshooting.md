# Operations & Troubleshooting

This guide lists common issues and recommended resolutions.

## Excel File Not Found

**Symptoms**
- Persian error state displayed
- No table rendered

**Checks**
- Verify `EXCEL_FILE_PATH` is correct
- Confirm file exists at the path on the target machine
- Confirm file is not locked by another process

## Invalid or Missing `.env`

**Symptoms**
- Persian error state displayed at startup
- No further initialization

**Checks**
- Ensure all required variables are present and non‑empty
- Confirm `ROWS_PER_PAGE` and `AUTO_REFRESH_INTERVAL_MS` are valid integers

## Date Parsing Errors

**Symptoms**
- Error state shown despite valid Excel path

**Checks**
- Inspect the Date column for empty cells
- Ensure consistent formats (`YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`)
- Remove stray invisible characters or mixed separators

## Auto Refresh Not Updating

**Symptoms**
- No periodic reload

**Checks**
- Verify `AUTO_REFRESH_INTERVAL_MS` is set and valid
- Ensure the environment allows page reloads

## UI Appears LTR

**Symptoms**
- Table direction appears left-to-right

**Checks**
- Confirm `dir="rtl"` is set in the layout
- Verify no custom CSS overrides `direction`

For deeper details, refer to the [Architecture](./architecture.md) and [UI & Localization](./ui-and-i18n.md) pages.
