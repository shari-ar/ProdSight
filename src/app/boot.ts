import { renderShell } from '../ui/render';
import { appConfig } from '../config/runtime';
import { loadExcelData } from '../data/excelReader';
import { logger } from '../utils/logger';

/**
 * Initializes document metadata and renders the minimal UI shell.
 */
export const boot = (): void => {
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  document.title = appConfig.pageTitle;
  renderShell();

  logger.info('Starting Excel load.', { filePath: appConfig.excelFilePath });

  void loadExcelData(appConfig.excelFilePath)
    .then((data) => {
      logger.info('Excel data loaded successfully.', {
        headers: data.headers,
        rows: data.rows.length,
      });
    })
    .catch((error) => {
      logger.error('Failed to load Excel data.', {
        error,
      });
    });
};
