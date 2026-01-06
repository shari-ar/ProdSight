import { renderShell } from '../ui/render';
import { appConfig } from '../config/runtime';
import { loadExcelData } from '../data/excelReader';
import { logger } from '../utils/logger';
import { renderExcelErrorState, renderExcelLoadingState, renderExcelTable } from '../ui/excelTable';

/**
 * Initializes document metadata and renders the minimal UI shell.
 */
export const boot = (): void => {
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  document.title = appConfig.pageTitle;
  renderShell();
  renderExcelLoadingState();

  logger.info('Starting Excel load.', { filePath: appConfig.excelFilePath });

  void loadExcelData(appConfig.excelFilePath)
    .then((data) => {
      logger.info('Excel data loaded successfully.', {
        headers: data.headers,
        rows: data.rows.length,
      });
      renderExcelTable(data);
    })
    .catch((error) => {
      logger.error('Failed to load Excel data.', {
        error,
      });
      const message = error instanceof Error ? error.message : 'بارگذاری فایل اکسل ناموفق بود.';
      renderExcelErrorState(message);
    });
};
