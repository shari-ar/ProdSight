import { describe, expect, it } from 'vitest';
import { parseNumber } from './parseNumber';

describe('parseNumber', () => {
  it('parses Persian digits with separators', () => {
    expect(parseNumber('۱٬۲۳۴٫۵۰')).toBe(1234.5);
  });

  it('parses negative values', () => {
    expect(parseNumber('-42')).toBe(-42);
  });

  it('returns null for non-numeric strings', () => {
    expect(parseNumber('12a')).toBeNull();
  });

  it('returns null for empty values', () => {
    expect(parseNumber('   ')).toBeNull();
  });
});
