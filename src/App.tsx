import { useState } from 'react'
import { WeatherCard } from './components/WeatherCard'
import { SearchBar } from './components/SearchBar'
import { getWeatherByCity } from './services/weatherService'
import { WeatherData } from './types/weather'
import './App.css'

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (city: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getWeatherByCity(city)
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Weather App</h1>
      <SearchBar onSearch={handleSearch} />
      
      <div className="mt-8">
        {loading && (
          <div className="text-white">Loading...</div>
        )}
        
        {error && (
          <div className="text-red-500 bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {weather && !loading && !error && (
          <WeatherCard weatherData={weather} />
        )}
      </div>
    </div>
  )
}

export default App
