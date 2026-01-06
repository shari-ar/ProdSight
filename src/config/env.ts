import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { ZodError } from 'zod';
import { envSchema } from './schema';
import type { AppConfig } from './types';

// Source filename used for build-time configuration.
const ENV_FILENAME = '.env';

// Normalize Zod validation issues into a readable multiline string.
const formatZodError = (error: ZodError): string =>
  error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');

/**
 * Loads and validates the build-time .env file, then maps it to the runtime config shape.
 */
export const loadConfig = (): AppConfig => {
  const envPath = path.resolve(process.cwd(), ENV_FILENAME);

  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing ${ENV_FILENAME} file. Build requires all five configuration values.`);
  }

  const rawEnv = fs.readFileSync(envPath, { encoding: 'utf8' });
  const parsedEnv = dotenv.parse(rawEnv);
  const result = envSchema.safeParse(parsedEnv);

  if (!result.success) {
    const message = formatZodError(result.error);
    throw new Error(`Invalid ${ENV_FILENAME} configuration:\n${message}`);
  }

  const logoAssetPath = path.resolve(process.cwd(), result.data.COMPANY_LOGO_ASSET_PATH);
  if (!fs.existsSync(logoAssetPath)) {
    throw new Error(`Missing company logo asset at ${logoAssetPath}.`);
  }

  const companyLogoSvg = fs.readFileSync(logoAssetPath, { encoding: 'utf8' });

  return {
    pageTitle: result.data.PAGE_TITLE,
    companyLogoSvg,
    excelFilePath: result.data.EXCEL_FILE_PATH,
    rowsPerPage: result.data.ROWS_PER_PAGE,
    autoRefreshIntervalMs: result.data.AUTO_REFRESH_INTERVAL_MS,
  };
};
