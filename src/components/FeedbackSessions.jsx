import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, AlertTriangle, Check, X, Ear, Heart, Puzzle, SlidersHorizontal, ChevronRight, ArrowLeft, User, Loader, RefreshCw, Calendar, Clock, FileAudio } from 'lucide-react';
import Navbar from './Navbar';
import apiService from './apiService';

const FeedbackSessions = ({ setCurrentPage, navigateToFeedbackDetail, isDarkMode = true }) => {
  // Debug logging for props
  console.log('🔍 FeedbackSessions rendered with props:', {
    setCurrentPage: typeof setCurrentPage,
    navigateToFeedbackDetail: typeof navigateToFeedbackDetail,
    isDarkMode
  });

  // State for dynamic data
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // UI state  
  const [selectedCall, setSelectedCall] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeTab, setActiveTab] = useState('feedback');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, processing, failed
  const [filterUser, setFilterUser] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, rating, user
  const [sortOrder, setSortOrder] = useState('desc'); // desc, asc

  // Users list for filtering
  const [users, setUsers] = useState([]);

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

  // Fetch feedback sessions with enhanced debugging
  const fetchFeedbackSessions = async () => {
    console.log('🚀 fetchFeedbackSessions called');
    try {
      setIsLoading(true);
      setError(null);

      console.log('🏥 Testing API health...');
      // Test API health first
      try {
        const health = await apiService.healthCheck();
        console.log('✅ API health check passed:', health);
      } catch (healthError) {
        console.warn('⚠️ API health check failed:', healthError);
      }

      console.log('📞 Fetching sessions and users...');
      // Fetch sessions and users in parallel
      const [sessionsData, usersData] = await Promise.all([
        apiService.getFeedbackSessions(),
        apiService.getUsers()
      ]);

      console.log('📊 Raw sessions data:', sessionsData);
      console.log('👥 Raw users data:', usersData);

      // Format sessions data
      const formattedSessions = sessionsData.map(session => {
        const formatted = {
          id: session.call_id || session.sessionId, // Use call_id for display
          sessionId: session.sessionId, // Use the actual sessionId from API response
          user: session.user_name || 'Unknown User',
          date: session.session_date ? new Date(session.session_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          time: session.session_date ? new Date(session.session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '00:00',
          duration: session.duration || '0:00',
          rating: session.overall_rating || 0,
          sentiment: session.sentiment || 'Unknown',
          status: session.processing_status || 'completed',
          fileName: session.file_name || 'audio.mp3',
          transcript: session.transcript || 'Transcript not available',
          strengthsCount: session.strengths_count || 0,
          issuesCount: session.issues_count || 0,
          createdAt: session.created_at
        };
        console.log('📋 Formatted session:', {
          id: formatted.id,
          sessionId: formatted.sessionId,
          originalSessionId: session.sessionId,
          originalCallId: session.call_id
        });
        return formatted;
      });

      console.log('✅ All sessions formatted:', formattedSessions);
      setSessions(formattedSessions);
      setFilteredSessions(formattedSessions);

      // Format users for filtering
      const formattedUsers = usersData.map(user => apiService.formatUserForFrontend(user));
      setUsers(formattedUsers);

      setLastUpdated(new Date());
      console.log('✅ Data fetch completed successfully');

    } catch (error) {
      console.error('❌ Error fetching feedback sessions:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    console.log('🔄 FeedbackSessions useEffect triggered');
    fetchFeedbackSessions();
    
    // Set up auto-refresh every 2 minutes
    const refreshInterval = setInterval(fetchFeedbackSessions, 2 * 60 * 1000);
    
    return () => {
      console.log('🧹 FeedbackSessions cleanup');
      clearInterval(refreshInterval);
    };
  }, []);

  // Filter and sort sessions
  useEffect(() => {
    let filtered = [...sessions];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(session => 
        session.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(session => session.status === filterStatus);
    }

    // Apply user filter
    if (filterUser !== 'all') {
      filtered = filtered.filter(session => session.user === filterUser);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.createdAt || a.date);
          bValue = new Date(b.createdAt || b.date);
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'user':
          aValue = a.user.toLowerCase();
          bValue = b.user.toLowerCase();
          break;
        default:
          aValue = new Date(a.createdAt || a.date);
          bValue = new Date(b.createdAt || b.date);
      }

      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    setFilteredSessions(filtered);
  }, [sessions, searchQuery, filterStatus, filterUser, sortBy, sortOrder]);

  // Enhanced handle call click with debugging
  const handleCallClick = (session) => {
    console.log('🖱️ Call clicked in FeedbackSessions:', session);
    console.log('📋 Session details:', {
      id: session.id,
      sessionId: session.sessionId,
      user: session.user,
      status: session.status,
      fullSession: session
    });
    
    // Check if navigateToFeedbackDetail function is available
    if (typeof navigateToFeedbackDetail !== 'function') {
      console.error('❌ navigateToFeedbackDetail is not a function:', navigateToFeedbackDetail);
      alert('Navigation function not available. Check console for details.');
      return;
    }
    
    // Validate session has required data
    if (!session.sessionId) {
      console.error('❌ Session missing sessionId:', session);
      alert('Session ID not found. Check console for details.');
      return;
    }
    
    console.log('🧭 Calling navigateToFeedbackDetail with sessionId:', session.sessionId);
    
    try {
      // Navigate to detailed feedback page using session ID
      navigateToFeedbackDetail(null, session.sessionId);
      console.log('✅ Navigation function called successfully');
    } catch (navError) {
      console.error('❌ Navigation error:', navError);
      alert('Navigation failed. Check console for details.');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    fetchFeedbackSessions();
  };

  // Test API connection
  const testApiConnection = async () => {
    console.log('🧪 Testing API connection...');
    try {
      const isConnected = await apiService.testConnection();
      console.log('🧪 API connection test result:', isConnected);
      alert(`API Connection: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      console.error('🧪 API test error:', error);
      alert(`API Test Failed: ${error.message}`);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'failed':
        return 'bg-red-500/20 text-red-500';
      case 'pending':
        return 'bg-blue-500/20 text-blue-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Very Positive':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Positive':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Neutral':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Negative':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Get unique users for filter dropdown
  const getUniqueUsers = () => {
    const uniqueUsers = [...new Set(sessions.map(session => session.user))];
    return uniqueUsers.sort();
  };

  // Development mode debug panel
  // const showDebugPanel = process.env.NODE_ENV === 'development';
  // const debugPanel = showDebugPanel && (
  //   <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
  //     <div className="font-bold text-yellow-400 mb-2">Debug Panel (Development Only)</div>
  //     <div className="space-y-2 text-sm text-yellow-200">
  //       <p>Total Sessions: {sessions.length}</p>
  //       <p>Filtered Sessions: {filteredSessions.length}</p>
  //       <p>API Base URL: {apiService.baseURL}</p>
  //       <p>Navigation Function: {typeof navigateToFeedbackDetail}</p>
  //       <div className="flex gap-2 mt-2">
  //         <button 
  //           onClick={testApiConnection}
  //           className="px-3 py-1 bg-yellow-600 text-white rounded text-xs"
  //         >
  //           Test API
  //         </button>
  //         <button 
  //           onClick={handleRefresh}
  //           className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
  //         >
  //           Force Refresh
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  // Loading state
  // if (isLoading && !lastUpdated) {
  //   return (
  //     <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
  //       <div className="ml-20 lg:ml-64 p-6">
  //         <div className="flex items-center justify-center min-h-[60vh]">
  //           <div className="text-center">
  //             <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-500" />
  //             <h3 className="text-xl font-semibold mb-2">Loading Feedback Sessions</h3>
  //             <p className={theme.subtext}>Fetching analysis data from server...</p>
  //             {showDebugPanel && (
  //               <div className="mt-4 text-sm text-gray-400">
  //                 <p>API URL: {apiService.baseURL}</p>
  //                 <button 
  //                   onClick={testApiConnection}
  //                   className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs"
  //                 >
  //                   Test API While Loading
  //                 </button>
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      <div className="ml-20 lg:ml-64 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Feedback Sessions
              </h1>
              <p className="text-gray-400">Review and analyze call performance results</p>
            </div>
            
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="text-right">
                  <p className={`text-sm ${theme.subtext}`}>Last Updated</p>
                  <p className="font-semibold">{lastUpdated.toLocaleTimeString()}</p>
                </div>
              )}
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
        </div>

        {/* Debug Panel */}
        {/* {debugPanel} */}

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-300">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Error Loading Data</span>
            </div>
            <p className="text-red-200 text-sm mt-1">{error}</p>
            {/* {showDebugPanel && (
              <div className="mt-2">
                <button 
                  onClick={testApiConnection}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs mr-2"
                >
                  Test API
                </button>
                <button 
                  onClick={handleRefresh}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                >
                  Retry
                </button>
              </div>
            )} */}
          </div>
        )}

        {/* Filters and Search */}
        <div className={`${theme.cardBg} rounded-2xl p-6 mb-6 border ${theme.border}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 ${theme.bg} ${theme.text} border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 ${theme.bg} ${theme.text} border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>

            {/* User Filter */}
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className={`px-4 py-2 ${theme.bg} ${theme.text} border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="all">All Users</option>
              {getUniqueUsers().map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`flex-1 px-4 py-2 ${theme.bg} ${theme.text} border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="date">Sort by Date</option>
                <option value="rating">Sort by Rating</option>
                <option value="user">Sort by User</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className={`px-3 py-2 ${theme.hover} border ${theme.border} rounded-lg transition-colors`}
                title={`Sort ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <span className={theme.subtext}>
              Total: <span className="font-semibold text-white">{sessions.length}</span>
            </span>
            <span className={theme.subtext}>
              Filtered: <span className="font-semibold text-white">{filteredSessions.length}</span>
            </span>
            <span className={theme.subtext}>
              Completed: <span className="font-semibold text-green-400">{sessions.filter(s => s.status === 'completed').length}</span>
            </span>
            <span className={theme.subtext}>
              Processing: <span className="font-semibold text-yellow-400">{sessions.filter(s => s.status === 'processing').length}</span>
            </span>
          </div>
        </div>

        {/* Sessions List */}
        <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border}`}>
          <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center">
            <MessageSquare className="mr-2" />
            Analysis Sessions ({filteredSessions.length})
          </h2>
          
          {filteredSessions.length === 0 ? (
            <div className={`text-center py-12 ${theme.subtext}`}>
              {isLoading ? (
                <div>
                  <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
                  <p>Loading sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div>
                  <FileAudio className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Analysis Sessions Yet</h3>
                  <p className="mb-4">Upload your first audio file to get started with AI-powered speech analysis.</p>
                  <button
                    onClick={() => setCurrentPage('upload')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Upload Audio
                  </button>
                </div>
              ) : (
                <div>
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Sessions Match Your Filters</h3>
                  <p>Try adjusting your search criteria or filters.</p>
                </div>
              )}
            </div>
          ) : (
            /* Grid layout for sessions */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                    selectedCall && selectedCall.id === session.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl transform scale-[1.02]'
                      : `${theme.hover} hover:shadow-lg transform hover:scale-[1.005] border ${theme.border}`
                  }`}
                  onClick={() => {
                    console.log('🖱️ Session card clicked:', session);
                    handleCallClick(session);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{session.id}</h3>
                      <p className={`text-sm ${selectedCall && selectedCall.id === session.id ? 'text-indigo-100' : theme.subtext}`}>
                        {session.user}
                      </p>
                      {/* {showDebugPanel && (
                        <p className="text-xs text-gray-500">
                          SessionId: {session.sessionId}
                        </p>
                      )} */}
                    </div>
                    <div className="flex items-center gap-2">
                      {session.status === 'completed' && (
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 ${
                            selectedCall && selectedCall.id === session.id
                              ? 'text-yellow-200 fill-yellow-200'
                              : 'text-yellow-400 fill-yellow-400'
                          }`} />
                          <span className={`text-sm ${
                            selectedCall && selectedCall.id === session.id
                              ? 'text-white'
                              : 'text-gray-300'
                          }`}>
                            {session.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      <ChevronRight className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                        selectedCall && selectedCall.id === session.id
                          ? 'text-white'
                          : 'text-gray-400 group-hover:translate-x-1'
                      }`} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={selectedCall && selectedCall.id === session.id ? 'text-indigo-200' : theme.subtext}>
                        {session.date} | {session.duration}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>

                    {session.status === 'completed' && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(session.sentiment)}`}>
                          {session.sentiment}
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-green-400">{session.strengthsCount} strengths</span>
                          <span className="text-orange-400">{session.issuesCount} issues</span>
                        </div>
                      </div>
                    )}

                    {session.status === 'processing' && (
                      <div className="flex items-center gap-2 text-sm text-yellow-400">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Analysis in progress...</span>
                      </div>
                    )}

                    {session.status === 'failed' && (
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <X className="w-4 h-4" />
                        <span>Analysis failed</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-600/30">
                    <p className={`text-xs ${selectedCall && selectedCall.id === session.id ? 'text-indigo-200' : theme.subtext} truncate`}>
                      {session.fileName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Instruction message */}
          {filteredSessions.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-400 flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Click on any session to view detailed analysis and feedback
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {sessions.length === 0 && !isLoading && (
          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} mt-6`}>
            <h3 className="text-xl font-bold mb-4">Get Started</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentPage('upload')}
                className="p-4 text-left rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all group"
              >
                <FileAudio className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Upload Audio</h4>
                <p className="text-sm text-indigo-200">Start by uploading your first audio file for analysis</p>
              </button>
              
              <button
                onClick={() => setCurrentPage('users')}
                className="p-4 text-left rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all group"
              >
                <User className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Manage Users</h4>
                <p className="text-sm text-green-200">Add and manage users who will be analyzed</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSessions;