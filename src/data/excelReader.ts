import * as XLSX from 'xlsx';
import { cleanText } from './parsers/cleanText';
import { parseDate } from './parsers/parseDate';
import { parseNumber } from './parsers/parseNumber';
import type { ExcelDataset, NormalizedCell, NormalizedRow } from './model';

const DATE_HEADER_ALIASES = new Set(['date', 'تاریخ', 'تاريخ']);

const normalizeHeader = (header: string): string => header.trim();

const detectHeaders = (row: unknown[]): string[] => {
  const headers: string[] = [];

  for (const cell of row) {
    const cleaned = cleanText(cell);
    if (!cleaned) {
      break;
    }
    headers.push(normalizeHeader(cleaned));
  }

  if (headers.length === 0) {
    throw new Error('Missing header row in Excel worksheet.');
  }

  return headers;
};

const findDateColumnIndex = (headers: string[]): number => {
  const index = headers.findIndex((header) => DATE_HEADER_ALIASES.has(header.toLowerCase()));
  if (index === -1) {
    throw new Error('Date column not found in Excel worksheet headers.');
  }
  return index;
};

const normalizeCell = (value: unknown): NormalizedCell => {
  if (typeof value === 'number') {
    return value;
  }

  const numericValue = parseNumber(value);
  if (numericValue !== null) {
    return numericValue;
  }

  return cleanText(value);
};

const normalizeRow = (
  row: unknown[],
  headers: string[],
  dateIndex: number,
  sourceRowIndex: number,
): NormalizedRow => {
  const dateValue = parseDate(row[dateIndex]);
  if (!dateValue) {
    throw new Error(`Invalid or missing date value at row ${sourceRowIndex + 1}.`);
  }

  const cells: Record<string, NormalizedCell> = {};
  headers.forEach((header, columnIndex) => {
    cells[header] = normalizeCell(row[columnIndex]);
  });

  return {
    date: dateValue,
    cells,
    sourceRowIndex,
  };
};

const parseWorksheet = (worksheet: XLSX.WorkSheet): ExcelDataset => {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    raw: true,
    blankrows: false,
  });

  if (rows.length === 0) {
    throw new Error('Excel worksheet is empty.');
  }

  const headers = detectHeaders(rows[0] ?? []);
  const dateIndex = findDateColumnIndex(headers);

  const normalizedRows = rows
    .slice(1)
    .filter((row) => Array.isArray(row) && row.length > 0)
    .map((row, index) => normalizeRow(row, headers, dateIndex, index + 1));

  return {
    headers,
    rows: normalizedRows,
  };
};

/**
 * Reads and parses an Excel file from a provided path.
 */
export const loadExcelDataset = async (filePath: string): Promise<ExcelDataset> => {
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`Failed to read Excel file at ${filePath}.`);
  }

  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('Excel workbook does not contain any worksheets.');
  }

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error('Excel worksheet could not be loaded.');
  }

  return parseWorksheet(worksheet);
};
