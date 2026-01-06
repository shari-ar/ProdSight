import { appConfig } from '../config/runtime';
import { layout } from './layout';

// Ensure a stable root container for rendering.
const ensureRoot = (): HTMLElement => {
  const existing = document.getElementById('app');
  if (existing) {
    return existing;
  }
  const root = document.createElement('div');
  root.id = 'app';
  document.body.appendChild(root);
  return root;
};

/**
 * Render the static shell for the minimal Phase 2 UI.
 */
export const renderShell = (): void => {
  const root = ensureRoot();
  root.innerHTML = layout();
  const logo = root.querySelector<HTMLDivElement>('.logo');
  if (logo) {
    logo.innerHTML = appConfig.companyLogoSvg;
  }
};
