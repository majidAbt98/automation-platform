import { useTranslation } from 'react-i18next';

import { jalaliUtils } from '@/lib/jalali-utils';

export function useJalaliDate() {
  const { i18n } = useTranslation();
  const isPersian = i18n.language === 'fa';

  return {
    formatDate: (date: Date | string, format: 'short' | 'long' = 'short') => {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isPersian) {
        return jalaliUtils.formatJalaliDate(d, format, true);
      }
      return d.toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: format === 'long' ? 'long' : '2-digit',
        day: '2-digit',
      });
    },
    formatDateTime: (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isPersian) {
        return jalaliUtils.formatJalaliDateTime(d, true);
      }
      return d.toLocaleString(i18n.language, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    isPersian,
  };
}
