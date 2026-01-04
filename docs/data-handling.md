# Data Pipeline

This document describes how Excel data is read, validated, normalized, and presented.

## Excel Input Rules

- The Excel file contains **exactly one worksheet**.
- **Header row** defines column names, read left-to-right.
- **Column detection stops** at the first empty header cell.
- Every row **must contain a Date value**.
- The Date header is detected case-insensitively and in Persian/Arabic: `Date`, `date`, `تاریخ`, etc. (first header named Date/تاریخ).

## Row Normalization

1. **Text cleanup**
   - Trim whitespace
   - Remove invisible characters
2. **Number parsing**
   - Remove thousand separators and spacing artifacts
   - Accept English, Persian, and Arabic numerals
3. **Date parsing** (authoritative field)
   - Accepts multiple string formats:
     - `YYYY-MM-DD`
     - `DD/MM/YYYY`
     - `MM/DD/YYYY`
   - Accepts English, Persian, and Arabic digits and separators
   - Handles Excel serial date values
   - Normalizes to **date-only** (no time component)
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
