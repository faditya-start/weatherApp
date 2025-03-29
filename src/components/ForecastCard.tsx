import { ForecastData } from '../types/weather';

interface ForecastCardProps {
  forecastData: ForecastData;
}

export const ForecastCard = ({ forecastData }: ForecastCardProps) => {
  // Group forecast data by day
  const groupedForecast = forecastData.list.reduce((acc: { [key: string]: typeof forecastData.list[0][] }, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  // Get daily averages
  const dailyForecasts = Object.entries(groupedForecast).slice(0, 5).map(([date, items]) => {
    const avgTemp = items.reduce((sum, item) => sum + item.main.temp, 0) / items.length;
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
      avgTemp: Math.round(avgTemp),
      weather: mainWeather,
      icon
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {dailyForecasts.map((forecast) => (
        <div key={forecast.date} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm text-gray-300">{new Date(forecast.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img 
              src={`http://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
              alt={forecast.weather}
              className="w-16 h-16 mx-auto"
            />
            <p className="text-2xl font-bold text-white">{forecast.avgTemp}°C</p>
            <p className="text-sm text-gray-300">{forecast.weather}</p>
          </div>
        </div>
      ))}
    </div>
  );
}; 