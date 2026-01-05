import { renderShell } from '../ui/render';
import { appConfig } from '../config/runtime';

/**
 * Initializes document metadata and renders the minimal UI shell.
 */
export const boot = (): void => {
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  document.title = appConfig.pageTitle;
  renderShell();
};
