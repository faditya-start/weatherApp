import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
        isDark
          ? 'bg-blue-900/20 hover:bg-blue-900/30 text-blue-200'
          : 'bg-white/60 hover:bg-white/80 text-blue-800'
      }`}
    >
      {language.toUpperCase()}
    </button>
  );
}; 