import React from 'react';
import { WeatherData } from '../types/weather';
import { useTemperature } from '../context/TemperatureContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface WeatherCardProps {
  weatherData: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const { convertTemperature, unit } = useTemperature();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const WeatherDetail = ({ label, value, unit = '' }: { label: string; value: string | number; unit?: string }) => (
    <div className="text-center px-4">
      <p className={`text-sm mb-1 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>{label}</p>
      <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}{unit}
      </p>
    </div>
  );

  return (
    <div className={`p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
      isDark ? 'bg-blue-900/20' : 'bg-white/60'
    }`}>
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
            {new Date().toLocaleDateString(t('locale'), {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt={t(`weather.${weatherData.weather[0].main}`)}
            className="w-32 h-32"
          />
          <div className="text-center">
            <div className="flex items-start">
              <span className={`text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {convertTemperature(weatherData.main.temp).toFixed(1)}
              </span>
              <span className={`text-2xl ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                °{unit === 'celsius' ? 'C' : 'F'}
              </span>
            </div>
            <p className={`text-xl mt-2 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              {t(`weather.${weatherData.weather[0].main}`)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full border-t border-b ${
          isDark ? 'border-blue-800/30' : 'border-blue-100'
        } py-4">
          <WeatherDetail
            label={t('ui.feelsLike')}
            value={convertTemperature(weatherData.main.feels_like).toFixed(1)}
            unit={`°${unit === 'celsius' ? 'C' : 'F'}`}
          />
          <WeatherDetail
            label={t('ui.humidity')}
            value={weatherData.main.humidity}
            unit="%"
          />
          <WeatherDetail
            label={t('ui.windSpeed')}
            value={weatherData.wind.speed.toFixed(1)}
            unit=" m/s"
          />
          <WeatherDetail
            label={t('ui.pressure')}
            value={weatherData.main.pressure}
            unit=" hPa"
          />
        </div>
      </div>
    </div>
  );
};
