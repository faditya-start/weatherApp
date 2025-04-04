import React from 'react';
import { WeatherData } from '../types/weather';
import { useTheme } from '../context/ThemeContext';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg shadow-gray-900/50' 
        : 'bg-gradient-to-br from-white to-gray-50 shadow-lg shadow-gray-200/50'
    }`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Main Weather Info */}
        <div className="text-center md:text-left">
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data.name}, {data.sys.country}
          </h2>
          <div className={`text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {Math.round(data.main.temp)}°C
          </div>
          <div className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {data.weather[0].description}
          </div>
        </div>

        {/* Weather Icon */}
        <div className="relative">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
            alt={data.weather[0].description}
            className="w-32 h-32 transform transition-transform hover:scale-110"
          />
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Feels Like</div>
          <div className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {Math.round(data.main.feels_like)}°C
          </div>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Humidity</div>
          <div className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data.main.humidity}%
          </div>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Wind</div>
          <div className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data.wind.speed} m/s
          </div>
        </div>
        <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pressure</div>
          <div className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data.main.pressure} hPa
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
