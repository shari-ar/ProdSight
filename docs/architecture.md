# Architecture

This project is structured for a **single-file output** while keeping internal modules clean and future‑proof. The architecture divides responsibilities across configuration, data, UI, and app lifecycle layers.

## Directory Layout (Source)

```
project/
  src/
    app/
      boot.ts            # application bootstrap & lifecycle
      refresh.ts         # auto/manual refresh logic
      state.ts           # in-memory state

    config/
      env.ts             # .env loading & validation (Zod)
      schema.ts          # config schema definitions

    data/
      excelReader.ts     # Excel file access & sheet loading
      model.ts           # normalized row model
      transform.ts       # sorting, slicing, latest-row logic
      parsers/
        parseDate.ts     # robust Date parsing
        parseNumber.ts   # numeric normalization
        cleanText.ts     # whitespace & artifact cleanup

    ui/
      render.ts          # render orchestration
      layout.ts          # RTL layout & page shell
      styles/
        tailwind.css     # Tailwind entry point
      components/
        Header.ts        # logo + title
        StatusLine.ts    # refresh status (Jalali) + manual actions
        DataTable.ts     # history + latest highlight
        ErrorCard.ts     # error state UI

    i18n/
      fa.ts              # Persian UI strings
      formatters.ts      # Jalali date & number formatters

    utils/
      logger.ts          # lightweight logging
      guards.ts          # safety helpers

  scripts/
    pack-single-html.ts  # inline & bundle into one HTML

  tests/
    date.test.ts         # date parsing + Jalali conversion
    excel.test.ts        # Excel read + header detection
    sanitize.test.ts     # text + numeric normalization
```

## Runtime Flow

1. **Bootstrap (`app/boot.ts`)**
   - Initializes state and kicks off data load.
2. **Excel Read (`data/excelReader.ts`)**
   - Loads the first worksheet.
   - Detects columns from header row (left to right, stops at empty).
3. **Parsing & Normalization (`data/parsers/*`)**
   - Cleans text and normalizes numeric fields.
   - Parses dates with fallback formats and Excel serial support.
4. **Transform (`data/transform.ts`)**
   - Sorts by Date descending.
   - Slices based on `ROWS_PER_PAGE`.
   - Identifies the latest row for highlight.
5. **Render (`ui/render.ts`)**
   - Renders header, status line, table, or error state.
6. **Refresh (`app/refresh.ts`)**
   - Auto-refresh interval + manual refresh button + manual file picker fallback.
   - Auto-refresh updates data only when the Excel file mtime changes; manual refresh triggers a full page reload.
   - On refresh failure, display a visible error once while retrying silently until recovery.

## Build Output

- A **single static `index.html`** is produced by bundling and inlining scripts, styles, and libraries.
- **All runtime dependencies are embedded** to guarantee offline operation.

See [Build & Packaging](./build-and-run.md) for details.
