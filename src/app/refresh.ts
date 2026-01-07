import { appConfig } from '../config/runtime';
import { loadExcelDataWithSignature, loadExcelFileWithSignature } from '../data/excelReader';
import {
  renderExcelErrorState,
  renderExcelLoadingState,
  renderExcelTable,
  setRefreshButtonDisabled,
} from '../ui/excelTable';
import { logger } from '../utils/logger';

type RefreshSource =
  | { kind: 'path' }
  | { kind: 'file'; file: File };

type RefreshSignature = {
  value: string;
  source: RefreshSource;
};

let lastSignature: RefreshSignature | null = null;
let lastErrorMessage: string | null = null;
let refreshTimer: number | null = null;
let refreshInProgress = false;

const runWithExclusiveLock = async (task: () => Promise<void>): Promise<void> => {
  if (refreshInProgress) {
    return;
  }
  refreshInProgress = true;
  try {
    await task();
  } finally {
    refreshInProgress = false;
  }
};

const updateSignature = (signature: RefreshSignature): void => {
  lastSignature = signature;
};

const isSignatureMatch = (signature: RefreshSignature): boolean => {
  if (!lastSignature) {
    return false;
  }
  const isSameSource =
    signature.source.kind === lastSignature.source.kind &&
    (signature.source.kind !== 'file' || signature.source.file === lastSignature.source.file);
  return isSameSource && signature.value === lastSignature.value;
};

const shouldShowError = (message: string): boolean => {
  if (lastErrorMessage === message) {
    return false;
  }
  lastErrorMessage = message;
  return true;
};

const clearErrorState = (): void => {
  lastErrorMessage = null;
};

const handleRefreshError = (error: unknown, forceRender = false): void => {
  const message = error instanceof Error ? error.message : 'بارگذاری فایل اکسل ناموفق بود.';
  logger.error('Excel refresh failed.', { error });
  setRefreshButtonDisabled(false);
  if (forceRender || shouldShowError(message)) {
    renderExcelErrorState(message);
  }
};

const refreshFromConfiguredPath = async (force = false): Promise<void> => {
  const { data, signature } = await loadExcelDataWithSignature(appConfig.excelFilePath);
  if (!force && isSignatureMatch({ value: signature, source: { kind: 'path' } })) {
    logger.info('Excel refresh skipped (no change detected).');
    setRefreshButtonDisabled(false);
    return;
  }
  updateSignature({ value: signature, source: { kind: 'path' } });
  clearErrorState();
  renderExcelTable(data);
};

const refreshFromFile = async (file: File, force = false): Promise<void> => {
  const { data, signature } = await loadExcelFileWithSignature(file);
  if (!force && isSignatureMatch({ value: signature, source: { kind: 'file', file } })) {
    logger.info('Excel refresh skipped (no change detected for file).');
    setRefreshButtonDisabled(false);
    return;
  }
  updateSignature({ value: signature, source: { kind: 'file', file } });
  clearErrorState();
  renderExcelTable(data);
};

export const initializeRefresh = (): void => {
  if (refreshTimer !== null) {
    window.clearInterval(refreshTimer);
  }
  refreshTimer = window.setInterval(() => {
    void runWithExclusiveLock(async () => {
      setRefreshButtonDisabled(true);
      if (lastSignature?.source.kind === 'file') {
        await refreshFromFile(lastSignature.source.file);
      } else {
        await refreshFromConfiguredPath();
      }
    }).catch(handleRefreshError);
  }, appConfig.autoRefreshIntervalMs);
};

export const refreshNow = (fileOverride?: File): void => {
  if (refreshInProgress) {
    return;
  }
  renderExcelLoadingState();
  void runWithExclusiveLock(async () => {
    if (fileOverride) {
      await refreshFromFile(fileOverride, true);
      return;
    }
    if (lastSignature?.source.kind === 'file') {
      await refreshFromFile(lastSignature.source.file, true);
      return;
    }
    await refreshFromConfiguredPath(true);
  }).catch((error) => handleRefreshError(error, true));
};

export const setActiveExcelFile = (file: File): void => {
  updateSignature({ value: `${file.lastModified}-${file.size}`, source: { kind: 'file', file } });
};
