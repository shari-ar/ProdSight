import { defineConfig } from 'vite';
import { loadConfig } from './src/config/env';

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
