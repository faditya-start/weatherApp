import { WeatherData, ForecastData } from '../types/weather';

// Open-Meteo API endpoints (no API key required)
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

async function getCoordinates(city: string) {
  const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1`);
  if (!response.ok) throw new Error('Failed to get location data');
  const data = await response.json();
  if (!data.results?.[0]) throw new Error('City not found');
  return data.results[0];
}

// Map Open-Meteo weather codes to our weather conditions
function mapWeatherCode(code: number): string {
  // WMO Weather interpretation codes
  const codeMap: Record<number, string> = {
    0: 'Clear',      // Clear sky
    1: 'Clear',      // Mainly clear
    2: 'Clouds',     // Partly cloudy
    3: 'Clouds',     // Overcast
    45: 'Mist',      // Fog
    48: 'Mist',      // Depositing rime fog
    51: 'Drizzle',   // Light drizzle
    53: 'Drizzle',   // Moderate drizzle
    55: 'Drizzle',   // Dense drizzle
    56: 'Drizzle',   // Light freezing drizzle
    57: 'Drizzle',   // Dense freezing drizzle
    61: 'Rain',      // Slight rain
    63: 'Rain',      // Moderate rain
    65: 'Rain',      // Heavy rain
    66: 'Rain',      // Light freezing rain
    67: 'Rain',      // Heavy freezing rain
    71: 'Snow',      // Slight snow fall
    73: 'Snow',      // Moderate snow fall
    75: 'Snow',      // Heavy snow fall
    77: 'Snow',      // Snow grains
    80: 'Rain',      // Slight rain showers
    81: 'Rain',      // Moderate rain showers
    82: 'Rain',      // Violent rain showers
    85: 'Snow',      // Slight snow showers
    86: 'Snow',      // Heavy snow showers
    95: 'Thunderstorm', // Thunderstorm
    96: 'Thunderstorm', // Thunderstorm with slight hail
    99: 'Thunderstorm'  // Thunderstorm with heavy hail
  };
  return codeMap[code] || 'Clouds';
}

// Map weather code to icon (compatible with our UI)
function getWeatherIcon(code: number): string {
  const iconMap: Record<number, string> = {
    0: '01d', // Clear sky
    1: '02d', // Mainly clear
    2: '03d', // Partly cloudy
    3: '04d', // Overcast
    45: '50d', // Fog
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

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  try {
    const location = await getCoordinates(city);
    const response = await fetch(
      `${WEATHER_API_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    
    // Transform the data to match our WeatherData interface
    return {
      name: location.name,
      sys: {
        country: location.country_code
      },
      main: {
        temp: data.current.temperature_2m,
        feels_like: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        pressure: data.current.pressure_msl
      },
      wind: {
        speed: data.current.wind_speed_10m
      },
      weather: [{
        main: mapWeatherCode(data.current.weather_code),
        description: mapWeatherCode(data.current.weather_code),
        icon: getWeatherIcon(data.current.weather_code)
      }]
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function getForecastByCity(city: string): Promise<ForecastData> {
  try {
    const location = await getCoordinates(city);
    const response = await fetch(
      `${WEATHER_API_URL}?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    const data = await response.json();
    
    // Map the forecast data to match our ForecastData interface
    const forecastList = data.daily.time.map((time: string, index: number) => ({
      dt: new Date(time).getTime() / 1000,
      temp: {
        min: data.daily.temperature_2m_min[index],
        max: data.daily.temperature_2m_max[index]
      },
      weather: [{
        main: mapWeatherCode(data.daily.weather_code[index]),
        description: mapWeatherCode(data.daily.weather_code[index]),
        icon: getWeatherIcon(data.daily.weather_code[index])
      }],
      pop: data.daily.precipitation_probability_max[index] / 100 || 0
    }));

    return {
      list: forecastList.slice(0, 5),
      city: {
        name: location.name,
        country: location.country
      }
    };
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
} 