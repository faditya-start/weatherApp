import React, { useState } from 'react'
import WeatherCard from './components/WeatherCard'
import { ForecastCard } from './components/ForecastCard'
import SearchBar from './components/SearchBar'
import { ThemeToggle } from './components/ThemeToggle'
import { TemperatureToggle } from './components/TemperatureToggle'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { TemperatureProvider } from './context/TemperatureContext'
import { getWeatherByCity, getForecastByCity } from './services/weatherService'
import { WeatherData, ForecastData } from './types/weather'
import './App.css'
import LoadingSpinner from './components/LoadingSpinner'
import { LanguageProvider } from './context/LanguageContext'
import { LanguageToggle } from './components/LanguageToggle'

const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
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

  return (
    <div className={`min-h-screen w-full transition-all duration-500 ease-in-out ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-100 via-white to-blue-50'
    }`}>
      <div className="container mx-auto px-4 py-8 h-full overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="relative text-center space-y-4">
            <div className="absolute right-0 top-0 flex items-center gap-4">
              <LanguageToggle />
              <TemperatureToggle />
              <div className="transition-transform duration-300 hover:scale-110">
                <ThemeToggle />
              </div>
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Weather App
            </h1>
            <p className={`text-lg transition-colors duration-300 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
              Get real-time weather information for any city
            </p>
          </header>

          <SearchBar onSearch={handleSearch} />

          <main className="space-y-6">
            {loading ? (
              <div className="min-h-[400px] flex items-center justify-center animate-fadeIn">
                <LoadingSpinner size="large" />
              </div>
            ) : error ? (
              <div className={`p-6 rounded-3xl text-center transform transition-all duration-300 animate-slideIn backdrop-blur-sm ${
                isDark 
                  ? 'bg-blue-900/20 text-red-200 hover:bg-blue-900/30' 
                  : 'bg-blue-50/80 text-red-600 hover:bg-blue-100/90'
              }`}>
                <p className="text-lg">{error}</p>
              </div>
            ) : weatherData ? (
              <div className="transform transition-all duration-500 ease-out animate-slideUp space-y-6">
                <div className={`p-8 rounded-3xl shadow-lg backdrop-blur-sm ${
                  isDark 
                    ? 'bg-blue-900/20 hover:bg-blue-900/30' 
                    : 'bg-blue-50/80 hover:bg-blue-100/90'
                }`}>
                  <WeatherCard data={weatherData} />
                </div>
                {forecast && (
                  <div className={`p-8 rounded-3xl shadow-lg backdrop-blur-sm ${
                    isDark 
                      ? 'bg-blue-900/20 hover:bg-blue-900/30' 
                      : 'bg-blue-50/80 hover:bg-blue-100/90'
                  }`}>
                    <ForecastCard forecastData={forecast} />
                  </div>
                )}
              </div>
            ) : (
              <div className={`min-h-[400px] flex items-center justify-center text-center p-8 rounded-3xl transition-all duration-300 backdrop-blur-sm ${
                isDark 
                  ? 'bg-blue-900/20 text-gray-300 hover:bg-blue-900/30' 
                  : 'bg-blue-50/80 text-gray-600 hover:bg-blue-100/90'
              }`}>
                <p className="text-lg animate-pulse">
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
      <TemperatureProvider>
        <LanguageProvider>
          <WeatherApp />
        </LanguageProvider>
      </TemperatureProvider>
    </ThemeProvider>
  )
}

export default App
