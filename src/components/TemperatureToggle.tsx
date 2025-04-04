import React from 'react';
import { useTemperature } from '../context/TemperatureContext';

export const TemperatureToggle: React.FC = () => {
  const { unit, toggleUnit } = useTemperature();
  
  return (
    <button
      onClick={toggleUnit}
      className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm
        hover:scale-105 active:scale-95 flex items-center gap-2
        bg-white/10 hover:bg-white/20 text-white shadow-lg"
    >
      {unit === 'celsius' ? '°C' : '°F'}
    </button>
  );
}; 