# Build & Packaging

This project produces **one file only**: `index.html`. The output must run **fully offline** with all dependencies inlined and **minified into a single line**.

## Toolchain (Locked Versions)

These versions are fixed and **must not be modified**:

- Dev Container: node:25
- Node: 25.x
- Vite: 7.3.x
- Vitest: 4.0.16
- Tailwind CSS: 4.1.x
- SheetJS (xlsx): 0.18.x
- jalaali-js: 1.2.8
- Zod: 4.3.x
- esbuild: 0.27.x
- dotenv: 17.2.x
- typescrip 5.9.x
- tsx 4.21.x
- types/node 25.0.x

## Build Flow

1. **Load `.env`** with `dotenv`.
2. **Validate configuration** using Zod in `src/config/schema.ts` and fail if **any extra variables** beyond the required five are present.
3. **Bundle with Vite/esbuild**.
4. **Inline assets** via `scripts/pack-single-html.ts`.
5. **Emit `index.html`** as a single, self‑contained file.

## Runtime Behavior

- `index.html` runs from disk (`file://`) without a server.
- The Excel file is read from the configured path (local or network share).
- A refresh timer updates data at `AUTO_REFRESH_INTERVAL_MS`, using file modification time (mtime) to detect changes and re-read only when needed.

## Deployment

- Distribute only the final `index.html`.
- Ensure the Excel file exists at `EXCEL_FILE_PATH` on the target machine.
- For CI/CD, use GitHub Actions with encrypted secrets (not plaintext `.env`).

For configuration details, see [Configuration](./configuration.md).
