import React from 'react';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weatherData: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  return (
    <div className="bg-primary rounded-lg p-6 shadow-lg max-w-sm w-full">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">{weatherData.name}</h2>
          <p className="text-gray-300">{weatherData.sys.country}</p>
        </div>
        <div className="text-4xl font-bold text-white">
          {Math.round(weatherData.main.temp)}°C
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center">
          <img 
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            className="w-16 h-16"
          />
          <p className="text-lg text-gray-300 capitalize">
            {weatherData.weather[0].description}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-gray-300">
          <p>Feels like</p>
          <p className="text-white font-semibold">
            {Math.round(weatherData.main.feels_like)}°C
          </p>
        </div>
        <div className="text-gray-300">
          <p>Humidity</p>
          <p className="text-white font-semibold">
            {weatherData.main.humidity}%
          </p>
        </div>
        <div className="text-gray-300">
          <p>Wind Speed</p>
          <p className="text-white font-semibold">
            {weatherData.wind.speed} m/s
          </p>
        </div>
        <div className="text-gray-300">
          <p>Pressure</p>
          <p className="text-white font-semibold">
            {weatherData.main.pressure} hPa
          </p>
        </div>
      </div>
    </div>
  );
};
