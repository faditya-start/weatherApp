import React from 'react';
import { ForecastData } from '../types/weather';
import { useTemperature } from '../context/TemperatureContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { WeatherConditionType, TranslationKey } from '../context/LanguageContext';
import { formatDate } from '../utils/dateUtils';
import { formatTemperature } from '../utils/temperatureUtils';

interface ForecastCardProps {
  forecastData: ForecastData | null;
  isLoading?: boolean;
  error?: string;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({
  forecastData,
  isLoading = false,
  error
}) => {
  const { unit } = useTemperature();
  const { theme } = useTheme();
  const { t, locale } = useLanguage();
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <div className={`p-6 rounded-2xl backdrop-blur-sm ${
        isDark ? 'bg-blue-900/20' : 'bg-white/60'
      }`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t('forecast')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-xl animate-pulse"
            >
              <div className="w-20 h-4 bg-gray-300 rounded mb-2"></div>
              <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
              <div className="w-16 h-4 bg-gray-300 rounded mb-1"></div>
              <div className="w-12 h-4 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-2xl backdrop-blur-sm ${
        isDark ? 'bg-red-900/20' : 'bg-red-50'
      }`}>
        <div className="text-center">
          <p className={`text-lg font-semibold ${isDark ? 'text-red-200' : 'text-red-600'}`}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!forecastData?.list?.length) return null;

  const forecasts = forecastData.list;

  // Helper function to safely get translations for weather conditions
  const getWeatherTranslation = (condition: string): string => {
    // Check if the condition is a valid weather condition type
    const validCondition = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist'].includes(condition)
      ? (condition as WeatherConditionType)
      : 'Clear'; // Default to Clear if not found
    
    return t(validCondition as TranslationKey);
  };

  return (
    <div className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
      isDark ? 'bg-blue-900/20' : 'bg-white/60'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {t('forecast')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {forecasts.map((forecast, index) => {
          if (!forecast?.weather?.[0]) return null;
          
          const weatherMain = forecast.weather[0].main;
          
          return (
            <div
              key={index}
              className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                isDark ? 'hover:bg-blue-800/20' : 'hover:bg-blue-50/50'
              }`}
            >
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                {formatDate(new Date(forecast.dt * 1000), locale)}
              </p>
              <img
                src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                alt={getWeatherTranslation(weatherMain)}
                className="w-16 h-16 mb-2 drop-shadow-lg transition-transform duration-300 hover:rotate-12"
              />
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatTemperature(forecast.temp.max, unit === 'celsius' ? 'C' : 'F')}
              </p>
              <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                {getWeatherTranslation(weatherMain)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                  {t('high')}: {formatTemperature(forecast.temp.max, unit === 'celsius' ? 'C' : 'F')}
                </span>
                <span className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                  {t('low')}: {formatTemperature(forecast.temp.min, unit === 'celsius' ? 'C' : 'F')}
                </span>
              </div>
              {forecast.pop > 0 && (
                <p className={`text-xs mt-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                  {Math.round(forecast.pop * 100)}% {t('precipitation')}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 