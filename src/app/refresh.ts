import { appConfig } from '../config/runtime';
import { loadExcelDataWithSignature, loadExcelFileWithSignature } from '../data/excelReader';
import {
  renderExcelErrorState,
  renderExcelLoadingState,
  renderExcelTable,
  setRefreshButtonDisabled,
} from '../ui/excelTable';
import { logger } from '../utils/logger';

/**
 * Tracks whether refreshes should read from the configured path or a user-selected file.
 */
type RefreshSource =
  | { kind: 'path' }
  | { kind: 'file'; file: File };

/**
 * Captures the last-seen signature for change detection and refresh comparison.
 */
type RefreshSignature = {
  value: string;
  source: RefreshSource;
};

// Last observed file signature used to skip redundant reloads.
let lastSignature: RefreshSignature | null = null;
// Last error message to suppress duplicate auto-refresh errors.
let lastErrorMessage: string | null = null;
// Handle for the auto-refresh timer, if enabled.
let refreshTimer: number | null = null;
// Prevent overlapping refresh operations.
let refreshInProgress = false;

/**
 * Serialize refresh operations so the UI and data stay consistent.
 */
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

/**
 * Store the latest signature for subsequent change detection.
 */
const updateSignature = (signature: RefreshSignature): void => {
  lastSignature = signature;
  logger.debug('Excel refresh signature updated.', {
    source: signature.source.kind,
    signature: signature.value,
  });
};

/**
 * Compare signatures, including source identity for uploaded files.
 */
const isSignatureMatch = (signature: RefreshSignature): boolean => {
  if (!lastSignature) {
    return false;
  }
  const isSameSource =
    signature.source.kind === lastSignature.source.kind &&
    (signature.source.kind !== 'file' || signature.source.file === lastSignature.source.file);
  return isSameSource && signature.value === lastSignature.value;
};

/**
 * Suppress repeated error states during background auto-refresh retries.
 */
const shouldShowError = (message: string): boolean => {
  if (lastErrorMessage === message) {
    return false;
  }
  lastErrorMessage = message;
  return true;
};

/**
 * Reset error tracking once a refresh succeeds.
 */
const clearErrorState = (): void => {
  lastErrorMessage = null;
};

/**
 * Apply user-facing error state and track error suppression state.
 */
const handleRefreshError = (error: unknown, forceRender = false): void => {
  const message = error instanceof Error ? error.message : 'بارگذاری فایل اکسل ناموفق بود.';
  logger.error('Excel refresh failed.', { error });
  setRefreshButtonDisabled(false);
  if (forceRender || shouldShowError(message)) {
    renderExcelErrorState(message);
  }
};

/**
 * Refresh from the configured Excel path with optional forced reload.
 */
const refreshFromConfiguredPath = async (force = false): Promise<void> => {
  logger.debug('Refreshing Excel from configured path.', { force });
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

/**
 * Refresh from a user-selected file with optional forced reload.
 */
const refreshFromFile = async (file: File, force = false): Promise<void> => {
  logger.debug('Refreshing Excel from user-selected file.', {
    force,
    fileName: file.name,
    fileSize: file.size,
  });
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

/**
 * Start or restart the auto-refresh timer.
 */
export const initializeRefresh = (): void => {
  if (refreshTimer !== null) {
    window.clearInterval(refreshTimer);
  }
  logger.info('Initializing Excel auto-refresh timer.', {
    intervalMs: appConfig.autoRefreshIntervalMs,
  });
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

/**
 * Trigger an immediate refresh, optionally overriding the active file source.
 */
export const refreshNow = (fileOverride?: File): void => {
  if (refreshInProgress) {
    logger.debug('Excel refresh skipped (refresh already in progress).');
    return;
  }
  renderExcelLoadingState();
  void runWithExclusiveLock(async () => {
    if (fileOverride) {
      logger.info('Manual Excel refresh requested with file override.', {
        fileName: fileOverride.name,
        fileSize: fileOverride.size,
      });
      await refreshFromFile(fileOverride, true);
      return;
    }
    if (lastSignature?.source.kind === 'file') {
      logger.info('Manual Excel refresh requested for active file source.', {
        fileName: lastSignature.source.file.name,
        fileSize: lastSignature.source.file.size,
      });
      await refreshFromFile(lastSignature.source.file, true);
      return;
    }
    logger.info('Manual Excel refresh requested for configured path.');
    await refreshFromConfiguredPath(true);
  }).catch((error) => handleRefreshError(error, true));
};

/**
 * Mark a user-selected file as the active refresh source.
 */
export const setActiveExcelFile = (file: File): void => {
  logger.info('Excel file selected for refresh.', {
    fileName: file.name,
    fileSize: file.size,
  });
  updateSignature({ value: `${file.lastModified}-${file.size}`, source: { kind: 'file', file } });
};
