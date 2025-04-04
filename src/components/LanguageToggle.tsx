import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    console.log('Changing language from', language, 'to', newLang);
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-300 ${
        isDark
          ? 'bg-blue-500/30 hover:bg-blue-500/50 text-blue-200'
          : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
      }`}
    >
      <span className="font-medium">{language === 'en' ? '🇺🇸 EN' : '🇮🇩 ID'}</span>
    </button>
  );
}; 