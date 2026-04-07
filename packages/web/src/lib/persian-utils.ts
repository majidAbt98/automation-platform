/**
 * Persian (Farsi) utility functions for number formatting and digit conversion.
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Convert Latin digits (0-9) to Persian digits (۰-۹).
 */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

/**
 * Format a number with Persian digit separators and Persian numerals.
 * e.g. 1234567 → "۱٬۲۳۴٬۵۶۷"
 */
export function formatPersianNumber(num: number): string {
  const formatted = num.toLocaleString('fa-IR');
  return formatted;
}

/**
 * Check if the current locale is a RTL locale.
 */
export function isRtlLocale(locale: string): boolean {
  return ['fa', 'ar'].includes(locale);
}
