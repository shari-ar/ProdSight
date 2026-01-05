const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

const normalizeDigits = (value: string): string => {
  let normalized = value;
  PERSIAN_DIGITS.forEach((digit, index) => {
    normalized = normalized.replace(new RegExp(digit, 'g'), String(index));
  });
  ARABIC_DIGITS.forEach((digit, index) => {
    normalized = normalized.replace(new RegExp(digit, 'g'), String(index));
  });
  return normalized;
};

const THOUSAND_SEPARATORS = /[,_\s\u066C]/g;
const DECIMAL_SEPARATORS = /[\u066B]/g;

/**
 * Parses numeric input while supporting Persian/Arabic numerals and separators.
 */
export const parseNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const text = normalizeDigits(String(value))
    .replace(THOUSAND_SEPARATORS, '')
    .replace(DECIMAL_SEPARATORS, '.');

  if (text.trim() === '') {
    return null;
  }

  const numericValue = Number(text);
  return Number.isFinite(numericValue) ? numericValue : null;
};

export const normalizeNumericString = (value: string): string => normalizeDigits(value);
