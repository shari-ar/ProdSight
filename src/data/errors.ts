/** Represents recoverable Excel load/parse failures surfaced to the UI. */
export class ExcelDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExcelDataError';
  }
}
