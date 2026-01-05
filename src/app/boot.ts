import { renderShell } from '../ui/render';
import { appConfig } from '../config/runtime';
import { loadExcelDataset } from '../data/excelReader';

const LOG_PREFIX = '[ProdSight:Boot]';

const loadInitialDataset = (): void => {
  console.info(`${LOG_PREFIX} Starting initial Excel load.`);
  void loadExcelDataset(appConfig.excelFilePath)
    .then((dataset) => {
      console.info(`${LOG_PREFIX} Excel dataset loaded (${dataset.rows.length} rows).`);
    })
    .catch((error) => {
      console.error(`${LOG_PREFIX} Failed to load Excel dataset.`, error);
    });
};

/**
 * Initializes document metadata and renders the minimal UI shell.
 */
export const boot = (): void => {
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  document.title = appConfig.pageTitle;
  renderShell();
  loadInitialDataset();
};
