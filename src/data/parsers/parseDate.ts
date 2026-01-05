import { cleanText } from './cleanText';
import { normalizeNumericString, parseNumber } from './parseNumber';

const DATE_SEPARATORS = /[-/.]/g;

const createUtcDate = (year: number, month: number, day: number): Date | null => {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
};

const parseDateParts = (parts: number[]): Date | null => {
  if (parts.length !== 3) {
    return null;
  }

  const [first, second, third] = parts;

  if (first > 999) {
    return createUtcDate(first, second, third);
  }

  if (third > 999) {
    if (first > 12 && second <= 12) {
      return createUtcDate(third, second, first);
    }
    if (second > 12 && first <= 12) {
      return createUtcDate(third, first, second);
    }
    return createUtcDate(third, second, first);
  }

  return null;
};

const parseDelimitedDate = (value: string): Date | null => {
  const normalized = normalizeNumericString(value)
    .replace(DATE_SEPARATORS, '/')
    .replace(/\s+/g, '');

  const rawParts = normalized.split('/');
  if (rawParts.length !== 3) {
    return null;
  }

  const numericParts = rawParts.map((part) => parseNumber(part));
  if (numericParts.some((part) => part === null)) {
    return null;
  }

  return parseDateParts(numericParts.map((part) => Math.trunc(part!)));
};

const parseExcelSerialDate = (value: number): Date | null => {
  if (!Number.isFinite(value)) {
    return null;
  }
  const dayValue = Math.trunc(value);
  const excelEpoch = Date.UTC(1899, 11, 30);
  const date = new Date(excelEpoch + dayValue * 24 * 60 * 60 * 1000);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

/**
 * Parses Excel date values or formatted strings into a date-only UTC Date.
 */
export const parseDate = (value: unknown): Date | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return createUtcDate(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
  }

  if (typeof value === 'number') {
    return parseExcelSerialDate(value);
  }

  const text = cleanText(value);
  if (!text) {
    return null;
  }

  return parseDelimitedDate(text);
};
