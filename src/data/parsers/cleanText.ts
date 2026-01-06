const INVISIBLE_CHARS = /[\u200c\u200d\u200e\u200f\u2060\ufeff]/g;

export const cleanText = (value: string): string => {
  return value.replace(INVISIBLE_CHARS, '').replace(/\s+/g, ' ').trim();
};
