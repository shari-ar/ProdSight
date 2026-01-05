export type AppConfig = {
  pageTitle: string;
  companyLogoBase64: string;
  excelFilePath: string;
  rowsPerPage: number;
  autoRefreshIntervalMs: number;
};

declare const __APP_CONFIG__: AppConfig;

export const appConfig = __APP_CONFIG__;
