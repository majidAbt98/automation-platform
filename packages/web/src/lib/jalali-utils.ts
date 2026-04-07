import { persianUtils } from './persian-utils';

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

// Converts Gregorian date components to Jalali (Solar Hijri) [year, month, day].
function gregorianToJalali(
  gy: number,
  gm: number,
  gd: number,
): [number, number, number] {
  const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
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
  if (days < 186) {
    return [jy, 1 + Math.floor(days / 31), 1 + (days % 31)];
  }
  return [jy, 7 + Math.floor((days - 186) / 30), 1 + ((days - 186) % 30)];
}

function formatJalaliDate(
  date: Date,
  format: 'short' | 'long' = 'short',
  usePersianDigits = true,
): string {
  const [jy, jm, jd] = gregorianToJalali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  const result =
    format === 'long'
      ? `${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`
      : `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;

  return usePersianDigits ? persianUtils.toPersianDigits(result) : result;
}

function formatJalaliDateTime(date: Date, usePersianDigits = true): string {
  const dateStr = formatJalaliDate(date, 'short', usePersianDigits);
  const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const result = `${dateStr} ${timeStr}`;
  return usePersianDigits ? persianUtils.toPersianDigits(result) : result;
}

function getJalaliMonthName(month: number): string {
  return JALALI_MONTHS[month - 1] ?? '';
}

export const jalaliUtils = {
  gregorianToJalali,
  formatJalaliDate,
  formatJalaliDateTime,
  getJalaliMonthName,
};
