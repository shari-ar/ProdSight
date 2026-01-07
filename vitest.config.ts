/**
 * Vitest configuration aligned with the project's Node-based test environment.
 */
import { defineConfig } from 'vitest/config';
import type { AppConfig } from './src/config/types';

// Deterministic config injected during tests to avoid loading .env at runtime.
const testAppConfig: AppConfig = {
  pageTitle: 'ProdSight Tests',
  companyLogoSvg: '',
  excelFilePath: '',
  rowsPerPage: 1,
  autoRefreshIntervalMs: 0,
};

export default defineConfig({
  // Define compile-time globals used by runtime modules under test.
  define: {
    __APP_CONFIG__: JSON.stringify(testAppConfig),
  },
  test: {
    // Keep tests isolated and deterministic across runs.
    clearMocks: true,
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    reporters: ['default', 'junit'],
    restoreMocks: true,
    setupFiles: ['src/tests/setup.ts'],
    outputFile: {
      junit: 'reports/vitest-junit.xml',
    },
  },
  coverage: {
    // Collect coverage for source files while excluding tests and generated artifacts.
    all: true,
    include: ['src/**/*.ts'],
    exclude: ['src/tests/**', 'scripts/**', '**/*.d.ts'],
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    reportsDirectory: './coverage',
  },
});
