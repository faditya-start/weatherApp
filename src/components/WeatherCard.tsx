import React from 'react';
import { WeatherData } from '../types/weather';
import { useTemperature } from '../context/TemperatureContext';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const { convertTemperature, unit } = useTemperature();
  const temperature = convertTemperature(data.main.temp);
  const feelsLike = convertTemperature(data.main.feels_like);

  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">
          {data.name}, {data.sys.country}
        </h2>
        <div className="flex items-center justify-center">
          <img
            src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
            className="w-20 h-20"
          />
        </div>
        <p className="text-6xl font-bold text-white">
          {temperature}°{unit === 'celsius' ? 'C' : 'F'}
        </p>
        <p className="text-xl text-gray-300 capitalize">
          {data.weather[0].description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
          <p className="text-gray-300">Feels Like</p>
          <p className="text-2xl font-semibold text-white">
            {feelsLike}°{unit === 'celsius' ? 'C' : 'F'}
          </p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
          <p className="text-gray-300">Humidity</p>
          <p className="text-2xl font-semibold text-white">{data.main.humidity}%</p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
          <p className="text-gray-300">Wind Speed</p>
          <p className="text-2xl font-semibold text-white">{data.wind.speed} m/s</p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
          <p className="text-gray-300">Pressure</p>
          <p className="text-2xl font-semibold text-white">{data.main.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
