import React, { useState, FormEvent } from 'react';
import { WeatherData, ForecastData } from '../types/weather';
import { getWeatherByCity, getForecastByCity } from '../services/weatherService';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface SearchBarProps {
  onWeatherData: (data: WeatherData) => void;
  onForecastData: (data: ForecastData) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onWeatherData, onForecastData }) => {
  const [city, setCity] = useState('');
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      try {
        const weatherData = await getWeatherByCity(city);
        const forecastData = await getForecastByCity(city);
        onWeatherData(weatherData);
        onForecastData(forecastData);
        setCity('');
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('ui.searchPlaceholder')}
          className={`w-full px-6 py-4 text-lg rounded-full outline-none transition-all duration-300 
            ${isDark 
              ? 'bg-blue-900/20 text-white placeholder-blue-300/50 focus:bg-blue-900/30' 
              : 'bg-white/80 text-gray-900 placeholder-gray-400 focus:bg-white'
            } 
            focus:ring-2 focus:ring-blue-400 shadow-lg backdrop-blur-sm`}
        />
        <button
          type="submit"
          className={`absolute right-2 px-6 py-2 rounded-full transition-all duration-300 
            ${isDark
              ? 'bg-blue-500 hover:bg-blue-400 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
            }
            transform hover:scale-105 active:scale-95`}
        >
          {t('ui.search')}
        </button>
      </div>
    </form>
  );
};