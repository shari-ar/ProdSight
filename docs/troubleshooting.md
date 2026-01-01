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

## Date Parsing Errors

**Symptoms**
- Error state shown despite valid Excel path

**Checks**
- Inspect the Date column for empty cells
- Ensure consistent formats (`YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`)
- Remove stray invisible characters or mixed separators

## Manual Refresh Not Updating

**Symptoms**
- No page reload

**Checks**
- Ensure the environment allows page reloads

For deeper details, refer to the [Architecture](./architecture.md) and [UI & Localization](./ui-and-i18n.md) pages.
