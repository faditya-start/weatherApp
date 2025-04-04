import { useState } from 'react';
import { WeatherData, ForecastData } from '../types/weather';
import { fetchWeatherData, fetchForecastData } from '../services/weatherService';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface SearchBarProps {
  onWeatherData: (data: WeatherData) => void;
  onForecastData: (data: ForecastData) => void;
}

export const SearchBar = ({ onWeatherData, onForecastData }: SearchBarProps) => {
  const [city, setCity] = useState('');
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    try {
      const weatherData = await fetchWeatherData(city);
      const forecastData = await fetchForecastData(city);
      onWeatherData(weatherData);
      onForecastData(forecastData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder={t('ui.searchPlaceholder')}
        className={`flex-1 px-4 py-2 rounded-full ${
          theme === 'dark' 
            ? 'bg-blue-950/40 text-white placeholder-gray-400' 
            : 'bg-white/60 text-blue-950 placeholder-blue-400'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
      >
        {t('ui.search')}
      </button>
    </form>
  );
};