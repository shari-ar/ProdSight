import { defineConfig } from 'vitest/config';
import { loadConfig } from './src/config/env';

export default defineConfig(({ mode }) => {
  const appConfig = mode === 'test' ? null : loadConfig();

  return {
    base: './',
    define: {
      __APP_CONFIG__: JSON.stringify(appConfig ?? {}),
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: 'esbuild',
      esbuild: {
        legalComments: 'none',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
      restoreMocks: true,
    },
  };
});
