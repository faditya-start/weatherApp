import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className={`relative group ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className={`w-full px-6 py-4 text-lg rounded-2xl transition-all duration-300
            ${isDark 
              ? 'bg-gray-800/50 border border-gray-700 focus:border-blue-500 placeholder-gray-500' 
              : 'bg-white/50 border border-gray-200 focus:border-blue-500 placeholder-gray-400'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
            shadow-lg shadow-gray-900/5
            transform hover:scale-[1.01]`}
        />
        <button
          type="submit"
          className={`absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 rounded-xl
            transition-all duration-300 transform hover:scale-105
            ${isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;