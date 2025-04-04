export type TemperatureUnit = 'C' | 'F';

export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return ((fahrenheit - 32) * 5) / 9;
};

export const formatTemperature = (temp: number, unit: TemperatureUnit): string => {
  if (isNaN(temp)) return `--°${unit}`;
  const temperature = unit === 'F' ? celsiusToFahrenheit(temp) : temp;
  return `${roundTemperature(temperature)}°${unit}`;
};

export const roundTemperature = (temp: number): number => {
  if (isNaN(temp)) return 0;
  return Math.round(temp * 10) / 10;
};

export const convertTemperature = (temp: number, from: TemperatureUnit, to: TemperatureUnit): number => {
  if (from === to) return temp;
  return from === 'C' ? celsiusToFahrenheit(temp) : fahrenheitToCelsius(temp);
}; 