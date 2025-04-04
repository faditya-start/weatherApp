import React, { createContext, useContext, useState, useEffect } from 'react';

type TemperatureUnit = 'celsius' | 'fahrenheit';

interface TemperatureContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  convertTemperature: (celsius: number) => number;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(undefined);

export const useTemperature = () => {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};

export const TemperatureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const savedUnit = localStorage.getItem('temperatureUnit');
    return (savedUnit as TemperatureUnit) || 'celsius';
  });

  useEffect(() => {
    localStorage.setItem('temperatureUnit', unit);
  }, [unit]);

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const convertTemperature = (celsius: number): number => {
    if (unit === 'celsius') return celsius;
    return Math.round((celsius * 9/5) + 32);
  };

  return (
    <TemperatureContext.Provider value={{ unit, toggleUnit, convertTemperature }}>
      {children}
    </TemperatureContext.Provider>
  );
}; 