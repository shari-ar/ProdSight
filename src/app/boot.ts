import { renderShell } from '../ui/render';
import { appConfig } from '../config/runtime';

export const boot = (): void => {
  document.documentElement.lang = 'fa';
  document.documentElement.dir = 'rtl';
  document.title = appConfig.pageTitle;
  renderShell();
};
