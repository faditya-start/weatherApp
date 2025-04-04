import React from 'react';
import { WeatherData } from '../types/weather';
import { useTemperature } from '../context/TemperatureContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface WeatherCardProps {
  weatherData: WeatherData;
}

export const WeatherCard = ({ weatherData }: WeatherCardProps) => {
  const { convertTemperature, unit } = useTemperature();
  const { theme } = useTheme();
  const { t } = useLanguage();

  const textColorClass = theme === 'dark' ? 'text-white' : 'text-blue-950';
  const labelColorClass = theme === 'dark' ? 'text-gray-300' : 'text-blue-800';

  return (
    <div className={`bg-gradient-to-b ${theme === 'dark' ? 'from-blue-950/40 to-blue-950/60' : 'from-blue-100/60 to-blue-200/80'} rounded-3xl backdrop-blur-sm p-6`}>
      <div className="flex flex-col items-center space-y-4">
        <h2 className={`text-2xl font-bold ${textColorClass}`}>
          {weatherData.name}, {weatherData.sys.country}
        </h2>
        
        <div className="flex items-center space-x-4">
          <img 
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={t(`weather.${weatherData.weather[0].main}`)}
            className="w-24 h-24"
          />
          <div className="text-center">
            <div className="flex items-baseline">
              <span className={`text-6xl font-bold ${textColorClass}`}>
                {convertTemperature(weatherData.main.temp).toFixed(1)}
              </span>
              <span className={`text-2xl ${labelColorClass}`}>°{unit === 'celsius' ? 'C' : 'F'}</span>
            </div>
            <p className={`text-lg ${labelColorClass}`}>
              {t(`weather.${weatherData.weather[0].main}`)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="text-center">
            <p className={`text-sm ${labelColorClass}`}>{t('ui.feelsLike')}</p>
            <p className={`text-xl font-semibold ${textColorClass}`}>
              {convertTemperature(weatherData.main.feels_like).toFixed(1)}°{unit === 'celsius' ? 'C' : 'F'}
            </p>
          </div>
          <div className="text-center">
            <p className={`text-sm ${labelColorClass}`}>{t('ui.humidity')}</p>
            <p className={`text-xl font-semibold ${textColorClass}`}>{weatherData.main.humidity}%</p>
          </div>
          <div className="text-center">
            <p className={`text-sm ${labelColorClass}`}>{t('ui.windSpeed')}</p>
            <p className={`text-xl font-semibold ${textColorClass}`}>{weatherData.wind.speed} m/s</p>
          </div>
          <div className="text-center">
            <p className={`text-sm ${labelColorClass}`}>{t('ui.pressure')}</p>
            <p className={`text-xl font-semibold ${textColorClass}`}>{weatherData.main.pressure} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
};
