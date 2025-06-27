import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  MoonStar, 
  SunMedium,
  GripVertical,
  Zap,
  Users,
  Mic,
  MessageSquare,
  Crown,
  Rocket,
  Sparkles,
  TrendingUp,
  Target,
  Award,
  Brain,
  Waves,
  Headphones,
  Activity
} from 'lucide-react';
import apiService from './apiService';

const Navbar = ({ activeTab, setActiveTab, setCurrentPage, isDarkMode, toggleTheme }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    total_users: 0,
    active_trainees: 0,
    avg_team_rating: 0,
    total_calls_today: 0,
    improvement_rate: 0,
    weekly_progress: 0
  });
  
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
    { 
      name: 'Overview', 
      icon: <Zap className="w-5 h-5" />, 
      page: 'overview',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Dashboard insights'
    },
    { 
      name: 'Team Members', 
      icon: <Users className="w-5 h-5" />, 
      page: 'users',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Manage your team'
    },
    { 
      name: 'Voice Analysis', 
      icon: <Mic className="w-5 h-5" />, 
      page: 'upload',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Upload & analyze'
    },
    { 
      name: 'AI Insights', 
      icon: <MessageSquare className="w-5 h-5" />, 
      page: 'feedback',
      gradient: 'from-orange-500 to-red-500',
      description: 'Performance feedback'
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await apiService.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };

    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`fixed left-0 top-0 h-full ${isCollapsed ? 'w-16' : 'w-30 lg:w-56'} ${theme.sidebarBg} shadow-xl z-50 flex flex-col transition-all duration-300 border-r ${theme.border}`}>
      {/* Toggle button for mobile */}
      <button 
        className="absolute -right-3 top-20 bg-indigo-600 rounded-full p-1 shadow-lg md:hidden"
        onClick={toggleSidebar}
      >
        <GripVertical className="w-4 h-4 text-white" />
      </button>
      
      {/* Logo */}
      <div className="p-3 flex items-center justify-center lg:justify-start">
        <div className="relative">
          <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center shadow-xl group transition-all duration-500 hover:shadow-blue-500/20 hover:scale-110 border-2 border-slate-600/50">
            <div className="relative">
              <Activity className="w-5 h-5 lg:w-5 lg:h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          {/* Subtle pulse animation */}
          <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
        </div>
        <div className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} ml-2`}>
          <h1 className="text-lg font-black text-white">
            CALL<span className="text-blue-400">AI</span>
          </h1>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <p className={`text-xs ${theme.subtext} font-semibold tracking-wide`}>Analytics</p>
          </div>
        </div>
      </div>
      
      
      {/* Navigation Items */}
      <div className="mt-4 flex-1 px-3">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button 
              key={item.page}
              onClick={() => {
                setActiveTab(item.page);
                if (item.page !== 'overview') setCurrentPage(item.page);
                else setCurrentPage('dashboard');
              }}
              className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                activeTab === item.page 
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-l-4 border-indigo-500 shadow-lg scale-105' 
                  : `${theme.hover} hover:scale-102`
              }`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative flex items-center py-3 px-3">
                {/* Icon with gradient background */}
                <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} ${
                  activeTab === item.page ? 'shadow-lg scale-110' : 'shadow-md'
                } transition-all duration-300 group-hover:scale-110 flex-shrink-0`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                
                <div className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} ml-3 flex-1 min-w-0`}>
                  <div className="text-left">
                    <span className={`block font-semibold text-sm ${
                      activeTab === item.page 
                        ? isDarkMode ? 'text-white' : 'text-indigo-600'
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>
                    <span className={`text-xs block truncate ${
                      activeTab === item.page 
                        ? isDarkMode ? 'text-indigo-300' : 'text-indigo-500'
                        : theme.subtext
                    }`}>
                      {item.description}
                    </span>
                  </div>
                </div>
                
                {/* Active indicator */}
                {activeTab === item.page && (
                  <div className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} ml-2 flex-shrink-0`}>
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* Highlight indicator when collapsed */}
              {isCollapsed && activeTab === item.page && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-l-full"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* Performance Badge */}
       
      </div>
      
      {/* Bottom Actions */}
      <div className="p-3 space-y-2 border-t border-gray-700/20">
        {/* Quick Stats */}
        <div className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 animate-pulse"></div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className={`${theme.subtext} font-bold`}>AI PRECISION</span>
            <div className="flex items-center gap-1">
              <Rocket className="w-3 h-3 text-cyan-500 animate-pulse" />
              <Brain className="w-3 h-3 text-indigo-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-black bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              99.2%
            </div>
            <div className="text-xs">
              <div className="text-cyan-500 font-bold">ACCURACY</div>
              <div className={`${theme.subtext}`}>Real-time</div>
            </div>
          </div>
        </div>
        
        {/* Theme toggle button */}
        <button 
          onClick={toggleTheme} 
          className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${isDarkMode ? 'bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20' : 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20'}`}
        >
          <div className="flex items-center justify-center lg:justify-start py-2.5 px-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
              {isDarkMode ? (
                <SunMedium className="w-4 h-4 text-white" />
              ) : (
                <MoonStar className="w-4 h-4 text-white" />
              )}
            </div>
            <div className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} ml-3 text-left min-w-0`}>
              <span className={`block text-sm font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-indigo-600'}`}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
              <span className={`text-xs ${theme.subtext} block truncate`}>
                {isDarkMode ? 'Switch to light' : 'Switch to dark'}
              </span>
            </div>
          </div>
        </button>
        
        {/* Logout button */}
        <button 
          onClick={() => setCurrentPage('login')} 
          className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20`}
        >
          <div className="flex items-center justify-center lg:justify-start py-2.5 px-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            <div className={`${isCollapsed ? 'hidden' : 'hidden lg:block'} ml-3 text-left min-w-0`}>
              <span className="block text-sm font-semibold text-red-400">Logout</span>
              <span className={`text-xs ${theme.subtext} block truncate`}>Sign out safely</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;