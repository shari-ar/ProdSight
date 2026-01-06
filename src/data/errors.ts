export class ExcelDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExcelDataError';
  }
}
