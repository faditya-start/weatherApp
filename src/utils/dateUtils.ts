export type DateFormatOptions = {
  weekday?: 'short' | 'long';
  month?: 'short' | 'long' | 'numeric';
  day?: 'numeric';
  year?: 'numeric';
  hour?: 'numeric';
  minute?: 'numeric';
  hour12?: boolean;
};

export const formatDate = (date: Date, locale: string = 'en', options?: DateFormatOptions): string => {
  return new Intl.DateTimeFormat(locale, options || {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date, locale: string = 'en'): string => {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(date);
};

export const getDayName = (date: Date, locale: string = 'en', format: 'short' | 'long' = 'short'): string => {
  return new Intl.DateTimeFormat(locale, { weekday: format }).format(date);
};

export const getMonthName = (date: Date, locale: string = 'en', format: 'short' | 'long' = 'long'): string => {
  return new Intl.DateTimeFormat(locale, { month: format }).format(date);
};

export const formatFullDate = (date: Date, locale: string = 'en'): string => {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}; 