// Unit tests for environment schema validation.
import { describe, expect, it } from 'vitest';
import { envSchema } from '../../config/schema';

// Validate environment schema parsing and rejection behavior.
describe('envSchema', () => {
  it('accepts a complete configuration', () => {
    const result = envSchema.safeParse({
      PAGE_TITLE: 'ProdSight',
      COMPANY_LOGO_ASSET_PATH: '/assets/logo.svg',
      EXCEL_FILE_PATH: 'C:/data/report.xlsx',
      ROWS_PER_PAGE: '25',
      AUTO_REFRESH_INTERVAL_MS: '30000',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ROWS_PER_PAGE).toBe(25);
      expect(result.data.AUTO_REFRESH_INTERVAL_MS).toBe(30000);
    }
  });

  it('rejects extra keys', () => {
    const result = envSchema.safeParse({
      PAGE_TITLE: 'ProdSight',
      COMPANY_LOGO_ASSET_PATH: '/assets/logo.svg',
      EXCEL_FILE_PATH: 'C:/data/report.xlsx',
      ROWS_PER_PAGE: 25,
      AUTO_REFRESH_INTERVAL_MS: 30000,
      EXTRA: 'nope',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid numeric values', () => {
    const result = envSchema.safeParse({
      PAGE_TITLE: 'ProdSight',
      COMPANY_LOGO_ASSET_PATH: '/assets/logo.svg',
      EXCEL_FILE_PATH: 'C:/data/report.xlsx',
      ROWS_PER_PAGE: '0',
      AUTO_REFRESH_INTERVAL_MS: '-1',
    });

    expect(result.success).toBe(false);
  });
});
