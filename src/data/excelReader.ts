import * as XLSX from 'xlsx';
import { ExcelDataError } from './errors';
import type { ExcelData, NormalizedCell, NormalizedRow } from './model';
import { cleanText } from './parsers/cleanText';
import { parseDate } from './parsers/parseDate';
import { parseNumber } from './parsers/parseNumber';
import { logger } from '../utils/logger';

/** Canonical header labels that qualify as the authoritative Date column. */
const DATE_HEADERS = ['date', 'تاریخ'];

/** Normalize headers to a stable lowercase/trimmed representation. */
const normalizeHeader = (value: string): string => {
  return cleanText(value).toLowerCase();
};

/** Render a date-only ISO-8601 string to keep table output deterministic. */
const formatDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Resolve the header label that represents the Date column. */
const resolveDateHeader = (headers: string[]): string => {
  const match = headers.find((header) => DATE_HEADERS.includes(normalizeHeader(header)));
  if (!match) {
    throw new ExcelDataError('ستون تاریخ در فایل اکسل یافت نشد.');
  }
  return match;
};

/**
 * Extract column headers from the first row, stopping on the first empty cell.
 * Duplicate headers are rejected to avoid collisions in the normalized output.
 */
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

/** Normalize a cell into a string/number/null representation for rendering. */
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

/** Detect rows that contain no meaningful data. */
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

/**
 * Convert raw sheet rows into normalized rows with an authoritative date column.
 * Any row without a valid date is considered a critical data error.
 */
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

/**
 * Normalize paths to URL forms that can be fetched in the browser environment.
 * Supports http(s), file URLs, UNC paths, Windows drive paths, and relative paths.
 */
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

/**
 * Fetch an Excel file as an ArrayBuffer and map low-level errors to user-facing ones.
 */
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
    throw new ExcelDataError('بارگذاری فایل اکسل با خطا مواجه شد.', error);
  }
};

/** Parse the first worksheet and return normalized Excel data. */
const parseWorkbook = (data: ArrayBuffer): ExcelData => {
  const workbook = XLSX.read(data, { type: 'array', cellDates: true });
  if (workbook.SheetNames.length !== 1) {
    throw new ExcelDataError('فایل اکسل باید فقط یک برگه داشته باشد.');
  }

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

  logger.debug('Excel workbook parsed.', {
    sheet: firstSheetName,
    headers,
    rows: rows.length,
  });

  return { headers, dateHeader, rows };
};

/** Convert a buffer to a hex string for signature storage. */
const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

/** Generate a stable SHA-256 signature for change detection. */
const createBufferSignature = async (buffer: ArrayBuffer): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  const signature = bufferToHex(digest);
  logger.debug('Excel signature generated for configured path.', {
    signature,
  });
  return signature;
};

/** Generate a lightweight signature for user-selected files. */
const createFileSignature = (file: File): string => {
  const signature = `${file.lastModified}-${file.size}`;
  logger.debug('Excel signature generated for uploaded file.', {
    signature,
    fileName: file.name,
    fileSize: file.size,
  });
  return signature;
};

/** Public API for loading and parsing Excel data from a configured path. */
export const loadExcelData = async (filePath: string): Promise<ExcelData> => {
  logger.debug('Loading Excel data.', { filePath });
  const buffer = await fetchExcelArrayBuffer(filePath);
  return parseWorkbook(buffer);
};

/**
 * Load Excel data and return a content signature for change detection.
 */
export const loadExcelDataWithSignature = async (
  filePath: string,
): Promise<{ data: ExcelData; signature: string }> => {
  logger.debug('Loading Excel data with signature.', { filePath });
  const buffer = await fetchExcelArrayBuffer(filePath);
  const signature = await createBufferSignature(buffer);
  return { data: parseWorkbook(buffer), signature };
};

/** Public API for loading and parsing Excel data from a user-selected file. */
export const loadExcelFile = async (file: File): Promise<ExcelData> => {
  logger.debug('Loading Excel data from uploaded file.', {
    fileName: file.name,
    fileSize: file.size,
  });
  try {
    const buffer = await file.arrayBuffer();
    return parseWorkbook(buffer);
  } catch (error) {
    if (error instanceof ExcelDataError) {
      throw error;
    }
    throw new ExcelDataError('بارگذاری فایل اکسل با خطا مواجه شد.', error);
  }
};

/**
 * Load Excel data from a file and return a signature for change detection.
 */
export const loadExcelFileWithSignature = async (
  file: File,
): Promise<{ data: ExcelData; signature: string }> => {
  logger.debug('Loading Excel data from uploaded file with signature.', {
    fileName: file.name,
    fileSize: file.size,
  });
  try {
    const buffer = await file.arrayBuffer();
    return { data: parseWorkbook(buffer), signature: createFileSignature(file) };
  } catch (error) {
    if (error instanceof ExcelDataError) {
      throw error;
    }
    throw new ExcelDataError('بارگذاری فایل اکسل با خطا مواجه شد.', error);
  }
};
