import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

export const translations = {
  en: {
    searchPlaceholder: 'Search city...',
    search: 'Search',
    searching: 'Searching...',
    forecast: '5-Day Forecast',
    high: 'High',
    low: 'Low',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    windSpeed: 'Wind Speed',
    pressure: 'Pressure',
    precipitation: 'chance of rain',
    loading: 'Loading...',
    error: 'Error loading weather data',
    noData: 'No weather data available',
    // Weather conditions
    Clear: 'Clear',
    Clouds: 'Cloudy',
    Rain: 'Rain',
    Drizzle: 'Drizzle',
    Thunderstorm: 'Thunderstorm',
    Snow: 'Snow',
    Mist: 'Mist',
  },
  id: {
    searchPlaceholder: 'Cari kota...',
    search: 'Cari',
    searching: 'Mencari...',
    forecast: 'Prakiraan 5 Hari',
    high: 'Tertinggi',
    low: 'Terendah',
    feelsLike: 'Terasa seperti',
    humidity: 'Kelembaban',
    wind: 'Angin',
    windSpeed: 'Kecepatan Angin',
    pressure: 'Tekanan',
    precipitation: 'kemungkinan hujan',
    loading: 'Memuat...',
    error: 'Error memuat data cuaca',
    noData: 'Data cuaca tidak tersedia',
    // Weather conditions
    Clear: 'Cerah',
    Clouds: 'Berawan',
    Rain: 'Hujan',
    Drizzle: 'Gerimis',
    Thunderstorm: 'Badai Petir',
    Snow: 'Salju',
    Mist: 'Berkabut',
  }
};

export type WeatherConditionType = 'Clear' | 'Clouds' | 'Rain' | 'Drizzle' | 'Thunderstorm' | 'Snow' | 'Mist';
export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Save language preference to localStorage
const saveLanguagePreference = (language: Language) => {
  localStorage.setItem('preferredLanguage', language);
};

// Get language preference from localStorage
const getLanguagePreference = (): Language => {
  const savedLanguage = localStorage.getItem('preferredLanguage');
  return (savedLanguage === 'en' || savedLanguage === 'id') ? savedLanguage : 'en';
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => getLanguagePreference());

  useEffect(() => {
    saveLanguagePreference(language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const locale = language === 'id' ? 'id-ID' : 'en-US';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, locale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 