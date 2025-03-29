import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { WeatherData } from './types/weather'
import { getWeatherByCity } from './services/weatherService'
import { SearchBar } from './components/searchBar'
import { WeatherCard } from './components/weatherCard'

function App() {
  const[weather, setWeather] = useState<WeatherData | null>(null);
  const[error, setError] = useState<string | null>(null);
  const[loading, setLoading] = useState(false);
  const handleSearch = async (city:string) => {
    try{
      setLoading(true);
      setError(null);
      const data  = await getWeatherByCity(city);
      setWeather(data);      
    }catch(error){
      setError(error instanceof Error ? error.message : "An error occured");
      setWeather(null);
    } finally{
      setLoading(false);
    }
  }

  return (
    <>
      <div className='min-h-screen bg-gray-900 text-white flex items-center justify-center'>
        <h1 className='text-4xl font-bold text-white mb-8'>Weather App</h1>
        <SearchBar onSearch={handleSearch} />
        <div className='mt-8'>
          {loading && <div className='text-center text-2xl'>Loading...</div>}
          {error && <div className='text-center text-red-500'>{error}</div>}
          {weather && !loading && !error && <WeatherCard weatherData={weather} />}
        </div>
      </div>
    </>
  )
}

export default App
