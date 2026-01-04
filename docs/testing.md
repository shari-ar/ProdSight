# Testing & Quality

Testing focuses on data correctness, parsing robustness, and stability of the offline build.

## Unit Tests

Location: `tests/`

- `date.test.ts` — date parsing and Jalali conversion
- `excel.test.ts` — Excel reading and header detection
- `sanitize.test.ts` — text and numeric normalization

## Suggested Validation Checklist

- **Config validation** fails when any `.env` variable is missing.
- **Config validation** fails when **extra `.env` variables** are present.
- **Date parsing** accepts known formats and rejects invalid rows.
- **Pagination** respects `ROWS_PER_PAGE`.
- **RTL layout** and Persian formatting match expectations.

## Build Verification

- Output is a **single `index.html`** file.
- Output is **single-line minified** HTML.
- Page runs with **no external dependencies**.
- Excel file is read from `EXCEL_FILE_PATH`.
- CI runs in GitHub Actions using Node 25.x and encrypted secrets.

See [Build & Packaging](./build-and-run.md) for pipeline details.
