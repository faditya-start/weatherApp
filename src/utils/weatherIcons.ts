// Map weather codes to icon names (using same names as OpenWeather icons for compatibility)
export const getWeatherIcon = (code: number): string => {
  // Clear
  if (code === 0) return '01d';
  // Mainly clear, partly cloudy
  if (code === 1 || code === 2) return '02d';
  // Overcast
  if (code === 3) return '04d';
  // Fog
  if (code === 45 || code === 48) return '50d';
  // Drizzle
  if (code >= 51 && code <= 55) return '09d';
  // Rain
  if (code >= 61 && code <= 65) return '10d';
  // Snow
  if (code >= 71 && code <= 77) return '13d';
  // Rain showers
  if (code >= 80 && code <= 82) return '09d';
  // Snow showers
  if (code >= 85 && code <= 86) return '13d';
  // Thunderstorm
  if (code >= 95) return '11d';
  
  return '01d'; // Default to clear sky
}; 