import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    days: {
      Mon: 'Mon',
      Tue: 'Tue',
      Wed: 'Wed',
      Thu: 'Thu',
      Fri: 'Fri',
      Sat: 'Sat',
      Sun: 'Sun',
    },
    weather: {
      Thunderstorm: 'Thunderstorm',
      Drizzle: 'Drizzle',
      Rain: 'Rain',
      Snow: 'Snow',
      Clear: 'Clear',
      Clouds: 'Clouds',
    },
    ui: {
      searchPlaceholder: 'Enter city name...',
      search: 'Search',
      feelsLike: 'Feels Like',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      pressure: 'Pressure',
    }
  },
  id: {
    days: {
      Mon: 'Sen',
      Tue: 'Sel',
      Wed: 'Rab',
      Thu: 'Kam',
      Fri: 'Jum',
      Sat: 'Sab',
      Sun: 'Min',
    },
    weather: {
      Thunderstorm: 'Badai Petir',
      Drizzle: 'Gerimis',
      Rain: 'Hujan',
      Snow: 'Salju',
      Clear: 'Cerah',
      Clouds: 'Berawan',
    },
    ui: {
      searchPlaceholder: 'Masukkan nama kota...',
      search: 'Cari',
      feelsLike: 'Terasa Seperti',
      humidity: 'Kelembaban',
      windSpeed: 'Kecepatan Angin',
      pressure: 'Tekanan',
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'id' ? 'en' : 'id');
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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