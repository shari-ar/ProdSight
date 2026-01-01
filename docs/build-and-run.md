# Build & Packaging

This project produces **one file only**: `index.html`. The output must run **fully offline** with all dependencies inlined.

## Toolchain (Locked Versions)

These versions are fixed and **must not be modified**:

- Tailwind CSS: 4.1.x
- SheetJS (xlsx): 0.20.x
- jalaali-js: 1.2.8
- Zod: 4.3.x
- Vite: 7.3.x
- esbuild: 0.27.x
- dotenv: 17.2.x
- Vitest: 4.0.x
- Dev Container: latest

## Build Flow

1. **Load `.env`** with `dotenv`.
2. **Validate configuration** using Zod in `src/config/schema.ts`.
3. **Bundle with Vite/esbuild**.
4. **Inline assets** via `scripts/pack-single-html.ts`.
5. **Emit `index.html`** as a single, self‑contained file.

## Runtime Behavior

- `index.html` runs from disk without a server.
- The Excel file is read from the configured path.
- A refresh timer updates data at `AUTO_REFRESH_INTERVAL_MS`.

## Deployment

- Distribute only the final `index.html`.
- Ensure the Excel file exists at `EXCEL_FILE_PATH` on the target machine.

For configuration details, see [Configuration](./configuration.md).
