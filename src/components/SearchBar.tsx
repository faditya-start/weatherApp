import React, { useState } from 'react';
import { WeatherData, ForecastData } from '../types/weather';
import { getWeatherByCity, getForecastByCity } from '../services/weatherService';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface SearchBarProps {
  onWeatherData: (data: WeatherData) => void;
  onForecastData: (data: ForecastData) => void;
  onLoading: (loading: boolean) => void;
  onError: (errorMessage: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onWeatherData, 
  onForecastData,
  onLoading,
  onError
}) => {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsLoading(true);
    onLoading(true);
    setLocalError('');

    try {
      console.log('Fetching weather data for:', city);
      const weatherData = await getWeatherByCity(city);
      console.log('Weather data received:', weatherData);
      
      console.log('Fetching forecast data for:', city);
      const forecastData = await getForecastByCity(city);
      console.log('Forecast data received:', forecastData);

      onWeatherData(weatherData);
      onForecastData(forecastData);
      setCity('');
    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setLocalError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className={`w-full px-4 py-3 rounded-full outline-none transition-all duration-300 ${
            isDark 
              ? 'bg-blue-900/20 text-white placeholder-blue-200/70 focus:bg-blue-900/30'
              : 'bg-white/60 text-gray-900 placeholder-gray-500 focus:bg-white/80'
          } backdrop-blur-sm`}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full transition-all duration-300 ${
            isDark
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? t('searching') : t('search')}
        </button>
      </form>
      {localError && (
        <div className={`mt-2 px-4 py-2 rounded-lg text-sm ${
          isDark ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-600'
        }`}>
          {localError}
        </div>
      )}
    </div>
  );
};