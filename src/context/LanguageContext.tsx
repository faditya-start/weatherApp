import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    locale: 'en-US',
    'ui.search': 'Search',
    'ui.searchPlaceholder': 'Enter city name...',
    'ui.forecast': '5-Day Forecast',
    'ui.feelsLike': 'Feels Like',
    'ui.humidity': 'Humidity',
    'ui.windSpeed': 'Wind Speed',
    'ui.pressure': 'Pressure',
    'ui.high': 'High',
    'ui.low': 'Low',
    'ui.precipitation': 'chance of rain',
    'ui.language': 'Language',
    'ui.theme': 'Theme',
    'ui.temperature': 'Temperature',
    'weather.Clear': 'Clear',
    'weather.Clouds': 'Cloudy',
    'weather.Rain': 'Rain',
    'weather.Drizzle': 'Drizzle',
    'weather.Thunderstorm': 'Thunderstorm',
    'weather.Snow': 'Snow',
    'weather.Mist': 'Mist',
    'weather.Partly Cloudy': 'Partly Cloudy',
    'weather.Cloudy': 'Cloudy',
    'weather.Rain Showers': 'Rain Showers',
    'weather.Foggy': 'Foggy'
  },
  id: {
    locale: 'id-ID',
    'ui.search': 'Cari',
    'ui.searchPlaceholder': 'Masukkan nama kota...',
    'ui.forecast': 'Prakiraan 5 Hari',
    'ui.feelsLike': 'Terasa Seperti',
    'ui.humidity': 'Kelembaban',
    'ui.windSpeed': 'Kecepatan Angin',
    'ui.pressure': 'Tekanan',
    'ui.high': 'Tertinggi',
    'ui.low': 'Terendah',
    'ui.precipitation': 'kemungkinan hujan',
    'ui.language': 'Bahasa',
    'ui.theme': 'Tema',
    'ui.temperature': 'Suhu',
    'weather.Clear': 'Cerah',
    'weather.Clouds': 'Berawan',
    'weather.Rain': 'Hujan',
    'weather.Drizzle': 'Gerimis',
    'weather.Thunderstorm': 'Badai Petir',
    'weather.Snow': 'Salju',
    'weather.Mist': 'Berkabut',
    'weather.Partly Cloudy': 'Berawan Sebagian',
    'weather.Cloudy': 'Berawan',
    'weather.Rain Showers': 'Hujan Lokal',
    'weather.Foggy': 'Berkabut'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('id');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 