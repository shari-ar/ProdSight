import { renderShell } from '../ui/render';
import { appConfig } from '../config/runtime';
import { loadExcelDataset } from '../data/excelReader';

const loadInitialDataset = (): void => {
  void loadExcelDataset(appConfig.excelFilePath)
    .then((dataset) => {
      console.info('Excel dataset loaded', dataset);
    })
    .catch((error) => {
      console.error('Failed to load Excel dataset', error);
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
