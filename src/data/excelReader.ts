import * as XLSX from 'xlsx';
import { ExcelDataError } from './errors';
import type { ExcelData, NormalizedCell, NormalizedRow } from './model';
import { cleanText } from './parsers/cleanText';
import { parseDate } from './parsers/parseDate';
import { parseNumber } from './parsers/parseNumber';

const DATE_HEADERS = ['date', 'تاریخ'];

const normalizeHeader = (value: string): string => {
  return cleanText(value).toLowerCase();
};

const formatDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const resolveDateHeader = (headers: string[]): string => {
  const match = headers.find((header) => DATE_HEADERS.includes(normalizeHeader(header)));
  if (!match) {
    throw new ExcelDataError('ستون تاریخ در فایل اکسل یافت نشد.');
  }
  return match;
};

const parseHeaders = (headerRow: unknown[]): string[] => {
  const headers: string[] = [];
  const seen = new Set<string>();
  for (const cell of headerRow) {
    const header = typeof cell === 'string' ? cleanText(cell) : cleanText(String(cell ?? ''));
    if (!header) {
      break;
    }
    const normalizedHeader = normalizeHeader(header);
    if (seen.has(normalizedHeader)) {
      throw new ExcelDataError('سرستون‌های تکراری در فایل اکسل مجاز نیستند.');
    }
    seen.add(normalizedHeader);
    headers.push(header);
  }

  if (headers.length === 0) {
    throw new ExcelDataError('ردیف سرستون‌های فایل اکسل خالی است.');
  }

  return headers;
};

const normalizeCell = (value: unknown): NormalizedCell => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const cleaned = cleanText(value);
    if (!cleaned) {
      return null;
    }
    const parsedNumber = parseNumber(cleaned);
    return parsedNumber ?? cleaned;
  }

  if (value instanceof Date) {
    return formatDateISO(value);
  }

  return cleanText(String(value));
};

const isRowEmpty = (row: unknown[]): boolean => {
  return row.every((cell) => {
    if (cell === null || cell === undefined) {
      return true;
    }
    if (typeof cell === 'string') {
      return cleanText(cell) === '';
    }
    return false;
  });
};

const buildNormalizedRows = (
  rows: unknown[][],
  headers: string[],
  dateHeader: string,
): NormalizedRow[] => {
  const normalized: NormalizedRow[] = [];

  for (const row of rows) {
    if (isRowEmpty(row)) {
      continue;
    }

    const cells: Record<string, NormalizedCell> = {};
    let dateValue: Date | null = null;

    headers.forEach((header, index) => {
      const rawValue = row[index];
      if (header === dateHeader) {
        dateValue = parseDate(rawValue);
        if (!dateValue) {
          throw new ExcelDataError('فرمت تاریخ در فایل اکسل معتبر نیست.');
        }
        cells[header] = formatDateISO(dateValue);
        return;
      }
      cells[header] = normalizeCell(rawValue);
    });

    if (!dateValue) {
      throw new ExcelDataError('هر ردیف باید دارای تاریخ معتبر باشد.');
    }

    normalized.push({ date: dateValue, cells });
  }

  return normalized;
};

const normalizePathToUrl = (filePath: string): string => {
  const cleanedPath = cleanText(filePath);
  if (!cleanedPath) {
    throw new ExcelDataError('مسیر فایل اکسل نامعتبر است.');
  }

  if (/^https?:\/\//i.test(cleanedPath) || /^file:\/\//i.test(cleanedPath)) {
    return cleanedPath;
  }

  if (cleanedPath.startsWith('\\\\')) {
    const uncPath = cleanedPath.replace(/^\\\\+/, '').replace(/\\/g, '/');
    return encodeURI(`file://${uncPath}`);
  }

  if (/^[a-zA-Z]:[\\/]/.test(cleanedPath)) {
    const windowsPath = cleanedPath.replace(/\\/g, '/');
    return encodeURI(`file:///${windowsPath}`);
  }

  return encodeURI(new URL(cleanedPath, window.location.href).toString());
};

const fetchExcelArrayBuffer = async (filePath: string): Promise<ArrayBuffer> => {
  try {
    const response = await fetch(normalizePathToUrl(filePath));
    if (!response.ok) {
      throw new ExcelDataError('خواندن فایل اکسل از مسیر تنظیم‌شده ممکن نیست.');
    }
    return await response.arrayBuffer();
  } catch (error) {
    if (error instanceof ExcelDataError) {
      throw error;
    }
    throw new ExcelDataError('بارگذاری فایل اکسل با خطا مواجه شد.');
  }
};

const parseWorkbook = (data: ArrayBuffer): ExcelData => {
  const workbook = XLSX.read(data, { type: 'array', cellDates: true });
  const [firstSheetName] = workbook.SheetNames;
  if (!firstSheetName) {
    throw new ExcelDataError('هیچ برگه‌ای در فایل اکسل وجود ندارد.');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: null,
    blankrows: false,
  }) as unknown[][];

  if (sheetRows.length === 0) {
    throw new ExcelDataError('فایل اکسل فاقد داده است.');
  }

  const headers = parseHeaders(sheetRows[0] ?? []);
  const dateHeader = resolveDateHeader(headers);
  const rows = buildNormalizedRows(sheetRows.slice(1), headers, dateHeader);

  return { headers, dateHeader, rows };
};

export const loadExcelData = async (filePath: string): Promise<ExcelData> => {
  const buffer = await fetchExcelArrayBuffer(filePath);
  return parseWorkbook(buffer);
};
