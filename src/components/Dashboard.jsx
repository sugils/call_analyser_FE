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
  RefreshCw,
  Building2,
  Crown,
  Shield,
  Activity,
  PieChart,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

// Import your actual API service
import apiService from './apiService';

const Dashboard = ({ setCurrentPage = () => {}, navigateToUserDashboard = () => {} }) => {
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
  
  // Team insights state
  const [teamInsights, setTeamInsights] = useState({
    team_insights: [],
    team_lead_insights: [],
    overall_insights: {},
    skills_by_team: {}
  });
  
  const [skillsMatrix, setSkillsMatrix] = useState({
    skills_matrix: {},
    teams: [],
    skills: []
  });
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Fetching enhanced dashboard data...');

      // Use the enhanced dashboard data method
      const enhancedData = await apiService.getEnhancedDashboardData();

      console.log('📊 Enhanced dashboard data received:', enhancedData);

      // Extract data from enhanced response
      const {
        dashboardStats,
        teamInsights: teamInsightsData,
        skillsMatrix: skillsMatrixData,
        topPerformers: topPerformersData,
        needsAttention: needsAttentionData,
        feedbackSessions
      } = enhancedData;

      // Update metrics with received data
      setMetrics({
        totalUsers: dashboardStats?.total_users || 0,
        activeTrainees: dashboardStats?.active_trainees || 0,
        avgTeamRating: dashboardStats?.avg_team_rating || 0,
        totalCallsToday: dashboardStats?.total_calls_today || 0,
        improvementRate: dashboardStats?.improvement_rate || 0,
        weeklyProgress: dashboardStats?.weekly_progress || 0
      });

      // Update existing data
      setTopPerformers(topPerformersData || []);
      setNeedsAttention(needsAttentionData || []);

      // Update team insights - check if data is available
      if (teamInsightsData && teamInsightsData.success) {
        console.log('✅ Setting team insights data:', teamInsightsData);
        setTeamInsights(teamInsightsData);
      } else {
        console.log('⚠️ No team insights data, using default');
        setTeamInsights({
          team_insights: [],
          team_lead_insights: [],
          overall_insights: {},
          skills_by_team: {}
        });
      }

      // Update skills matrix - check if data is available
      if (skillsMatrixData && skillsMatrixData.success) {
        console.log('✅ Setting skills matrix data:', skillsMatrixData);
        setSkillsMatrix(skillsMatrixData);
      } else {
        console.log('⚠️ No skills matrix data, using default');
        setSkillsMatrix({
          skills_matrix: {},
          teams: [],
          skills: []
        });
      }

      // Generate recent activities from feedback sessions
      const activities = generateActivitiesFromSessions(feedbackSessions || []);
      setRecentTrainingActivities(activities);

      setLastUpdated(new Date());
      
      console.log('✅ Enhanced dashboard data updated successfully');
      
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
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
      if (activities.length >= 4) return;
      
      const timeAgo = getTimeAgo(new Date(session.created_at));
      
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
    console.log('🚀 Enhanced Dashboard component mounted, fetching data...');
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data...');
      fetchDashboardData();
    }, 5 * 60 * 1000);
    
    return () => {
      console.log('🧹 Cleaning up refresh interval');
      clearInterval(refreshInterval);
    };
  }, []);

  // Navigate to individual user dashboard
  const viewUserDashboard = (userId) => {
    console.log('👤 Navigating to user dashboard:', userId);
    if (navigateToUserDashboard) {
      navigateToUserDashboard(userId);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    fetchDashboardData();
  };

  // Get performance grade color
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-500 text-white';
      case 'A': return 'bg-green-400 text-white';
      case 'B+': return 'bg-blue-500 text-white';
      case 'B': return 'bg-blue-400 text-white';
      case 'C': return 'bg-yellow-500 text-white';
      case 'D': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Get trend icon
  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
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

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2 rounded-md transition-all font-medium ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-6 py-2 rounded-md transition-all font-medium ${
              activeTab === 'teams'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Team Insights
          </button>
          <button
            onClick={() => setActiveTab('leaders')}
            className={`px-6 py-2 rounded-md transition-all font-medium ${
              activeTab === 'leaders'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Team Leaders
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-2 rounded-md transition-all font-medium ${
              activeTab === 'skills'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Skills Matrix
          </button>
        </div>

        {/* Debug Section - REMOVE IN PRODUCTION */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <h4 className="text-blue-300 font-medium mb-2">Debug Info (Development Only)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-200">Team Insights:</span>
                <span className="ml-2 font-mono text-blue-100">{teamInsights.team_insights?.length || 0} teams</span>
              </div>
              <div>
                <span className="text-blue-200">Team Leaders:</span>
                <span className="ml-2 font-mono text-blue-100">{teamInsights.team_lead_insights?.length || 0} leaders</span>
              </div>
              <div>
                <span className="text-blue-200">Skills Matrix:</span>
                <span className="ml-2 font-mono text-blue-100">{skillsMatrix.teams?.length || 0} teams</span>
              </div>
              <div>
                <span className="text-blue-200">API Status:</span>
                <span className="ml-2 font-mono text-blue-100">{error ? 'Error' : 'OK'}</span>
              </div>
            </div>
            <button
              onClick={async () => {
                console.log('🧪 Testing API connectivity...');
                const testResults = await apiService.testTeamInsightsConnectivity();
                console.log('🧪 API test results:', testResults);
                alert('Check console for API test results');
              }}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Test API Connectivity
            </button>
          </div>
        )}
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Training Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Trainees */}
              <div className={`${isDarkMode ? 'bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur-sm border border-indigo-500/20' : 'bg-white border border-indigo-100 shadow-md'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
                <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600 rounded-full ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} text-sm font-medium`}>Total Trainees</p>
                      <p className={`text-4xl font-bold mt-2 ${isDarkMode ? '' : 'text-gray-800'}`}>{metrics.totalUsers}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-110">
                      <Users2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} text-sm font-medium`}>
                      {metrics.activeTrainees} active today
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
                  Top Performers ({topPerformers.length})
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
                    <p>No top performers available yet</p>
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
                  Needs Attention ({needsAttention.length})
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
                  Recent Training Activities ({recentTrainingActivities.length})
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
          </>
        )}

        {/* Team Insights Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-8">
            {/* Team Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme.subtext}`}>Total Teams</p>
                    <p className="text-2xl font-bold">{teamInsights.overall_insights?.total_teams || 0}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
              
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme.subtext}`}>High Performing</p>
                    <p className="text-2xl font-bold text-green-500">{teamInsights.overall_insights?.high_performing_teams || 0}</p>
                  </div>
                  <Award className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme.subtext}`}>Need Attention</p>
                    <p className="text-2xl font-bold text-orange-500">{teamInsights.overall_insights?.teams_needing_attention || 0}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme.subtext}`}>Avg Team Rating</p>
                    <p className="text-2xl font-bold">{teamInsights.overall_insights?.avg_team_rating || 0}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Team Performance List */}
            <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.border}`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                <Building2 className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                Team Performance Rankings
              </h3>
              
              {teamInsights.team_insights?.length > 0 ? (
                <div className="space-y-4">
                  {teamInsights.team_insights.map((team, index) => (
                    <div key={team.team_id} className={`p-6 rounded-xl ${theme.hover} transition-all duration-300 group border-l-4 ${
                      team.grade === 'A+' ? 'border-green-500' :
                      team.grade === 'A' ? 'border-green-400' :
                      team.grade === 'B+' ? 'border-blue-500' :
                      team.grade === 'B' ? 'border-blue-400' :
                      team.grade === 'C' ? 'border-yellow-500' :
                      'border-red-500'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">#{index + 1}</span>
                            </div>
                            <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${getGradeColor(team.grade)}`}>
                              {team.grade}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">{team.team_name}</h4>
                            <p className={`text-sm ${theme.subtext}`}>{team.status} • {team.total_members} members</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-sm">{team.avg_rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {getTrendIcon(team.improvement_rate)}
                                <span className={`text-sm font-medium ${
                                  team.improvement_rate > 0 ? 'text-green-500' : 
                                  team.improvement_rate < 0 ? 'text-red-500' : 
                                  'text-gray-500'
                                }`}>
                                  {team.improvement_rate > 0 ? '+' : ''}{team.improvement_rate}%
                                </span>
                              </div>
                              <span className={`text-xs ${theme.subtext}`}>
                                {team.calls_this_week} calls this week
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className={`${theme.subtext} text-xs`}>Strongest Skill</p>
                              <p className="font-medium text-green-600">{team.strongest_skill}</p>
                            </div>
                            <div>
                              <p className={`${theme.subtext} text-xs`}>Focus Area</p>
                              <p className="font-medium text-orange-600">{team.weakest_skill}</p>
                            </div>
                            <div>
                              <p className={`${theme.subtext} text-xs`}>Engagement</p>
                              <p className="font-medium">{team.engagement_rate}%</p>
                            </div>
                            <div>
                              <p className={`${theme.subtext} text-xs`}>On Streak</p>
                              <p className="font-medium text-purple-600">{team.members_on_streak}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${theme.subtext}`}>
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No team data available</p>
                  <p className="text-sm mt-1">Team insights will appear here as data becomes available</p>
                </div>
              )}
            </div>

            {/* Team Highlights */}
            {teamInsights.overall_insights && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} bg-gradient-to-br ${isDarkMode ? 'from-green-600/10 to-emerald-600/10' : 'from-green-50 to-emerald-50'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="w-8 h-8 text-green-500" />
                    <h4 className="font-semibold text-green-600">Best Performing Team</h4>
                  </div>
                  <p className="text-2xl font-bold">{teamInsights.overall_insights.best_team || 'N/A'}</p>
                  <p className={`text-sm ${theme.subtext} mt-1`}>Leading in overall performance</p>
                </div>
                
                <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} bg-gradient-to-br ${isDarkMode ? 'from-blue-600/10 to-indigo-600/10' : 'from-blue-50 to-indigo-50'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                    <h4 className="font-semibold text-blue-600">Most Improved Team</h4>
                  </div>
                  <p className="text-2xl font-bold">{teamInsights.overall_insights.most_improved_team || 'N/A'}</p>
                  <p className={`text-sm ${theme.subtext} mt-1`}>Showing greatest improvement</p>
                </div>
                
                <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border} bg-gradient-to-br ${isDarkMode ? 'from-purple-600/10 to-pink-600/10' : 'from-purple-50 to-pink-50'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-8 h-8 text-purple-500" />
                    <h4 className="font-semibold text-purple-600">Total Team Calls</h4>
                  </div>
                  <p className="text-2xl font-bold">{teamInsights.overall_insights.total_calls_across_teams || 0}</p>
                  <p className={`text-sm ${theme.subtext} mt-1`}>Across all teams this month</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Team Leaders Tab */}
        {activeTab === 'leaders' && (
          <div className="space-y-8">
            {/* Team Leader Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme.subtext}`}>Total Team Leaders</p>
                    <p className="text-2xl font-bold">{teamInsights.team_lead_insights?.length || 0}</p>
                  </div>
                  <Shield className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme.subtext}`}>Best Team Lead</p>
                    <p className="text-lg font-bold text-purple-600">
                      {teamInsights.overall_insights?.best_team_lead || 'N/A'}
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme.subtext}`}>Avg Leadership Score</p>
                    <p className="text-2xl font-bold">
                      {teamInsights.team_lead_insights?.length > 0 
                        ? Math.round(teamInsights.team_lead_insights.reduce((sum, lead) => sum + (lead.effectiveness_score || 0), 0) / teamInsights.team_lead_insights.length)
                        : 0
                      }
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
            </div>

            {/* Team Leaders Performance */}
            <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.border}`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                <Shield className={`mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                Team Leader Performance Analysis
              </h3>
              
              {teamInsights.team_lead_insights?.length > 0 ? (
                <div className="space-y-6">
                  {teamInsights.team_lead_insights.map((leader, index) => (
                    <div key={leader.team_lead_id} className={`p-6 rounded-xl ${theme.hover} transition-all duration-300 group`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">
                                {leader.team_lead_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'TL'}
                              </span>
                            </div>
                            <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${
                              leader.effectiveness === 'Exceptional' ? 'bg-green-500 text-white' :
                              leader.effectiveness === 'High' ? 'bg-blue-500 text-white' :
                              leader.effectiveness === 'Good' ? 'bg-yellow-500 text-white' :
                              'bg-orange-500 text-white'
                            }`}>
                              {leader.effectiveness_score}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">{leader.team_lead_name}</h4>
                            <p className={`text-sm ${theme.subtext}`}>
                              {leader.team_lead_role === 'team_lead_i' ? 'Team Lead I' : 'Team Lead II'} • {leader.team_name}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                leader.effectiveness === 'Exceptional' ? 'bg-green-500/20 text-green-500' :
                                leader.effectiveness === 'High' ? 'bg-blue-500/20 text-blue-500' :
                                leader.effectiveness === 'Good' ? 'bg-yellow-500/20 text-yellow-500' :
                                'bg-orange-500/20 text-orange-500'
                              }`}>
                                {leader.effectiveness} Leadership
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div className="text-center">
                            <p className={`${theme.subtext} text-xs`}>Team Members</p>
                            <p className="text-xl font-bold">{leader.team_members}</p>
                          </div>
                          <div className="text-center">
                            <p className={`${theme.subtext} text-xs`}>Team Avg Rating</p>
                            <p className="text-xl font-bold text-yellow-600">{leader.team_avg_rating}</p>
                          </div>
                          <div className="text-center">
                            <p className={`${theme.subtext} text-xs`}>Members Improving</p>
                            <p className="text-xl font-bold text-green-600">{leader.members_improving}</p>
                          </div>
                          <div className="text-center">
                            <p className={`${theme.subtext} text-xs`}>Leadership Index</p>
                            <p className="text-xl font-bold text-purple-600">{leader.leadership_index}%</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Leader's Personal Performance */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h5 className="font-medium mb-2">Personal Performance</h5>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-blue-500" />
                            <span>{leader.lead_calls || 0} calls</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{leader.lead_rating} rating</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span>{leader.team_improvement_rate}% team improvement</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${theme.subtext}`}>
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No team leader data available</p>
                  <p className="text-sm mt-1">Team leader insights will appear here as data becomes available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills Matrix Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            {/* Skills Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {skillsMatrix.skills?.map((skill, index) => {
                const colors = ['text-blue-500', 'text-purple-500', 'text-green-500', 'text-orange-500', 'text-pink-500'];
                return (
                  <div key={skill} className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                    <div className="flex items-center gap-3">
                      <PieChart className={`w-8 h-8 ${colors[index % colors.length]}`} />
                      <div>
                        <p className={`text-sm ${theme.subtext}`}>{skill.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-lg font-bold">
                          {skillsMatrix.teams?.length > 0 && skillsMatrix.skills_matrix
                            ? Math.round(
                                skillsMatrix.teams.reduce((sum, team) => 
                                  sum + (skillsMatrix.skills_matrix[team]?.[skill]?.avg_score || 0), 0
                                ) / skillsMatrix.teams.length
                              )
                            : 0
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }) || []}
            </div>

            {/* Skills Matrix Table */}
            <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.border} overflow-hidden`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
                <BarChart4 className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                Team Skills Performance Matrix
              </h3>
              
              {skillsMatrix.teams?.length > 0 && skillsMatrix.skills?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${theme.border}`}>
                        <th className={`text-left py-3 px-4 font-semibold ${theme.text}`}>Team</th>
                        {skillsMatrix.skills.map(skill => (
                          <th key={skill} className={`text-center py-3 px-2 font-semibold ${theme.text} min-w-[100px]`}>
                            {skill.replace('_', ' ').split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </th>
                        ))}
                        <th className={`text-center py-3 px-4 font-semibold ${theme.text}`}>Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skillsMatrix.teams.map(team => {
                        const teamSkills = skillsMatrix.skills_matrix[team] || {};
                        const avgScore = skillsMatrix.skills.length > 0 
                          ? Math.round(skillsMatrix.skills.reduce((sum, skill) => 
                              sum + (teamSkills[skill]?.avg_score || 0), 0
                            ) / skillsMatrix.skills.length)
                          : 0;
                        
                        return (
                          <tr key={team} className={`border-b ${theme.border} ${theme.hover}`}>
                            <td className={`py-4 px-4 font-medium ${theme.text}`}>{team}</td>
                            {skillsMatrix.skills.map(skill => {
                              const score = teamSkills[skill]?.avg_score || 0;
                              const consistency = teamSkills[skill]?.consistency || 0;
                              return (
                                <td key={skill} className="py-4 px-2 text-center">
                                  <div className="space-y-1">
                                    <div className={`text-lg font-bold ${
                                      score >= 80 ? 'text-green-500' :
                                      score >= 70 ? 'text-blue-500' :
                                      score >= 60 ? 'text-yellow-500' :
                                      'text-red-500'
                                    }`}>
                                      {Math.round(score)}
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          score >= 80 ? 'bg-green-500' :
                                          score >= 70 ? 'bg-blue-500' :
                                          score >= 60 ? 'bg-yellow-500' :
                                          'bg-red-500'
                                        }`}
                                        style={{ width: `${Math.min(score, 100)}%` }}
                                      ></div>
                                    </div>
                                    <div className={`text-xs ${theme.subtext}`}>
                                      {Math.round(consistency)}% consistent
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                            <td className="py-4 px-4 text-center">
                              <div className={`text-xl font-bold ${
                                avgScore >= 80 ? 'text-green-500' :
                                avgScore >= 70 ? 'text-blue-500' :
                                avgScore >= 60 ? 'text-yellow-500' :
                                'text-red-500'
                              }`}>
                                {avgScore}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`text-center py-8 ${theme.subtext}`}>
                  <BarChart4 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No skills data available</p>
                  <p className="text-sm mt-1">Skills matrix will appear here as teams complete more analyses</p>
                </div>
              )}
            </div>

            {/* Skills Insights */}
            {skillsMatrix.teams?.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-green-500" />
                    Strongest Skills Across Teams
                  </h4>
                  <div className="space-y-3">
                    {skillsMatrix.skills?.slice(0, 3).map(skill => {
                      const avgScore = skillsMatrix.teams.length > 0 
                        ? skillsMatrix.teams.reduce((sum, team) => 
                            sum + (skillsMatrix.skills_matrix[team]?.[skill]?.avg_score || 0), 0
                          ) / skillsMatrix.teams.length
                        : 0;
                      return (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="capitalize">{skill.replace('_', ' ')}</span>
                          <span className="font-bold text-green-600">{Math.round(avgScore)}</span>
                        </div>
                      );
                    }) || []}
                  </div>
                </div>
                
                <div className={`${theme.cardBg} rounded-xl p-6 border ${theme.border}`}>
                  <h4 className="font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-orange-500" />
                    Focus Areas for Development
                  </h4>
                  <div className="space-y-3">
                    {skillsMatrix.skills?.slice(-3).map(skill => {
                      const avgScore = skillsMatrix.teams.length > 0 
                        ? skillsMatrix.teams.reduce((sum, team) => 
                            sum + (skillsMatrix.skills_matrix[team]?.[skill]?.avg_score || 0), 0
                          ) / skillsMatrix.teams.length
                        : 0;
                      return (
                        <div key={skill} className="flex items-center justify-between">
                          <span className="capitalize">{skill.replace('_', ' ')}</span>
                          <span className="font-bold text-orange-600">{Math.round(avgScore)}</span>
                        </div>
                      );
                    }) || []}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;