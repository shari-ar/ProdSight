/**
 * Canonical configuration shape injected at build-time and consumed at runtime.
 */
export type AppConfig = {
  pageTitle: string;
  companyLogoBase64: string;
  excelFilePath: string;
  rowsPerPage: number;
  autoRefreshIntervalMs: number;
};
