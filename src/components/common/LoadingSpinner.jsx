// components/common/LoadingSpinner.jsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  const { isDarkMode } = useTheme();

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full`}></div>
          {/* Inner spinning ring */}
          <div className={`${sizeClasses[size]} border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin absolute top-0 left-0`}></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <p className={`${textSizeClasses[size]} font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {text}
          </p>
          <div className="flex justify-center mt-2 space-x-1">
            <div className={`w-2 h-2 ${
              isDarkMode ? 'bg-blue-400' : 'bg-blue-500'
            } rounded-full animate-bounce`}></div>
            <div className={`w-2 h-2 ${
              isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
            } rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`w-2 h-2 ${
              isDarkMode ? 'bg-pink-400' : 'bg-pink-500'
            } rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;