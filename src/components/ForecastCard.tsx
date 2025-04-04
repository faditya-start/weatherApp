import { ForecastData } from '../types/weather';
import { useTemperature } from '../context/TemperatureContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface ForecastCardProps {
  forecastData: ForecastData;
}

export const ForecastCard = ({ forecastData }: ForecastCardProps) => {
  const { convertTemperature, unit } = useTemperature();
  const { theme } = useTheme();
  const { t } = useLanguage();

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

  const textColorClass = theme === 'dark' ? 'text-white' : 'text-blue-950';
  const dayColorClass = theme === 'dark' ? 'text-gray-200' : 'text-blue-900';
  const unitColorClass = theme === 'dark' ? 'text-gray-300' : 'text-blue-800';

  const getDayTranslation = (date: string) => {
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    return t(`days.${day}`);
  };

  return (
    <div className="grid grid-cols-5 gap-2 max-w-3xl mx-auto">
      {dailyForecasts.map((forecast) => (
        <div 
          key={forecast.date} 
          className={`bg-gradient-to-b ${theme === 'dark' ? 'from-blue-950/40 to-blue-950/60' : 'from-blue-100/60 to-blue-200/80'} rounded-3xl backdrop-blur-sm p-3`}
        >
          <div className="flex flex-col items-center space-y-1">
            <p className={`text-base font-medium ${dayColorClass}`}>
              {getDayTranslation(forecast.date)}
            </p>
            <div className="flex items-baseline">
              <span className={`text-2xl font-bold ${textColorClass}`}>
                {forecast.avgTemp}
              </span>
              <span className={`ml-0.5 text-lg font-medium ${unitColorClass}`}>
                °{unit === 'celsius' ? 'C' : 'F'}
              </span>
            </div>
            <img 
              src={`http://openweathermap.org/img/wn/${forecast.icon}.png`}
              alt={t(`weather.${forecast.weather}`)}
              className="w-12 h-12"
            />
          </div>
        </div>
      ))}
    </div>
  );
}; 