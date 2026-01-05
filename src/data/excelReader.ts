import * as XLSX from 'xlsx';
import { cleanText } from './parsers/cleanText';
import { parseDate } from './parsers/parseDate';
import { parseNumber } from './parsers/parseNumber';
import type { ExcelDataset, NormalizedCell, NormalizedRow } from './model';

const LOG_PREFIX = '[ProdSight:Excel]';

// Accepted header labels for locating the Date column (case-insensitive).
const DATE_HEADER_ALIASES = new Set(['date', 'تاریخ', 'تاريخ']);

// Normalize header strings while keeping original label for display.
const normalizeHeader = (header: string): string => header.trim();

// Extract headers until the first empty cell.
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

// Find the index of the first Date/تاریخ header.
const findDateColumnIndex = (headers: string[]): number => {
  const index = headers.findIndex((header) => DATE_HEADER_ALIASES.has(header.toLowerCase()));
  if (index === -1) {
    throw new Error('Date column not found in Excel worksheet headers.');
  }
  return index;
};

// Normalize a cell value into a predictable primitive.
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

// Normalize one row and enforce a valid Date value.
const normalizeRow = (
  row: unknown[],
  headers: string[],
  dateIndex: number,
  sourceRowIndex: number,
): NormalizedRow => {
  const dateValue = parseDate(row[dateIndex]);
  if (!dateValue) {
    throw new Error(`Invalid or missing date value at row ${sourceRowIndex}.`);
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

// Convert a worksheet into normalized headers and rows.
const parseWorksheet = (worksheet: XLSX.WorkSheet): ExcelDataset => {
  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    raw: true,
    blankrows: false,
    defval: null,
  });

  if (rows.length === 0) {
    throw new Error('Excel worksheet is empty.');
  }

  const headers = detectHeaders(rows[0] ?? []);
  const dateIndex = findDateColumnIndex(headers);
  console.info(`${LOG_PREFIX} Detected ${headers.length} columns, date column index ${dateIndex}.`);

  const normalizedRows = rows
    .slice(1)
    .filter((row) => Array.isArray(row) && row.length > 0)
    .map((row, index) =>
      normalizeRow(row.slice(0, headers.length), headers, dateIndex, index + 2),
    );

  return {
    headers,
    rows: normalizedRows,
  };
};

/**
 * Reads and parses an Excel file from a provided path.
 */
export const loadExcelDataset = async (filePath: string): Promise<ExcelDataset> => {
  console.info(`${LOG_PREFIX} Loading Excel file from ${filePath}.`);
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`Failed to read Excel file at ${filePath}.`);
  }

  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  if (workbook.SheetNames.length !== 1) {
    throw new Error('Excel workbook must contain exactly one worksheet.');
  }

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error('Excel worksheet could not be loaded.');
  }

  const dataset = parseWorksheet(worksheet);
  console.info(
    `${LOG_PREFIX} Parsed worksheet "${sheetName}" with ${dataset.rows.length} rows.`,
  );
  return dataset;
};
