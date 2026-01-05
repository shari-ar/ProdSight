import type { AppConfig } from './types';

// Compile-time constant injected by Vite.
declare const __APP_CONFIG__: AppConfig;

/**
 * Runtime configuration available to the UI layer.
 */
export const appConfig = __APP_CONFIG__;
