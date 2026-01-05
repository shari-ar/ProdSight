import { z } from 'zod';

/**
 * Zod schema for validating the build-time .env configuration.
 * Strict mode ensures no extra keys are permitted.
 */
export const envSchema = z
  .object({
    PAGE_TITLE: z.string().min(1, 'PAGE_TITLE is required.'),
    COMPANY_LOGO_BASE64: z.string().min(1, 'COMPANY_LOGO_BASE64 is required.'),
    EXCEL_FILE_PATH: z.string().min(1, 'EXCEL_FILE_PATH is required.'),
    ROWS_PER_PAGE: z.coerce
      .number()
      .int('ROWS_PER_PAGE must be an integer.')
      .positive('ROWS_PER_PAGE must be positive.'),
    AUTO_REFRESH_INTERVAL_MS: z.coerce
      .number()
      .int('AUTO_REFRESH_INTERVAL_MS must be an integer.')
      .positive('AUTO_REFRESH_INTERVAL_MS must be positive.'),
  })
  .strict();

export type EnvConfig = z.infer<typeof envSchema>;
