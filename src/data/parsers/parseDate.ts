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

const parseExcelSerialDate = (value: number): Date | null => {
  const excelEpoch = Date.UTC(1899, 11, 30);
  const date = new Date(excelEpoch + value * 24 * 60 * 60 * 1000);
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

  const normalized = normalizeNumericString(text)
    .replace(DATE_SEPARATORS, '/')
    .replace(/\s+/g, '');

  const parts = normalized
    .split('/')
    .map((part) => parseNumber(part))
    .filter((part): part is number => part !== null)
    .map((part) => Math.trunc(part));

  return parseDateParts(parts);
};
