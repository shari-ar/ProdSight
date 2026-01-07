import { describe, expect, it } from 'vitest';
import { parseDate } from './parseDate';

const toParts = (date: Date | null): string | null => {
  if (!date) {
    return null;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

describe('parseDate', () => {
  it('returns null for empty values', () => {
    expect(parseDate('')).toBeNull();
  });

  it('parses ISO formatted dates', () => {
    expect(toParts(parseDate('2024-01-15'))).toBe('2024-01-15');
  });

  it('parses day-first dates when year is last', () => {
    expect(toParts(parseDate('15/02/2024'))).toBe('2024-02-15');
  });

  it('accepts Date instances and strips time', () => {
    const value = new Date(2024, 3, 5, 15, 30, 45);
    expect(toParts(parseDate(value))).toBe('2024-04-05');
  });
});
