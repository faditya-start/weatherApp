import { useState, useEffect } from 'react'
import { WeatherCard } from './components/WeatherCard'
import { ForecastCard } from './components/ForecastCard'
import { SearchBar } from './components/SearchBar'
import { LocationButton } from './components/LocationButton'
import { getWeatherByCity, getForecastByCity, getWeatherByCoords, getForecastByCoords } from './services/weatherService'
import { getCurrentPosition } from './services/geolocationService'
import { WeatherData, ForecastData } from './types/weather'
import './App.css'

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)

  const handleSearch = async (city: string) => {
    try {
      setLoading(true)
      setError(null)
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCity(city),
        getForecastByCity(city)
      ]);
      setWeather(weatherData)
      setForecast(forecastData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setWeather(null)
      setForecast(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLocationClick = async () => {
    try {
      setLocationLoading(true)
      setError(null)
      const position = await getCurrentPosition()
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCoords(position.latitude, position.longitude),
        getForecastByCoords(position.latitude, position.longitude)
      ]);
      setWeather(weatherData)
      setForecast(forecastData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location')
      setWeather(null)
      setForecast(null)
    } finally {
      setLocationLoading(false)
    }
  }

  useEffect(() => {
    handleLocationClick()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Weather App</h1>
      <div className="flex gap-4 w-full max-w-md">
        <SearchBar onSearch={handleSearch} />
        <LocationButton onLocationClick={handleLocationClick} isLoading={locationLoading} />
      </div>
      
      <div className="mt-8 w-full max-w-4xl">
        {(loading || locationLoading) && (
          <div className="text-white text-center">Loading...</div>
        )}
        
        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {weather && !loading && !locationLoading && !error && (
          <>
            <WeatherCard weatherData={weather} />
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">5-Day Forecast</h2>
              {forecast && <ForecastCard forecastData={forecast} />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
