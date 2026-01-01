# Data Pipeline

This document describes how Excel data is read, validated, normalized, and presented.

## Excel Input Rules

- The Excel file contains **exactly one worksheet**.
- **Header row** defines column names, read left-to-right.
- **Column detection stops** at the first empty header cell.
- Every row **must contain a Date value**.

## Row Normalization

1. **Text cleanup**
   - Trim whitespace
   - Remove invisible characters
2. **Number parsing**
   - Remove thousand separators and spacing artifacts
   - Format using Persian locale where possible
3. **Date parsing** (authoritative field)
   - Accepts multiple string formats:
     - `YYYY-MM-DD`
     - `DD/MM/YYYY`
     - `MM/DD/YYYY`
   - Handles Excel serial date values
   - Any unparseable or empty Date triggers a **global error state**

## Sorting & Pagination

- Rows are sorted by parsed Date **descending**.
- The newest `ROWS_PER_PAGE` rows are shown.
- The latest row is **visually dominant** with:
  - strong background highlight
  - thick border
  - Persian badge `واپَسین`
  - increased font weight

## Error Handling

If any of the following occurs, a Persian error state is shown and the table is hidden:

- Missing or unreadable Excel file
- Any row with an empty or unparseable Date

See [UI & Localization](./ui-and-i18n.md) for display behavior details.
