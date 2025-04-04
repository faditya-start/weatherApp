import React from 'react';
import { ForecastData } from '../types/weather';
import { useTemperature } from '../context/TemperatureContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface ForecastCardProps {
  forecastData: ForecastData;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecastData }) => {
  const { convertTemperature, unit } = useTemperature();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(t('locale'), { weekday: 'short' }).format(date);
  };

  return (
    <div className="mt-6">
      <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {t('ui.forecast')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecastData.list.slice(0, 5).map((day, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
              isDark
                ? 'bg-blue-900/20 hover:bg-blue-900/30'
                : 'bg-white/60 hover:bg-white/80'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className={`text-sm font-medium ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                {getDayName(day.dt_txt)}
              </span>
              
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={t(`weather.${day.weather[0].main}`)}
                className="w-16 h-16"
              />
              
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {convertTemperature(day.main.temp).toFixed(1)}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                    °{unit === 'celsius' ? 'C' : 'F'}
                  </span>
                </div>
                
                <div className="flex flex-col space-y-1 mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={isDark ? 'text-blue-200' : 'text-blue-800'}>
                      {t('ui.high')}:
                    </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {convertTemperature(day.main.temp_max).toFixed(1)}°
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={isDark ? 'text-blue-200' : 'text-blue-800'}>
                      {t('ui.low')}:
                    </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {convertTemperature(day.main.temp_min).toFixed(1)}°
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm mt-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                  {t(`weather.${day.weather[0].main}`)}
                </p>
                
                {day.pop > 0 && (
                  <p className={`text-xs mt-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                    {(day.pop * 100).toFixed(0)}% {t('ui.precipitation')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 