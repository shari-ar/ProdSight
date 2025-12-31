# Testing & Quality

Testing focuses on data correctness, parsing robustness, and stability of the offline build.

## Unit Tests

Location: `tests/`

- `date.test.ts` — date parsing and Jalali conversion
- `excel.test.ts` — Excel reading and header detection
- `sanitize.test.ts` — text and numeric normalization

## Suggested Validation Checklist

- **Config validation** fails when any `.env` variable is missing.
- **Excel file access** errors are surfaced in Persian.
- **Date parsing** accepts known formats and rejects invalid rows.
- **Pagination** respects `ROWS_PER_PAGE`.
- **RTL layout** and Persian formatting match expectations.

## Build Verification

- Output is a **single `index.html`** file.
- Page runs with **no external dependencies**.
- Excel file is read from `EXCEL_FILE_PATH`.

See [Build & Packaging](./build-and-run.md) for pipeline details.
