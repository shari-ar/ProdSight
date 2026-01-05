import { defineConfig } from 'vite';
import { loadConfig } from './src/config/env';

// Load validated configuration at build time for injection.
const appConfig = loadConfig();

export default defineConfig({
  base: './',
  define: {
    __APP_CONFIG__: JSON.stringify(appConfig),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
  },
});
