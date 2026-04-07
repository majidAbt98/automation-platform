/**
 * Jalali (Shamsi/Persian) calendar utilities.
 * Implements the Jalaali-to-Gregorian conversion algorithm.
 */

import { toPersianDigits } from './persian-utils';

const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

/**
 * Convert a Gregorian date to Jalali (Solar Hijri) date.
 * Returns [year, month, day] in Jalali calendar.
 */
export function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number,
): [number, number, number] {
  const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gDaysInMonth[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    const jd = 1 + (days % 31);
    return [jy, jm, jd];
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    const jd = 1 + ((days - 186) % 30);
    return [jy, jm, jd];
  }
}

/**
 * Format a Date object as a Jalali date string.
 * @param date - JavaScript Date object
 * @param format - 'short' for YYYY/MM/DD, 'long' for DD MonthName YYYY
 * @param persianDigits - whether to use Persian digits
 */
export function formatJalaliDate(
  date: Date,
  format: 'short' | 'long' = 'short',
  persianDigits = true,
): string {
  const [jy, jm, jd] = gregorianToJalali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  let result: string;
  if (format === 'long') {
    result = `${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`;
  } else {
    const mm = String(jm).padStart(2, '0');
    const dd = String(jd).padStart(2, '0');
    result = `${jy}/${mm}/${dd}`;
  }

  return persianDigits ? toPersianDigits(result) : result;
}

/**
 * Format a Date object as Jalali date + time string.
 */
export function formatJalaliDateTime(
  date: Date,
  persianDigits = true,
): string {
  const dateStr = formatJalaliDate(date, 'short', persianDigits);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  const result = `${dateStr} ${timeStr}`;
  return persianDigits ? toPersianDigits(result) : result;
}

/**
 * Get the Jalali month name by index (1-based).
 */
export function getJalaliMonthName(month: number): string {
  return JALALI_MONTHS[month - 1] || '';
}
