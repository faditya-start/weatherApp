import axios from 'axios';
import { WeatherData, WeatherError } from '../types/weather';

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
};

