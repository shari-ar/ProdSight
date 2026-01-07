import { defineConfig } from 'vitest/config';
import type { AppConfig } from './src/config/types';

const testAppConfig: AppConfig = {
  pageTitle: 'ProdSight Tests',
  companyLogoSvg: '',
  excelFilePath: '',
  rowsPerPage: 1,
  autoRefreshIntervalMs: 0,
};

export default defineConfig({
  define: {
    __APP_CONFIG__: JSON.stringify(testAppConfig),
  },
  test: {
    clearMocks: true,
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    restoreMocks: true,
  },
  coverage: {
    all: true,
    include: ['src/**/*.ts'],
    exclude: ['src/tests/**', 'scripts/**', '**/*.d.ts'],
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    reportsDirectory: './coverage',
  },
});
