import React from 'react';
import { WeatherData } from '../types/weather';
import { useTemperature } from '../context/TemperatureContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { WeatherConditionType, TranslationKey } from '../context/LanguageContext';
import { formatFullDate } from '../utils/dateUtils';
import { formatTemperature } from '../utils/temperatureUtils';

interface WeatherCardProps {
  weatherData: WeatherData | null;
  isLoading?: boolean;
  error?: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weatherData, 
  isLoading = false,
  error 
}) => {
  const { unit } = useTemperature();
  const { theme } = useTheme();
  const { t, locale } = useLanguage();
  const isDark = theme === 'dark';

  const WeatherDetail = ({ label, value, unit = '' }: { label: string; value: string | number; unit?: string }) => (
    <div className="text-center px-4 transition-all duration-300 hover:scale-105">
      <p className={`text-sm mb-1 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>{label}</p>
      <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}{unit}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`p-6 rounded-2xl backdrop-blur-sm animate-pulse ${
        isDark ? 'bg-blue-900/20' : 'bg-white/60'
      }`}>
        <div className="flex flex-col items-center space-y-6">
          <div className="w-48 h-8 bg-gray-300 rounded"></div>
          <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
          <div className="w-24 h-12 bg-gray-300 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-4 bg-gray-300 rounded mb-2"></div>
                <div className="w-12 h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
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

  if (!weatherData) return null;

  // Helper function to safely get translations for weather conditions
  const getWeatherTranslation = (condition: string): string => {
    // Check if the condition is a valid weather condition type
    const validCondition = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Snow', 'Mist'].includes(condition)
      ? (condition as WeatherConditionType)
      : 'Clear'; // Default to Clear if not found
    
    return t(validCondition as TranslationKey);
  };

  const weatherMain = weatherData.weather[0].main;

  return (
    <div className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.01] ${
      isDark ? 'bg-blue-900/20' : 'bg-white/60'
    }`}>
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
            {formatFullDate(new Date(), locale)}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 transition-transform duration-300 hover:scale-105">
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt={getWeatherTranslation(weatherMain)}
            className="w-32 h-32 drop-shadow-lg transition-transform duration-300 hover:rotate-12"
          />
          <div className="text-center">
            <div className="flex items-start">
              <span className={`text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatTemperature(weatherData.main.temp, unit === 'celsius' ? 'C' : 'F')}
              </span>
            </div>
            <p className={`text-xl mt-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              {getWeatherTranslation(weatherMain)}
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 w-full border-t border-b ${
          isDark ? 'border-blue-800/30' : 'border-blue-100'
        } py-4`}>
          <WeatherDetail
            label={t('feelsLike')}
            value={formatTemperature(weatherData.main.feels_like, unit === 'celsius' ? 'C' : 'F')}
            unit=""
          />
          <WeatherDetail
            label={t('humidity')}
            value={weatherData.main.humidity}
            unit="%"
          />
          <WeatherDetail
            label={t('wind')}
            value={weatherData.wind.speed.toFixed(1)}
            unit=" m/s"
          />
          <WeatherDetail
            label={t('pressure')}
            value={weatherData.main.pressure}
            unit=" hPa"
          />
        </div>
      </div>
    </div>
  );
};
