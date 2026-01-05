const INVISIBLE_CHARS = /[\u200B-\u200D\uFEFF]/g;

/**
 * Cleans text input by trimming and removing invisible characters.
 */
export const cleanText = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).replace(INVISIBLE_CHARS, '').trim();
  return text.length > 0 ? text : null;
};
