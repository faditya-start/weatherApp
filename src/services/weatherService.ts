import { WeatherData } from '../types/weather';
import { getWeatherIcon } from '../utils/weatherIcons';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1';

interface GeocodingResponse {
  results?: {
    latitude: number;
    longitude: number;
    name: string;
    country: string;
  }[];
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    pressure_msl: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

const weatherCodeToDescription = (code: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return weatherCodes[code] || 'Unknown';
};

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  try {
    // First, get coordinates from city name
    const geocodingResponse = await fetch(
      `${GEOCODING_API_URL}/search?name=${encodeURIComponent(city)}&count=1`
    );
    
    if (!geocodingResponse.ok) {
      throw new Error('City not found');
    }

    const geocodingData: GeocodingResponse = await geocodingResponse.json();
    
    if (!geocodingData.results?.[0]) {
      throw new Error('City not found');
    }

    const { latitude, longitude, name, country } = geocodingData.results[0];

    // Then, get weather data using coordinates
    const weatherResponse = await fetch(
      `${WEATHER_API_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,weather_code`
    );

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData: OpenMeteoResponse = await weatherResponse.json();
    const current = weatherData.current;

    // Transform the data to match our WeatherData interface
    return {
      name,
      sys: { country },
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl
      },
      wind: {
        speed: current.wind_speed_10m
      },
      weather: [{
        main: weatherCodeToDescription(current.weather_code),
        description: weatherCodeToDescription(current.weather_code),
        icon: getWeatherIcon(current.weather_code)
      }]
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};
