import { useLanguage } from '../context/LanguageContext';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-full bg-blue-600/20 hover:bg-blue-600/30 transition-colors duration-200"
    >
      {language.toUpperCase()}
    </button>
  );
}; 