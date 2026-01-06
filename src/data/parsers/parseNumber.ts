import { cleanText } from './cleanText';
import { normalizeDigits } from './digits';

export const parseNumber = (value: string): number | null => {
  const cleaned = cleanText(value);
  if (!cleaned) {
    return null;
  }

  const normalized = normalizeDigits(cleaned)
    .replace(/[٬,]/g, '')
    .replace(/\s+/g, '')
    .replace(/٫/g, '.');

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }

  const numberValue = Number(normalized);
  return Number.isFinite(numberValue) ? numberValue : null;
};
