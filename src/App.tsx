import { useState } from 'react'
import { WeatherCard } from './components/WeatherCard'
import { ForecastCard } from './components/ForecastCard'
import { SearchBar } from './components/SearchBar'
import { getWeatherByCity, getForecastByCity } from './services/weatherService'
import { WeatherData, ForecastData } from './types/weather'
import './App.css'

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Weather App</h1>
      <SearchBar onSearch={handleSearch} />
      
      <div className="mt-8 w-full max-w-4xl">
        {loading && (
          <div className="text-white text-center">Loading...</div>
        )}
        
        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {weather && !loading && !error && (
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
