export const ERROR_CODES = {
  ConfigMissingEnv: 'CONFIG_MISSING_ENV',
  ConfigInvalidKeys: 'CONFIG_INVALID_KEYS',
  ConfigInvalidSchema: 'CONFIG_INVALID_SCHEMA',
  ConfigLogoMissing: 'CONFIG_LOGO_MISSING',
  ExcelDataError: 'EXCEL_DATA_ERROR',
  UiMissingExcelElements: 'UI_MISSING_EXCEL_ELEMENTS',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

type AppErrorOptions = {
  code: ErrorCode;
  message: string;
  cause?: unknown;
};

/** Base application error with a stable code for logging/diagnostics. */
export class AppError extends Error {
  code: string;
  cause?: unknown;

  constructor({ code, message, cause }: AppErrorOptions) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }
}

/** Represents recoverable Excel load/parse failures surfaced to the UI. */
export class ExcelDataError extends AppError {
  constructor(message: string, cause?: unknown) {
    super({ code: ERROR_CODES.ExcelDataError, message, cause });
    this.name = 'ExcelDataError';
  }
}
