import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { envSchema } from './schema';

export type AppConfig = {
  pageTitle: string;
  companyLogoBase64: string;
  excelFilePath: string;
  rowsPerPage: number;
  autoRefreshIntervalMs: number;
};

const formatZodError = (error: Error): string => {
  if ('issues' in error) {
    const issues = (error as { issues: Array<{ path: string[]; message: string }> }).issues;
    return issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
  }
  return error.message;
};

export const loadConfig = (): AppConfig => {
  const envPath = path.resolve(process.cwd(), '.env');

  if (!fs.existsSync(envPath)) {
    throw new Error('Missing .env file. Build requires all five configuration values.');
  }

  const rawEnv = fs.readFileSync(envPath, { encoding: 'utf8' });
  const parsedEnv = dotenv.parse(rawEnv);
  const result = envSchema.safeParse(parsedEnv);

  if (!result.success) {
    const message = formatZodError(result.error);
    throw new Error(`Invalid .env configuration:\n${message}`);
  }

  return {
    pageTitle: result.data.PAGE_TITLE,
    companyLogoBase64: result.data.COMPANY_LOGO_BASE64,
    excelFilePath: result.data.EXCEL_FILE_PATH,
    rowsPerPage: result.data.ROWS_PER_PAGE,
    autoRefreshIntervalMs: result.data.AUTO_REFRESH_INTERVAL_MS,
  };
};
