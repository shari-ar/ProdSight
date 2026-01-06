import { renderShell } from '../ui/render';
import { appConfig } from '../config/runtime';
import { loadExcelData } from '../data/excelReader';

/**
 * Initializes document metadata and renders the minimal UI shell.
 */
export const boot = (): void => {
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  document.title = appConfig.pageTitle;
  renderShell();

  void loadExcelData(appConfig.excelFilePath)
    .then((data) => {
      console.info('Excel data loaded successfully.', data);
    })
    .catch((error) => {
      console.error('Failed to load Excel data.', error);
    });
};
