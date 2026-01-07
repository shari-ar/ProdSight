import { describe, expect, it } from 'vitest';
import { normalizeDigits } from '../../../data/parsers/digits';

describe('normalizeDigits', () => {
  it('converts Persian digits to ASCII', () => {
    expect(normalizeDigits('۱۲۳۴۵۶۷۸۹۰')).toBe('1234567890');
  });

  it('converts Arabic digits to ASCII', () => {
    expect(normalizeDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
  });

  it('keeps existing ASCII digits unchanged', () => {
    expect(normalizeDigits('Order 42')).toBe('Order 42');
  });
});
