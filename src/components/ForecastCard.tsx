import { ForecastData } from '../types/weather';
import { useTemperature } from '../context/TemperatureContext';
import { useTheme } from '../context/ThemeContext';

interface ForecastCardProps {
  forecastData: ForecastData;
}

export const ForecastCard = ({ forecastData }: ForecastCardProps) => {
  const { convertTemperature, unit } = useTemperature();
  const { theme } = useTheme();

  // Mengelompokkan data ramalan cuaca berdasarkan hari
  const groupedForecast = forecastData.list.reduce((acc: { [key: string]: typeof forecastData.list[0][] }, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Mendapatkan rata-rata harian
  const dailyForecasts = Object.entries(groupedForecast).slice(0, 5).map(([date, items]) => {
    const avgTemp = items.reduce((sum, item) => sum + ((item.temp.max + item.temp.min) / 2), 0) / items.length;
    const mostFrequentWeather = items.reduce((acc, item) => {
      const weather = item.weather[0];
      if (!acc[weather.main]) {
        acc[weather.main] = 0;
      }
      acc[weather.main]++;
      return acc;
    }, {} as { [key: string]: number });

    const mainWeather = Object.entries(mostFrequentWeather).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0];

    const icon = items.find(item => item.weather[0].main === mainWeather)?.weather[0].icon || '';

    return {
      date,
      avgTemp: Number(convertTemperature(avgTemp).toFixed(1)),
      weather: mainWeather,
      icon
    };
  });

  const textColorClass = theme === 'dark' ? 'text-white' : 'text-gray-800';

  return (
    <div className="grid grid-cols-5 gap-2 max-w-3xl mx-auto">
      {dailyForecasts.map((forecast) => (
        <div 
          key={forecast.date} 
          className={`bg-gradient-to-b ${theme === 'dark' ? 'from-blue-950/40 to-blue-950/60' : 'from-blue-100/40 to-blue-200/60'} rounded-3xl backdrop-blur-sm p-3`}
        >
          <div className="flex flex-col items-center space-y-1">
            <p className={`text-base font-medium ${textColorClass}`}>
              {new Date(forecast.date).toLocaleDateString('id-ID', { weekday: 'short' })}
            </p>
            <p className={`text-2xl font-bold ${textColorClass}`}>
              {forecast.avgTemp}°{unit === 'celsius' ? 'C' : 'F'}
            </p>
            <img 
              src={`http://openweathermap.org/img/wn/${forecast.icon}.png`}
              alt={forecast.weather}
              className="w-12 h-12"
            />
          </div>
        </div>
      ))}
    </div>
  );
}; 