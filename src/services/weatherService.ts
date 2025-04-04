import { WeatherData, ForecastData } from '../types/weather';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

async function getCoordinates(city: string) {
  const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1`);
  if (!response.ok) throw new Error('Failed to get location data');
  const data = await response.json();
  if (!data.results?.[0]) throw new Error('City not found');
  return data.results[0];
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const location = await getCoordinates(city);
  const response = await fetch(
    `${WEATHER_API_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl&timezone=auto`
  );
  if (!response.ok) throw new Error('Failed to fetch weather data');
  const data = await response.json();

  return {
    coord: {
      lon: location.longitude,
      lat: location.latitude
    },
    weather: [{
      id: data.current.weather_code,
      main: getWeatherDescription(data.current.weather_code),
      description: getWeatherDescription(data.current.weather_code),
      icon: getWeatherIcon(data.current.weather_code)
    }],
    base: 'stations',
    main: {
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      temp_min: data.current.temperature_2m,
      temp_max: data.current.temperature_2m,
      pressure: data.current.pressure_msl,
      humidity: data.current.relative_humidity_2m
    },
    visibility: 10000,
    wind: {
      speed: data.current.wind_speed_10m,
      deg: 0
    },
    clouds: {
      all: 0
    },
    dt: Math.floor(Date.now() / 1000),
    sys: {
      type: 1,
      id: 1,
      country: location.country_code,
      sunrise: Math.floor(Date.now() / 1000),
      sunset: Math.floor(Date.now() / 1000)
    },
    timezone: 0,
    id: 0,
    name: location.name,
    cod: 200
  };
}

export async function getForecastByCity(city: string): Promise<ForecastData> {
  const location = await getCoordinates(city);
  const response = await fetch(
    `${WEATHER_API_URL}?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`
  );
  if (!response.ok) throw new Error('Failed to fetch forecast data');
  const data = await response.json();

  const forecastList = data.daily.time.map((time: string, index: number) => ({
    dt: Math.floor(new Date(time).getTime() / 1000),
    main: {
      temp: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
      feels_like: (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2,
      temp_min: data.daily.temperature_2m_min[index],
      temp_max: data.daily.temperature_2m_max[index],
      pressure: 1013,
      sea_level: 1013,
      grnd_level: 1013,
      humidity: 70,
      temp_kf: 0
    },
    weather: [{
      id: data.daily.weather_code[index],
      main: getWeatherDescription(data.daily.weather_code[index]),
      description: getWeatherDescription(data.daily.weather_code[index]),
      icon: getWeatherIcon(data.daily.weather_code[index])
    }],
    clouds: {
      all: data.daily.precipitation_probability_max[index] || 0
    },
    wind: {
      speed: 5,
      deg: 0,
      gust: 0
    },
    visibility: 10000,
    pop: data.daily.precipitation_probability_max[index] / 100 || 0,
    sys: {
      pod: 'd'
    },
    dt_txt: new Date(time).toISOString()
  }));

  return {
    cod: '200',
    message: 0,
    cnt: forecastList.length,
    list: forecastList,
    city: {
      id: 0,
      name: location.name,
      coord: {
        lat: location.latitude,
        lon: location.longitude
      },
      country: location.country_code,
      population: 0,
      timezone: 0,
      sunrise: Math.floor(Date.now() / 1000),
      sunset: Math.floor(Date.now() / 1000)
    }
  };
}

function getWeatherDescription(code: number): string {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear',
    1: 'Clear',
    2: 'Partly Cloudy',
    3: 'Cloudy',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Drizzle',
    53: 'Drizzle',
    55: 'Drizzle',
    56: 'Freezing Drizzle',
    57: 'Freezing Drizzle',
    61: 'Rain',
    63: 'Rain',
    65: 'Rain',
    66: 'Freezing Rain',
    67: 'Freezing Rain',
    71: 'Snow',
    73: 'Snow',
    75: 'Snow',
    77: 'Snow Grains',
    80: 'Rain Showers',
    81: 'Rain Showers',
    82: 'Rain Showers',
    85: 'Snow Showers',
    86: 'Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm',
    99: 'Thunderstorm'
  };
  return weatherCodes[code] || 'Unknown';
}

function getWeatherIcon(code: number): string {
  // Map WMO codes to OpenWeatherMap-like icons
  const iconMap: { [key: number]: string } = {
    0: '01d', // Clear sky
    1: '02d', // Mainly clear
    2: '03d', // Partly cloudy
    3: '04d', // Overcast
    45: '50d', // Foggy
    48: '50d', // Depositing rime fog
    51: '09d', // Light drizzle
    53: '09d', // Moderate drizzle
    55: '09d', // Dense drizzle
    56: '09d', // Light freezing drizzle
    57: '09d', // Dense freezing drizzle
    61: '10d', // Slight rain
    63: '10d', // Moderate rain
    65: '10d', // Heavy rain
    66: '13d', // Light freezing rain
    67: '13d', // Heavy freezing rain
    71: '13d', // Slight snow fall
    73: '13d', // Moderate snow fall
    75: '13d', // Heavy snow fall
    77: '13d', // Snow grains
    80: '09d', // Slight rain showers
    81: '09d', // Moderate rain showers
    82: '09d', // Violent rain showers
    85: '13d', // Slight snow showers
    86: '13d', // Heavy snow showers
    95: '11d', // Thunderstorm
    96: '11d', // Thunderstorm with slight hail
    99: '11d'  // Thunderstorm with heavy hail
  };
  return iconMap[code] || '01d';
} 