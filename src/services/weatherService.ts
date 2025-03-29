import axios from 'axios';
<<<<<<< HEAD
import { WeatherData, ForecastData } from '../types/weather';
=======
import { WeatherData, WeatherError } from '../types/weather';
>>>>>>> a2152b732d47246a9f808b96bd2eabd27c5dc2b8

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getWeatherByCity = async (city: string):Promise<WeatherData> => {
    try{
        const response = await axios.get<WeatherData>(`${BASE_URL}/weather`,{
            params:{
                q:city, 
                appid:API_KEY,
                units:"metric",
            }
        });
        return response.data;
    } catch (error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data?.message || "An error occurred while fetching weather data");        
        }
        throw error;
    }
};

export const getWeatherByCoordinates = async (lat:number, lon:number):Promise<WeatherData> => {
    try{
        const response = await axios.get<WeatherData>(`${BASE_URL}/weather`,{
            params:{
                lat,
                lon,
                appid:API_KEY,
                units:"metric",
            }
        });
        return response.data;
    } catch (error){
        if(axios.isAxiosError(error)){
            throw new Error(error.response?.data?.message || "An error occurred while fetching weather data");        
        }
        throw error;
    }
<<<<<<< HEAD
    throw error;
  }
};

export const getForecastByCity = async (city: string): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch forecast data');
    }
    throw error;
  }
};

export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastData> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch forecast data');
    }
    throw error;
  }
}; 
=======
};

>>>>>>> a2152b732d47246a9f808b96bd2eabd27c5dc2b8
