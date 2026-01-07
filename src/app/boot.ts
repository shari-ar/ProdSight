import { renderShell } from '../ui/render';
import { appConfig } from '../config/runtime';
import { logger } from '../utils/logger';
import { renderExcelLoadingState } from '../ui/excelTable';
import { initializeRefresh, refreshNow } from './refresh';

/**
 * Initializes document metadata and renders the minimal UI shell.
 */
export const boot = (): void => {
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  document.title = appConfig.pageTitle;
  renderShell();
  renderExcelLoadingState();
  setupExcelBrowse();
  setupManualRefresh();

  logger.info('Starting Excel load.', { filePath: appConfig.excelFilePath });

  refreshNow();
  initializeRefresh();
};

const setupExcelBrowse = (): void => {
  const browseButton = document.getElementById('excel-browse');
  const fileInput = document.getElementById('excel-file-input');

  if (!(browseButton instanceof HTMLButtonElement) || !(fileInput instanceof HTMLInputElement)) {
    return;
  }

  browseButton.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const [file] = fileInput.files ?? [];
    if (!file) {
      return;
    }

    renderExcelLoadingState();
    refreshNow(file);
    initializeRefresh(file);
    fileInput.value = '';
  });
};

const setupManualRefresh = (): void => {
  const refreshButton = document.getElementById('excel-refresh');
  if (!(refreshButton instanceof HTMLButtonElement)) {
    return;
  }
  refreshButton.addEventListener('click', () => {
    refreshNow();
  });
};
