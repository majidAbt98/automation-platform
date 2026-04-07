const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

function formatPersianNumber(num: number): string {
  return num.toLocaleString('fa-IR');
}

function isRtlLocale(locale: string): boolean {
  return ['fa', 'ar'].includes(locale);
}

export const persianUtils = {
  toPersianDigits,
  formatPersianNumber,
  isRtlLocale,
};
