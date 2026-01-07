type AppErrorOptions = {
  code: string;
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
    super({ code: 'EXCEL_DATA_ERROR', message, cause });
    this.name = 'ExcelDataError';
  }
}
