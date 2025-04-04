import React, { useState } from 'react'
import WeatherCard from './components/WeatherCard'
import { ForecastCard } from './components/ForecastCard'
import SearchBar from './components/SearchBar'
import { LocationButton } from './components/LocationButton'
import { ThemeToggle } from './components/ThemeToggle'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { getWeatherByCity, getForecastByCity, getWeatherByCoords, getForecastByCoords } from './services/weatherService'
import { getCurrentPosition } from './services/geolocationService'
import { WeatherData, ForecastData } from './types/weather'
import './App.css'
import LoadingSpinner from './components/LoadingSpinner'

const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const handleSearch = async (city: string) => {
    setLoading(true)
    setError(null)
    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeatherByCity(city),
        getForecastByCity(city)
      ])
      setWeatherData(weatherData)
      setForecast(forecastData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
      setWeatherData(null)
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
      setWeatherData(weatherData)
      setForecast(forecastData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location')
      setWeatherData(null)
      setForecast(null)
    } finally {
      setLocationLoading(false)
    }
  }

  React.useEffect(() => {
    handleLocationClick()
  }, [])

  return (
    <div className={`min-h-screen w-full fixed inset-0 transition-colors duration-300 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8 h-full overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center space-y-4">
            <h1 className={`text-4xl md:text-5xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Weather App
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Get real-time weather information for any city
            </p>
          </header>

          <SearchBar onSearch={handleSearch} />

          <main className="space-y-6">
            {loading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : error ? (
              <div className={`p-6 rounded-2xl text-center ${
                isDark 
                  ? 'bg-red-900/50 text-red-200' 
                  : 'bg-red-50 text-red-600'
              }`}>
                <p className="text-lg">{error}</p>
              </div>
            ) : weatherData ? (
              <div className="transform transition-all duration-500 ease-in-out">
                <WeatherCard data={weatherData} />
              </div>
            ) : (
              <div className={`min-h-[400px] flex items-center justify-center text-center p-6 rounded-2xl ${
                isDark 
                  ? 'bg-gray-800/50 text-gray-400' 
                  : 'bg-gray-100/50 text-gray-600'
              }`}>
                <p className="text-lg">
                  Enter a city name to get started
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <WeatherApp />
    </ThemeProvider>
  )
}

export default App
