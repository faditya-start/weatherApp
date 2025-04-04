import { WeatherData } from '../types/weather';
import { getWeatherIcon } from '../utils/weatherIcons';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1';

// Fetch options to handle CORS
const fetchOptions: RequestInit = {
  method: 'GET',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  }
};

interface Location {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

interface GeocodingResponse {
  results?: Location[];
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

interface OpenMeteoForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

export interface ForecastData {
  city: {
    name: string;
    country: string;
  };
  list: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
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

// Helper function to get coordinates
const getCoordinates = async (query: { city?: string; lat?: number; lon?: number }): Promise<Location> => {
  try {
    if (query.city) {
      const response = await fetch(
        `${GEOCODING_API_URL}/search?name=${encodeURIComponent(query.city)}&count=1`,
        fetchOptions
      );
      if (!response.ok) throw new Error('City not found');
      const data: GeocodingResponse = await response.json();
      if (!data.results?.[0]) throw new Error('City not found');
      return data.results[0];
    } else if (query.lat && query.lon) {
      const response = await fetch(
        `${GEOCODING_API_URL}/reverse?latitude=${query.lat}&longitude=${query.lon}`,
        fetchOptions
      );
      if (!response.ok) throw new Error('Location not found');
      const data: GeocodingResponse = await response.json();
      if (!data.results?.[0]) throw new Error('Location not found');
      return data.results[0];
    }
    throw new Error('Invalid query parameters');
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
};

// Get weather by city name
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  const coordinates = await getCoordinates({ city });
  return fetchWeather(coordinates);
};

// Get weather by coordinates
export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const coordinates = await getCoordinates({ lat, lon });
  return fetchWeather(coordinates);
};

// Get forecast by city name
export const getForecastByCity = async (city: string): Promise<ForecastData> => {
  const coordinates = await getCoordinates({ city });
  return fetchForecast(coordinates);
};

// Get forecast by coordinates
export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
  const coordinates = await getCoordinates({ lat, lon });
  return fetchForecast(coordinates);
};

// Base weather fetching function
const fetchWeather = async (coordinates: Location): Promise<WeatherData> => {
  try {
    const { latitude, longitude, name, country } = coordinates;

    const weatherResponse = await fetch(
      `${WEATHER_API_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,weather_code`,
      fetchOptions
    );

    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData: OpenMeteoResponse = await weatherResponse.json();
    const current = weatherData.current;

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

// Base forecast fetching function
const fetchForecast = async (coordinates: Location): Promise<ForecastData> => {
  try {
    const { latitude, longitude, name, country } = coordinates;

    const forecastResponse = await fetch(
      `${WEATHER_API_URL}/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`,
      fetchOptions
    );

    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const forecastData: OpenMeteoForecastResponse = await forecastResponse.json();

    return {
      city: {
        name,
        country
      },
      list: forecastData.daily.time.map((time, index) => ({
        dt: new Date(time).getTime() / 1000,
        temp: {
          min: forecastData.daily.temperature_2m_min[index],
          max: forecastData.daily.temperature_2m_max[index]
        },
        weather: [{
          main: weatherCodeToDescription(forecastData.daily.weather_code[index]),
          description: weatherCodeToDescription(forecastData.daily.weather_code[index]),
          icon: getWeatherIcon(forecastData.daily.weather_code[index])
        }]
      }))
    };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};
