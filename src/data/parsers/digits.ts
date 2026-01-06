/** Persian and Arabic digit glyphs mapped to Latin digits. */
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** Replace Persian/Arabic digits with ASCII digits for parsing. */
export const normalizeDigits = (value: string): string => {
  let result = value;
  PERSIAN_DIGITS.forEach((digit, index) => {
    result = result.replaceAll(digit, String(index));
  });
  ARABIC_DIGITS.forEach((digit, index) => {
    result = result.replaceAll(digit, String(index));
  });
  return result;
};
