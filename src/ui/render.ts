import { layout } from './layout';

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

export const renderShell = (): void => {
  const root = ensureRoot();
  root.innerHTML = layout();
};
