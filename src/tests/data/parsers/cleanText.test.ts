import { describe, expect, it } from 'vitest';
import { cleanText } from '../../../data/parsers/cleanText';

// Ensure text cleanup handles whitespace and invisible characters.
describe('cleanText', () => {
  it('removes invisible characters and trims whitespace', () => {
    const value = '  hello\u200c   world\ufeff  ';
    expect(cleanText(value)).toBe('hello world');
  });

  it('collapses multiple spaces into a single space', () => {
    const value = 'alpha   beta\n\n gamma';
    expect(cleanText(value)).toBe('alpha beta gamma');
  });
});
