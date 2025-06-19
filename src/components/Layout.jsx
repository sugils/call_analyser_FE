import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navbar />
      <main className="lg:ml-80 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default Layout;