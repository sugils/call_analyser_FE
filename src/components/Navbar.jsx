import { useState } from 'react';
import { 
  Phone, 
  Star, 
  BarChart4, 
  Users2, 
  PieChart, 
  CalendarDays, 
  LogOut, 
  Bell, 
  Settings, 
  MoonStar, 
  SunMedium,
  Home,
  Upload,
  Sparkles,
  GripVertical
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, setCurrentPage, isDarkMode, toggleTheme }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Theme variables
  const themes = {
    dark: {
      bg: 'bg-[#0f172a]',
      sidebarBg: 'bg-[#1e293b]',
      cardBg: 'bg-[#1e293b]',
      text: 'text-white',
      subtext: 'text-gray-400',
      border: 'border-gray-700/50',
      hover: 'hover:bg-white/5',
      barBg: 'bg-gray-700/50',
      gradients: {
        sidebar: 'from-indigo-900/40 to-purple-900/40',
        heading: 'from-indigo-400 to-purple-400',
      }
    },
    light: {
      bg: 'bg-gray-50',
      sidebarBg: 'bg-white',
      cardBg: 'bg-white',
      text: 'text-gray-800',
      subtext: 'text-gray-500',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100',
      barBg: 'bg-gray-200',
      gradients: {
        sidebar: 'from-indigo-100 to-purple-100',
        heading: 'from-indigo-600 to-purple-600',
      }
    }
  };

  const theme = isDarkMode ? themes.dark : themes.light;
  
  const navItems = [
    { name: 'Overview', icon: <Home className="w-5 h-5" />, page: 'overview' },
    { name: 'User Management', icon: <Users2 className="w-5 h-5" />, page: 'users' },
    { name: 'Analytics', icon: <BarChart4 className="w-5 h-5" />, page: 'analytics' },
    { name: 'Upload Audio', icon: <Upload className="w-5 h-5" />, page: 'upload' },
    { name: 'Calendar', icon: <CalendarDays className="w-5 h-5" />, page: 'calendar' },
    { name: 'Feedback', icon: <Sparkles className="w-5 h-5" />, page: 'feedback' },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`fixed left-0 top-0 h-full ${isCollapsed ? 'w-16' : 'w-20 lg:w-64'} ${theme.sidebarBg} shadow-lg z-10 flex flex-col transition-all duration-300 border-r ${theme.border}`}>
      {/* Toggle button for mobile */}
      <button 
        className="absolute -right-3 top-20 bg-indigo-600 rounded-full p-1 shadow-lg md:hidden"
        onClick={toggleSidebar}
      >
        <GripVertical className="w-4 h-4 text-white" />
      </button>
      
      {/* Logo */}
      <div className="p-4 flex items-center justify-center lg:justify-start">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-105">
          <Phone className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
        </div>
        <h1 className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent ml-3`}>
          VOICE.AI
        </h1>
      </div>
      
      {/* Navigation Items */}
      <div className="mt-10 flex-1">
        <div className="space-y-2 px-2">
          {navItems.map((item) => (
            <button 
              key={item.page}
              onClick={() => {
                setActiveTab(item.page);
                if (item.page !== 'overview') setCurrentPage(item.page);
                else setCurrentPage('dashboard');
              }}
              className={`w-full flex items-center py-3 px-4 rounded-xl ${
                activeTab === item.page 
                  ? `bg-gradient-to-r ${theme.gradients.sidebar} border-l-4 border-indigo-500` 
                  : theme.hover
              } transition-all duration-200 group`}
            >
              <div className={`${activeTab === item.page ? 'text-indigo-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'} transition-transform duration-200 group-hover:scale-110`}>
                {item.icon}
              </div>
              <span className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} ml-3 font-medium ${
                activeTab === item.page 
                  ? isDarkMode ? 'text-white' : 'text-indigo-600'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {item.name}
              </span>
              
              {/* Highlight indicator when collapsed */}
              {isCollapsed && activeTab === item.page && (
                <div className="absolute right-0 w-1 h-5 bg-indigo-500 rounded-l-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Bottom Actions */}
      <div className="p-4 space-y-3">
        {/* Theme toggle button */}
        <button 
          onClick={toggleTheme} 
          className={`w-full flex items-center justify-center lg:justify-start py-3 px-4 rounded-xl ${isDarkMode ? 'text-yellow-300 hover:bg-yellow-500/10' : 'text-indigo-600 hover:bg-indigo-500/10'} transition-all duration-200`}
        >
          {isDarkMode ? (
            <>
              <SunMedium className="w-5 h-5 hover:rotate-45 transition-transform duration-300" />
              <span className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} ml-3 font-medium`}>Light Mode</span>
            </>
          ) : (
            <>
              <MoonStar className="w-5 h-5 hover:rotate-12 transition-transform duration-300" />
              <span className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} ml-3 font-medium`}>Dark Mode</span>
            </>
          )}
        </button>
        
        {/* Logout button */}
        <button 
          onClick={() => setCurrentPage('login')} 
          className={`w-full flex items-center justify-center lg:justify-start py-3 px-4 rounded-xl ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-red-500/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-500/10'} transition-all duration-200 group`}
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          <span className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} ml-3 font-medium`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;