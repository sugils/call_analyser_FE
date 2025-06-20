import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Star, 
  ChevronRight, 
  Users2, 
  BarChart4, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
  Eye,
  LayoutDashboard,
  Target,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Loader,
  RefreshCw
} from 'lucide-react';
import apiService from './apiService';

const Dashboard = ({ setCurrentPage, navigateToUserDashboard }) => {
  // State for dynamic data
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeTrainees: 0,
    avgTeamRating: 0,
    totalCallsToday: 0,
    improvementRate: 0,
    weeklyProgress: 0
  });

  const [topPerformers, setTopPerformers] = useState([]);
  const [needsAttention, setNeedsAttention] = useState([]);
  const [recentTrainingActivities, setRecentTrainingActivities] = useState([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [
        dashboardStats,
        topPerformersData,
        needsAttentionData,
        feedbackSessions
      ] = await Promise.all([
        apiService.getDashboardStats().catch(() => ({
          totalUsers: 0,
          activeTrainees: 0,
          avgTeamRating: 0,
          totalCallsToday: 0,
          improvementRate: 0,
          weeklyProgress: 0
        })),
        apiService.getTopPerformers().catch(() => []),
        apiService.getNeedsAttention().catch(() => []),
        apiService.getFeedbackSessions(null, 10).catch(() => [])
      ]);

      // Update metrics with fallback values
      setMetrics({
        totalUsers: dashboardStats.totalUsers || 0,
        activeTrainees: dashboardStats.activeTrainees || 0,
        avgTeamRating: dashboardStats.avgTeamRating || 0,
        totalCallsToday: dashboardStats.totalCallsToday || 0,
        improvementRate: dashboardStats.improvementRate || 0,
        weeklyProgress: dashboardStats.weeklyProgress || 0
      });

      // Update top performers
      setTopPerformers(topPerformersData || []);

      // Update users needing attention
      setNeedsAttention(needsAttentionData || []);

      // Generate recent activities from feedback sessions
      const activities = generateActivitiesFromSessions(feedbackSessions || []);
      setRecentTrainingActivities(activities);

      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      
      // Set default values even on error
      setMetrics({
        totalUsers: 0,
        activeTrainees: 0,
        avgTeamRating: 0,
        totalCallsToday: 0,
        improvementRate: 0,
        weeklyProgress: 0
      });
      setTopPerformers([]);
      setNeedsAttention([]);
      setRecentTrainingActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate training activities from feedback sessions
  const generateActivitiesFromSessions = (sessions) => {
    const activities = [];
    
    sessions.forEach((session, index) => {
      if (activities.length >= 4) return; // Limit to 4 activities
      
      const timeAgo = getTimeAgo(new Date(session.created_at));
      
      // Generate different types of activities based on session data
      if (session.overall_rating >= 4.5) {
        activities.push({
          id: session.id,
          user: session.user_name,
          activity: `achieved ${session.overall_rating}/5.0 rating in call analysis`,
          time: timeAgo,
          type: 'achievement',
          icon: <Award className="w-5 h-5 text-white" />,
          color: 'bg-yellow-500'
        });
      } else if (session.overall_rating >= 4.0) {
        activities.push({
          id: session.id,
          user: session.user_name,
          activity: 'completed call performance analysis',
          time: timeAgo,
          type: 'training',
          icon: <CheckCircle className="w-5 h-5 text-white" />,
          color: 'bg-green-500'
        });
      } else if (session.processing_status === 'completed') {
        activities.push({
          id: session.id,
          user: session.user_name,
          activity: 'requested feedback for call performance',
          time: timeAgo,
          type: 'request',
          icon: <Phone className="w-5 h-5 text-white" />,
          color: 'bg-blue-500'
        });
      } else if (session.processing_status === 'failed') {
        activities.push({
          id: session.id,
          user: session.user_name,
          activity: 'had technical issues with call analysis',
          time: timeAgo,
          type: 'alert',
          icon: <XCircle className="w-5 h-5 text-white" />,
          color: 'bg-red-500'
        });
      }
    });

    return activities;
  };

  // Helper function to get time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Navigate to individual user dashboard
  const viewUserDashboard = (userId) => {
    if (navigateToUserDashboard) {
      navigateToUserDashboard(userId);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Theme configuration
  const themes = {
    dark: {
      bg: 'bg-[#0f172a]',
      cardBg: 'bg-[#1e293b]',
      text: 'text-white',
      subtext: 'text-gray-400',
      border: 'border-gray-700/50',
      hover: 'hover:bg-white/5'
    },
    light: {
      bg: 'bg-gray-50',
      cardBg: 'bg-white',
      text: 'text-gray-800',
      subtext: 'text-gray-500',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100'
    }
  };

  const theme = isDarkMode ? themes.dark : themes.light;

  // Loading state
  if (isLoading && !lastUpdated) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans overflow-hidden transition-colors duration-300`}>
        <div className="ml-20 lg:ml-64 p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-500" />
              <h3 className="text-xl font-semibold mb-2">Loading Dashboard</h3>
              <p className={theme.subtext}>Fetching latest performance data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !lastUpdated) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans overflow-hidden transition-colors duration-300`}>
        <div className="ml-20 lg:ml-64 p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2">Failed to Load Dashboard</h3>
              <p className={`${theme.subtext} mb-4`}>{error}</p>
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans overflow-hidden transition-colors duration-300`}>
      {/* Main Content */}
      <div className="ml-20 lg:ml-64 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              <LayoutDashboard className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              Training Dashboard
              {isLoading && (
                <Loader className="w-5 h-5 animate-spin ml-3 text-indigo-400" />
              )}
            </h2>
            <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} mt-1`}>
              Monitor team performance and training progress
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className={`text-sm ${theme.subtext}`}>
                {lastUpdated ? 'Last Updated' : 'Today\'s Date'}
              </p>
              <p className="font-semibold">
                {lastUpdated 
                  ? lastUpdated.toLocaleTimeString()
                  : new Date().toLocaleDateString()
                }
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className={`p-2 rounded-lg transition-colors ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white/10'
              }`}
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && lastUpdated && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-300">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Warning</span>
            </div>
            <p className="text-red-200 text-sm mt-1">
              Failed to fetch latest data: {error}. Showing cached data from {lastUpdated.toLocaleTimeString()}.
            </p>
          </div>
        )}

        {/* Key Training Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Trainees */}
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur-sm border border-indigo-500/20' : 'bg-white border border-indigo-100 shadow-md'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600 rounded-full ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} text-sm font-medium`}>Total Trainees</p>
                  <p className={`text-4xl font-bold mt-2 ${isDarkMode ? '' : 'text-gray-800'}`}>{metrics.totalUsers || 0}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-110">
                  <Users2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} text-sm font-medium`}>
                  {metrics.activeTrainees || 0} active today
                </span>
              </div>
            </div>
          </div>

          {/* Team Average Rating */}
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-pink-600/10 to-red-600/10 backdrop-blur-sm border border-pink-500/20' : 'bg-white border border-pink-100 shadow-md'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-pink-600 rounded-full ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`${isDarkMode ? 'text-pink-300' : 'text-pink-600'} text-sm font-medium`}>Team Avg Rating</p>
                  <p className={`text-4xl font-bold mt-2 ${isDarkMode ? '' : 'text-gray-800'}`}>{(metrics.avgTeamRating || 0).toFixed(1)}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-pink-600 to-red-600 rounded-xl shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300 group-hover:scale-110">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{(metrics.weeklyProgress || 0)}% this week
                </span>
              </div>
            </div>
          </div>

          {/* Improvement Rate */}
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-sm border border-green-500/20' : 'bg-white border border-green-100 shadow-md'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-green-600 rounded-full ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`${isDarkMode ? 'text-green-300' : 'text-green-600'} text-sm font-medium`}>Improvement Rate</p>
                  <p className={`text-4xl font-bold mt-2 ${isDarkMode ? '' : 'text-gray-800'}`}>{Math.round(metrics.improvementRate || 0)}%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-110">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} text-sm font-medium`}>
                  {topPerformers.length} trainees improving
                </span>
              </div>
            </div>
          </div>

          {/* Today's Calls */}
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-amber-600/10 to-orange-600/10 backdrop-blur-sm border border-amber-500/20' : 'bg-white border border-amber-100 shadow-md'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-amber-600 rounded-full ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`${isDarkMode ? 'text-amber-300' : 'text-amber-600'} text-sm font-medium`}>Today's Calls</p>
                  <p className={`text-4xl font-bold mt-2 ${isDarkMode ? '' : 'text-gray-800'}`}>{metrics.totalCallsToday || 0}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300 group-hover:scale-110">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  vs yesterday
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.border} relative overflow-hidden transition-all duration-300`}>
            <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
              <Award className={`mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
              Top Performers
            </h3>
            
            {topPerformers.length > 0 ? (
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.id} className={`flex items-center justify-between p-4 rounded-xl ${theme.hover} transition-all duration-300 group`}>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">{performer.avatar}</span>
                        </div>
                        {index === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-xs">👑</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{performer.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-sm">{(performer.rating || 0).toFixed(1)}</span>
                          </div>
                          <span className="text-green-500 text-sm font-medium">{performer.improvement}</span>
                          <span className={`text-xs ${theme.subtext}`}>{performer.calls_today} calls today</span>
                        </div>
                        <p className={`text-xs ${theme.subtext} mt-1`}>Best at: {performer.strongest_skill}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => viewUserDashboard(performer.id)}
                      className={`${isDarkMode ? 'text-green-400 hover:bg-green-400/10' : 'text-green-600 hover:bg-green-600/10'} p-2 rounded-lg transition-all group-hover:scale-110`}
                      title="View Dashboard"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${theme.subtext}`}>
                <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No performance data available yet</p>
                <p className="text-sm mt-1">Users will appear here after completing call analyses</p>
              </div>
            )}
            
            <div className={`mt-6 pt-4 border-t ${theme.border} flex items-center justify-between`}>
              <span className={`text-sm ${theme.subtext}`}>
                {topPerformers.length > 0 ? 'Outstanding work this week!' : 'Get started with call analysis'}
              </span>
              <button 
                onClick={() => setCurrentPage('users')}
                className={`${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'} text-sm transition-colors flex items-center`}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Needs Attention */}
          <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.border} relative overflow-hidden transition-all duration-300`}>
            <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
              <AlertTriangle className={`mr-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
              Needs Attention
            </h3>
            
            {needsAttention.length > 0 ? (
              <div className="space-y-4">
                {needsAttention.map((user) => (
                  <div key={user.id} className={`flex items-center justify-between p-4 rounded-xl ${theme.hover} transition-all duration-300 group border-l-4 ${user.priority === 'high' ? 'border-red-500' : 'border-orange-500'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">{user.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{user.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.priority === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                            {user.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                            <span className="font-bold text-sm">{(user.rating || 0).toFixed(1)}</span>
                          </div>
                          <span className="text-red-500 text-sm font-medium flex items-center">
                            <TrendingDown className="w-4 h-4 mr-1" />
                            {user.decline}
                          </span>
                          <span className={`text-xs ${theme.subtext}`}>{user.calls_today} calls today</span>
                        </div>
                        <p className={`text-xs ${theme.subtext} mt-1`}>Needs help with: {user.weakest_skill}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewUserDashboard(user.id)}
                        className={`${isDarkMode ? 'text-orange-400 hover:bg-orange-400/10' : 'text-orange-600 hover:bg-orange-600/10'} p-2 rounded-lg transition-all group-hover:scale-110`}
                        title="View Dashboard"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${theme.subtext}`}>
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                <p>Great job! No users need immediate attention.</p>
                <p className="text-sm mt-1">All team members are performing well</p>
              </div>
            )}
            
            <div className={`mt-6 pt-4 border-t ${theme.border} flex items-center justify-between`}>
              <span className={`text-sm ${theme.subtext}`}>
                {needsAttention.length > 0 ? 'Schedule coaching sessions' : 'Keep up the great work!'}
              </span>
              <button 
                onClick={() => setCurrentPage('users')}
                className={`${isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-500'} text-sm transition-colors flex items-center`}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Training Activities */}
        <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.border} transition-all duration-300`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
              <Clock className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
              Recent Training Activities
            </h3>
            <button 
              onClick={() => setCurrentPage('feedback')}
              className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} text-sm transition-colors flex items-center`}
            >
              View All Activities
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          {recentTrainingActivities.length > 0 ? (
            <div className="space-y-4">
              {recentTrainingActivities.map((item) => (
                <div key={item.id} className={`flex items-start p-4 rounded-xl ${theme.hover} transition-colors group`}>
                  <div className={`p-3 ${item.color} rounded-xl mr-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                      <span className="font-semibold">{item.user}</span> {item.activity}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className={theme.subtext + ' text-sm'}>{item.time}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'training' ? 'bg-green-500/20 text-green-500' :
                        item.type === 'achievement' ? 'bg-yellow-500/20 text-yellow-500' :
                        item.type === 'request' ? 'bg-blue-500/20 text-blue-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${theme.subtext}`}>
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent activities</p>
              <p className="text-sm mt-1">Activities will appear here as users complete analyses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;