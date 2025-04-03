import { useState, useEffect } from 'react'
import { WeatherCard } from './components/WeatherCard'
import { ForecastCard } from './components/ForecastCard'
import { SearchBar } from './components/SearchBar'
import { LocationButton } from './components/LocationButton'
import { ThemeToggle } from './components/ThemeToggle'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { getWeatherByCity, getForecastByCity, getWeatherByCoords, getForecastByCoords } from './services/weatherService'
import { getCurrentPosition } from './services/geolocationService'
import { WeatherData, ForecastData } from './types/weather'
import './App.css'
import { LoadingSpinner } from './components/LoadingSpinner'

function WeatherApp() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const { theme } = useTheme()

  const handleSearch = async (city: string) => {
    setLoading(true)
    setError(null)
    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCity(city),
        getForecastByCity(city)
      ])
      setWeather(weatherData)
      setForecast(forecastData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
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
      ])
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
    <div className={`min-h-screen p-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Weather App</h1>
          <ThemeToggle />
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/50 text-red-100' : 'bg-red-100 text-red-900'}`}>
            {error}
          </div>
        ) : weather ? (
          <>
            <WeatherCard weatherData={weather} />
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5-Day Forecast</h2>
              {forecast && <ForecastCard forecastData={forecast} />}
            </div>
          </>
        ) : (
          <div className={`text-center mt-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter a city name to get started
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <WeatherApp />
    </ThemeProvider>
  )
}

export default App
