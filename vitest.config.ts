import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    __APP_CONFIG__: JSON.stringify({}),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    restoreMocks: true,
  },
});
