import { isValidJalaaliDate, toGregorian } from 'jalaali-js';
import * as XLSX from 'xlsx';
import { cleanText } from './cleanText';
import { normalizeDigits } from './digits';

/** Strip any time components so comparisons remain date-only. */
const toDateOnly = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

/** Parse Excel serial date numbers using SheetJS utilities. */
const parseExcelSerial = (value: number): Date | null => {
  const parsed = XLSX.SSF.parse_date_code(value);
  if (!parsed) {
    return null;
  }
  return toDateOnly(new Date(parsed.y, parsed.m - 1, parsed.d));
};

/** Guard against invalid date components and leap issues. */
const buildDate = (year: number, month: number, day: number): Date | null => {
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return toDateOnly(date);
};

/** Prefer Jalali conversion when the year suggests a Persian date. */
const isLikelyJalaaliYear = (year: number): boolean => year >= 1300 && year <= 1499;

/** Convert valid Jalali date components to a Gregorian Date. */
const buildJalaaliDate = (year: number, month: number, day: number): Date | null => {
  if (!isValidJalaaliDate(year, month, day)) {
    return null;
  }
  const { gy, gm, gd } = toGregorian(year, month, day);
  return buildDate(gy, gm, gd);
};

/**
 * Build a Gregorian date, then fall back to a Jalali conversion when either the
 * year looks Persian or the Gregorian build fails to validate.
 */
const buildBestDate = (year: number, month: number, day: number): Date | null => {
  const gregorianDate = buildDate(year, month, day);
  if (gregorianDate && !isLikelyJalaaliYear(year)) {
    return gregorianDate;
  }

  const jalaliDate = buildJalaaliDate(year, month, day);
  return jalaliDate ?? gregorianDate;
};

/** Parse YYYY-MM-DD, DD/MM/YYYY, or MM/DD/YYYY formatted date parts. */
const parseDateParts = (parts: string[]): Date | null => {
  if (parts.length !== 3) {
    return null;
  }

  const [first, second, third] = parts;
  const numbers = parts.map((part) => Number.parseInt(part, 10));
  if (numbers.some((value) => Number.isNaN(value))) {
    return null;
  }

  if (first.length === 4) {
    return buildBestDate(numbers[0], numbers[1], numbers[2]);
  }

  if (third.length === 4) {
    const [partA, partB, year] = numbers;
    if (partA > 12 && partB <= 12) {
      return buildBestDate(year, partB, partA);
    }
    if (partB > 12 && partA <= 12) {
      return buildBestDate(year, partA, partB);
    }
    return buildBestDate(year, partB, partA);
  }

  return null;
};

/**
 * Parse Excel date values from strings, numbers, or Date objects.
 * Returns null when the input cannot be interpreted as a valid date.
 */
export const parseDate = (value: unknown): Date | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return toDateOnly(value);
  }

  if (typeof value === 'number') {
    return parseExcelSerial(value);
  }

  if (typeof value !== 'string') {
    return null;
  }

  const cleaned = cleanText(value);
  if (!cleaned) {
    return null;
  }

  const normalized = normalizeDigits(cleaned);
  const parts = normalized.split(/[\/-]/).filter(Boolean);
  return parseDateParts(parts);
};
