import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className={`absolute w-full h-full rounded-full border-4 border-t-transparent
          ${isDark ? 'border-gray-700' : 'border-gray-200'}
          animate-spin`}
          style={{ animationDuration: '1.5s' }}
        />
        {/* Inner ring */}
        <div className={`absolute w-3/4 h-3/4 rounded-full border-4 border-t-transparent
          ${isDark ? 'border-blue-500' : 'border-blue-400'}
          animate-spin`}
          style={{ 
            animationDuration: '1s',
            top: '12.5%',
            left: '12.5%'
          }}
        />
        {/* Center dot */}
        <div className={`absolute w-1/4 h-1/4 rounded-full
          ${isDark ? 'bg-blue-500' : 'bg-blue-400'}
          animate-pulse`}
          style={{ 
            top: '37.5%',
            left: '37.5%'
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner; 