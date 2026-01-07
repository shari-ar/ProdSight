import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { ZodError } from 'zod';
import { envSchema } from './schema';
import { AppError } from '../data/errors';
import type { AppConfig } from './types';

// Source filename used for build-time configuration.
const ENV_FILENAME = '.env';
const REQUIRED_ENV_KEYS = [
  'PAGE_TITLE',
  'COMPANY_LOGO_ASSET_PATH',
  'EXCEL_FILE_PATH',
  'ROWS_PER_PAGE',
  'AUTO_REFRESH_INTERVAL_MS',
] as const;

// Normalize Zod validation issues into a readable multiline string.
const formatZodError = (error: ZodError): string =>
  error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');

/**
 * Loads and validates the build-time .env file, then maps it to the runtime config shape.
 */
export const loadConfig = (): AppConfig => {
  const envPath = path.resolve(process.cwd(), ENV_FILENAME);

  if (!fs.existsSync(envPath)) {
    throw new AppError({
      code: 'CONFIG_MISSING_ENV',
      message: `فایل ${ENV_FILENAME} یافت نشد. پیکربندی شامل هر پنج مقدار الزامی است.`,
    });
  }

  const rawEnv = fs.readFileSync(envPath, { encoding: 'utf8' });
  const parsedEnv = dotenv.parse(rawEnv);
  const parsedKeys = Object.keys(parsedEnv);
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !parsedKeys.includes(key));
  const extraKeys = parsedKeys.filter((key) => !REQUIRED_ENV_KEYS.includes(key as (typeof REQUIRED_ENV_KEYS)[number]));

  if (missingKeys.length > 0 || extraKeys.length > 0) {
    const missingMessage =
      missingKeys.length > 0 ? `کلیدهای الزامی موجود نیستند: ${missingKeys.join(', ')}.` : '';
    const extraMessage =
      extraKeys.length > 0 ? `کلیدهای اضافی مجاز نیستند: ${extraKeys.join(', ')}.` : '';
    const message = [missingMessage, extraMessage].filter(Boolean).join('\n');
    throw new AppError({
      code: 'CONFIG_INVALID_KEYS',
      message: `پیکربندی ${ENV_FILENAME} نامعتبر است:\n${message}`,
    });
  }
  const result = envSchema.safeParse(parsedEnv);

  if (!result.success) {
    const message = formatZodError(result.error);
    throw new AppError({
      code: 'CONFIG_INVALID_SCHEMA',
      message: `پیکربندی ${ENV_FILENAME} نامعتبر است:\n${message}`,
    });
  }

  const logoAssetPath = path.resolve(process.cwd(), result.data.COMPANY_LOGO_ASSET_PATH);
  if (!fs.existsSync(logoAssetPath)) {
    throw new AppError({
      code: 'CONFIG_LOGO_MISSING',
      message: `فایل لوگوی شرکت در مسیر ${logoAssetPath} یافت نشد.`,
    });
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
