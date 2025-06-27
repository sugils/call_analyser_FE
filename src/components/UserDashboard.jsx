import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Phone, 
  Star, 
  TrendingUp,
  TrendingDown,
  BarChart4,
  PieChart,
  Calendar,
  User,
  Award,
  Target,
  Clock,
  MessageCircle,
  Headphones,
  Heart,
  Settings,
  Eye,
  ChevronRight,
  Loader,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import apiService from './apiService';

const UserDashboard = ({ userId = 1, setCurrentPage, navigateToFeedbackDetail }) => {
  // State for dynamic data
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // UI state
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Enhanced apiService.getFeedbackDetail debugging wrapper
  useEffect(() => {
    const originalGetFeedbackDetail = apiService.getFeedbackDetail;
    apiService.getFeedbackDetail = async function(sessionId) {
      console.log('🚨 === DEBUGGING API SERVICE GET FEEDBACK DETAIL ===');
      console.log('🔍 1. getFeedbackDetail called with sessionId:', sessionId);
      console.log('🔍 2. SessionId type:', typeof sessionId);
      console.log('🔍 3. Base URL:', this.baseURL);
      console.log('🔗 4. Full URL will be:', `${this.baseURL}/api/feedback-sessions/${sessionId}`);
      
      try {
        const result = await originalGetFeedbackDetail.call(this, sessionId);
        console.log('✅ 5. getFeedbackDetail successful, result keys:', Object.keys(result));
        console.log('🚨 === END DEBUGGING API SERVICE ===');
        return result;
      } catch (error) {
        console.error('❌ 6. getFeedbackDetail failed:', error);
        console.error('❌ 7. Error type:', error.constructor.name);
        console.error('❌ 8. Error message:', error.message);
        console.log('🚨 === END DEBUGGING API SERVICE (ERROR) ===');
        throw error;
      }
    };

    // Cleanup on unmount
    return () => {
      apiService.getFeedbackDetail = originalGetFeedbackDetail;
    };
  }, []);

  // Helper function to map calls with real session IDs - Enhanced with debugging
  const mapCallsWithSessionIdsDebug = (calls, feedbackSessions, type) => {
    console.log(`🔍 7. Mapping ${type} calls with session IDs...`);
    console.log(`📋 8. Input calls:`, calls);
    console.log(`📋 9. Available sessions:`, feedbackSessions.length);
    
    if (!calls || calls.length === 0) {
      console.log(`⚠️ 10. No ${type} calls from backend, creating from sessions...`);
      
      if (feedbackSessions && feedbackSessions.length > 0) {
        const mappedCalls = feedbackSessions
          .filter(session => {
            const rating = session.overall_rating || 0;
            const shouldInclude = type === 'top' ? rating >= 4.0 : rating < 3.5;
            console.log(`🔍 11. Session ${session.sessionId || session.id} rating: ${rating}, include in ${type}: ${shouldInclude}`);
            return shouldInclude;
          })
          .sort((a, b) => {
            return type === 'top' ? 
              (b.overall_rating || 0) - (a.overall_rating || 0) :
              (a.overall_rating || 0) - (b.overall_rating || 0);
          })
          .slice(0, 5)
          .map(session => {
            const mappedCall = {
              id: session.call_id || session.sessionId || session.id,
              session_id: session.sessionId || session.id, // This is crucial!
              sessionId: session.sessionId || session.id, // Also add this for compatibility
              date: session.created_at ? new Date(session.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
              time: session.created_at ? new Date(session.created_at).toLocaleTimeString() : new Date().toLocaleTimeString(),
              duration: session.duration || '5:30',
              rating: session.overall_rating || 0,
              overall_score: Math.round((session.overall_rating || 0) * 20),
              highlights: type === 'top' ? ['High performance', 'Excellent communication'] : undefined,
              issues: type === 'attention' ? ['Needs improvement', 'Low score'] : undefined,
              hasRealData: true
            };
            
            console.log(`✅ 12. Mapped ${type} call:`, {
              id: mappedCall.id,
              session_id: mappedCall.session_id,
              sessionId: mappedCall.sessionId,
              hasRealData: mappedCall.hasRealData
            });
            
            return mappedCall;
          });
          
        console.log(`✅ 13. Final ${type} calls with session IDs:`, mappedCalls.length);
        return mappedCalls;
      }
      return [];
    }
    
    // If calls exist, try to match them with session IDs
    const matchedCalls = calls.map(call => {
      console.log(`🔍 14. Trying to match call ${call.id} with sessions...`);
      
      const matchingSession = feedbackSessions.find(session => {
        const sessionId = session.sessionId || session.id;
        const matches = session.call_id === call.id || 
                       sessionId === call.id ||
                       (session.file_name && call.id && session.file_name.includes(call.id));
        
        console.log(`🔍 15. Checking session ${sessionId} vs call ${call.id}: ${matches}`);
        return matches;
      });
      
      const enhancedCall = {
        ...call,
        session_id: matchingSession?.sessionId || matchingSession?.id,
        sessionId: matchingSession?.sessionId || matchingSession?.id, // Add both for compatibility
        hasRealData: !!matchingSession
      };
      
      console.log(`${matchingSession ? '✅' : '⚠️'} 16. Call ${call.id} mapped:`, {
        session_id: enhancedCall.session_id,
        sessionId: enhancedCall.sessionId,
        hasRealData: enhancedCall.hasRealData
      });
      
      return enhancedCall;
    });
    
    return matchedCalls;
  };

  // Enhanced fetchUserData with better session ID mapping debugging
  const fetchUserData = async () => {
    try {
      console.log('🚨 === DEBUGGING FETCH USER DATA ===');
      setIsLoading(true);
      setError(null);

      console.log('🔍 1. Fetching user details for userId:', userId);
      const userDetails = await apiService.getUserDetails(userId);
      
      if (!userDetails) {
        throw new Error('User not found');
      }
      
      console.log('✅ 2. User details received:', userDetails.name);

      // Fetch feedback sessions with detailed debugging
      let userFeedbackSessions = [];
      try {
        console.log('🔍 3. Fetching feedback sessions for user:', userId);
        userFeedbackSessions = await apiService.getFeedbackSessions(userId, 20);
        console.log('✅ 4. Feedback sessions received:', userFeedbackSessions.length);
        console.log('📋 5. Sample session IDs:', userFeedbackSessions.slice(0, 3).map(s => ({
          id: s.sessionId || s.id,
          call_id: s.call_id,
          file_name: s.file_name
        })));
      } catch (sessionError) {
        console.error('❌ 6. Could not fetch user feedback sessions:', sessionError);
      }

      const transformedData = {
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        role: userDetails.role,
        avatar: userDetails.avatar || generateAvatar(userDetails.name),
        joinDate: userDetails.join_date || userDetails.created_at,
        totalCalls: userDetails.total_calls || 0,
        averageRating: userDetails.average_rating || 0,
        improvement: userDetails.improvement_rate >= 0 ? `+${userDetails.improvement_rate}%` : `${userDetails.improvement_rate}%`,
        currentStreak: userDetails.current_streak || 0,
        bestSkill: userDetails.best_skill || 'Communication',
        improvementArea: userDetails.improvement_area || 'General Performance',
        performanceData: userDetails.performance_trend || generateDefaultPerformanceData(),
        skillsData: userDetails.skills_data || generateDefaultSkillsData(),
        topCalls: mapCallsWithSessionIdsDebug(userDetails.top_calls || [], userFeedbackSessions, 'top'),
        attentionCalls: mapCallsWithSessionIdsDebug(userDetails.attention_calls || [], userFeedbackSessions, 'attention')
      };

      console.log('✅ 17. Final transformed data - Top calls:', transformedData.topCalls.length);
      console.log('✅ 18. Final transformed data - Attention calls:', transformedData.attentionCalls.length);
      
      setUserData(transformedData);
      setLastUpdated(new Date());
      
      console.log('🚨 === END DEBUGGING FETCH USER DATA ===');

    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      setError(error.message);
      setUserData(getDefaultUserData(userId));
    } finally {
      setIsLoading(false);
    }
  };

  // Generate avatar from name
  const generateAvatar = (name) => {
    if (!name) return 'UN';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate default performance data
  const generateDefaultPerformanceData = () => [
    { period: 'Week 1', rating: 3.8, calls: 15, improvement: 2 },
    { period: 'Week 2', rating: 3.9, calls: 18, improvement: 5 },
    { period: 'Week 3', rating: 4.1, calls: 22, improvement: 8 },
    { period: 'Week 4', rating: 4.2, calls: 20, improvement: 12 },
    { period: 'Week 5', rating: 4.3, calls: 25, improvement: 15 },
    { period: 'Week 6', rating: 4.2, calls: 25, improvement: 12 }
  ];

  // Generate default skills data
  const generateDefaultSkillsData = () => [
    { skill: 'Communication', score: 85, trend: 'up', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { skill: 'Active Listening', score: 92, trend: 'up', color: 'text-purple-500', bgColor: 'bg-purple-500' },
    { skill: 'Empathy', score: 78, trend: 'stable', color: 'text-pink-500', bgColor: 'bg-pink-500' },
    { skill: 'Problem Solving', score: 88, trend: 'up', color: 'text-green-500', bgColor: 'bg-green-500' },
    { skill: 'Call Control', score: 65, trend: 'down', color: 'text-orange-500', bgColor: 'bg-orange-500' }
  ];

  // Default user data fallback
  const getDefaultUserData = (userId) => ({
    id: userId,
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'Agent',
    avatar: 'DU',
    joinDate: '2023-01-15',
    totalCalls: 0,
    averageRating: 0,
    improvement: '+0%',
    currentStreak: 0,
    bestSkill: 'Communication',
    improvementArea: 'General Performance',
    performanceData: generateDefaultPerformanceData(),
    skillsData: generateDefaultSkillsData(),
    topCalls: [],
    attentionCalls: []
  });

  // Load data on component mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Handle call click - FULL DEBUG VERSION
  const handleCallClick = async (call) => {
    console.log('🚨 === DEBUGGING CALL CLICK ===');
    console.log('🔍 1. Call object received:', JSON.stringify(call, null, 2));
    console.log('🔍 2. Call ID:', call.id);
    console.log('🔍 3. Session ID:', call.session_id);
    console.log('🔍 4. SessionId (alternative):', call.sessionId);
    console.log('🔍 5. Feedback Session ID:', call.feedback_session_id);
    console.log('🔍 6. Has Real Data:', call.hasRealData);
    
    try {
      // Check if this call has a valid feedback session ID - try multiple field names
      const sessionId = call.session_id || call.sessionId || call.feedback_session_id;
      console.log('🔍 7. Resolved Session ID:', sessionId);
      console.log('🔍 8. SessionId type:', typeof sessionId);
      
      if (sessionId) {
        console.log('✅ 9. Session ID found, attempting to fetch real feedback...');
        console.log('🌐 10. About to call apiService.getFeedbackDetail with:', sessionId);
        
        // Add explicit debugging to API service call
        try {
          console.log('🚀 11. Making API call to getFeedbackDetail...');
          
          // Let's manually check what URL is being called
          const expectedUrl = `${apiService.baseURL}/api/feedback-sessions/${sessionId}`;
          console.log('🔗 12. Expected API URL:', expectedUrl);
          
          // Test direct API call first
          console.log('🧪 13. Testing direct API call...');
          try {
            const directResponse = await apiService.fetchWithTimeout(expectedUrl);
            const directData = await directResponse.json();
            console.log('🧪 14. Direct API response success:', directData.success);
            console.log('🧪 15. Direct API response keys:', Object.keys(directData));
          } catch (directError) {
            console.error('🧪 16. Direct API failed:', directError);
          }
          
          // Now try the actual service method
          const realFeedback = await apiService.getFeedbackDetail(sessionId);
          console.log('✅ 17. Real feedback received:', realFeedback);
          console.log('✅ 18. Real feedback keys:', Object.keys(realFeedback));
          
          if (navigateToFeedbackDetail) {
            console.log('✅ 19. Navigating to feedback detail...');
            navigateToFeedbackDetail(realFeedback);
          }
          return;
        } catch (apiError) {
          console.error('❌ 20. API call failed:', apiError);
          console.error('❌ 21. API error details:', {
            message: apiError.message,
            stack: apiError.stack,
            name: apiError.name
          });
          // Fall through to demo data creation
        }
      } else {
        console.log('⚠️ 22. No session ID found, will create demo data');
      }
      
      // Create demo data fallback
      console.log('📋 23. Creating demo feedback data...');
      
      const feedbackData = {
        id: call.id,
        user: userData?.name || 'Unknown User',
        userName: userData?.name || 'Unknown User',
        date: call.date || new Date().toISOString().split('T')[0],
        time: call.time || new Date().toLocaleTimeString(),
        duration: call.duration || '5:30',
        rating: call.rating || 0,
        overall_score: call.overall_score || Math.round(call.rating * 20) || 0,
        sentiment: call.rating >= 4.5 ? 'Very Positive' : 
                  call.rating >= 4.0 ? 'Positive' : 
                  call.rating >= 3.5 ? 'Neutral' : 'Negative',
        transcript: call.transcript || `This is a demo transcript for call ${call.id} with ${userData?.name || 'user'}. The call lasted ${call.duration || '5:30'} and covered various topics related to customer service and support. The customer had questions about their account and needed assistance with technical issues.`,
        
        // Use call-specific issues and strengths if available, otherwise generate demo data
        issues: call.issues && call.issues.length > 0 ? call.issues : [
          'Speaking pace could be improved',
          'Minor grammatical inconsistencies',
          'Could use more active listening techniques'
        ],
        
        strengths: call.highlights && call.highlights.length > 0 ? call.highlights : 
                   call.strengths && call.strengths.length > 0 ? call.strengths : [
          'Professional approach throughout the call',
          'Good technical knowledge demonstrated',
          'Patient and courteous with customer'
        ],
        
        fileName: `${call.id}_${userData?.name?.replace(/\s+/g, '_') || 'user'}.mp3`,
        
        // Demo scores data
        scores: {
          grammar: Math.max(60, Math.min(95, (call.rating || 3.5) * 20 + Math.random() * 10 - 5)),
          fluency: Math.max(60, Math.min(95, (call.rating || 3.5) * 20 + Math.random() * 10 - 5)),
          speech_rate: Math.max(60, Math.min(95, (call.rating || 3.5) * 20 + Math.random() * 10 - 5)),
          filler_words: Math.max(60, Math.min(95, (call.rating || 3.5) * 20 + Math.random() * 10 - 5)),
          overall: call.overall_score || Math.round((call.rating || 3.5) * 20)
        },
        
        // Mark as demo data
        hasRealData: false,
        source: 'DEMO_USER_DASHBOARD',
        warning: `This is demonstration data. Real analysis data would come from the feedback sessions API. Session ID attempted: ${sessionId}`,
        
        // Additional demo fields
        callDetails: {
          transcript: call.transcript || `Demo transcript for call ${call.id}...`,
          categories: [
            {
              id: 'communication',
              title: 'Communication Skills',
              subtitle: 'Overall communication effectiveness',
              score: Math.round((call.rating || 3.5) * 18 + 10),
              color: 'text-blue-500',
              bgColor: 'bg-blue-500'
            },
            {
              id: 'professionalism',
              title: 'Professionalism',
              subtitle: 'Professional conduct and approach',
              score: Math.round((call.rating || 3.5) * 19 + 5),
              color: 'text-purple-500',
              bgColor: 'bg-purple-500'
            }
          ]
        }
      };
      
      console.log('📋 24. Demo feedback data created:', feedbackData);
      
      if (navigateToFeedbackDetail) {
        console.log('✅ 25. Navigating to demo feedback detail...');
        navigateToFeedbackDetail(feedbackData);
      }
      
    } catch (error) {
      console.error('❌ 26. Error in handleCallClick:', error);
      console.error('❌ 27. Full error details:', {
        message: error.message,
        stack: error.stack,
        call: call
      });
      
      // Create minimal fallback data
      const fallbackData = {
        id: call.id || 'UNKNOWN',
        user: userData?.name || 'Unknown User',
        hasRealData: false,
        error: 'Failed to load call details',
        warning: error.message
      };
      
      if (navigateToFeedbackDetail) {
        navigateToFeedbackDetail(fallbackData);
      }
    }
    
    console.log('🚨 === END DEBUGGING CALL CLICK ===');
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    if (setCurrentPage) {
      setCurrentPage('dashboard');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUserData();
  };

  // Get best proficiency score
  const getBestProficiency = () => {
    if (!userData?.skillsData || userData.skillsData.length === 0) return 0;
    const bestSkill = userData.skillsData.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    return bestSkill.score;
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
  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans transition-colors duration-300`}>
        <div className="ml-20 lg:ml-64 p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-500" />
              <h3 className="text-xl font-semibold mb-2">Loading User Dashboard</h3>
              <p className={theme.subtext}>Fetching user performance data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !userData) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans transition-colors duration-300`}>
        <div className="ml-20 lg:ml-64 p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2">Failed to Load User Data</h3>
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
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans transition-colors duration-300`}>
      <div className="ml-20 lg:ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToDashboard}
              className={`${theme.cardBg} ${theme.hover} p-3 rounded-xl transition-all duration-200 border ${theme.border}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">{userData?.avatar || 'U'}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{userData?.name || 'Loading...'}</h1>
                  {error && (
                    <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded text-xs">
                      Demo Data
                    </span>
                  )}
                </div>
                <p className={`${theme.subtext} text-lg`}>
                  {userData?.role || 'Role'} • Member since {userData?.joinDate ? new Date(userData.joinDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
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
                isLoading ? 'opacity-50 cursor-not-allowed' : theme.hover
              }`}
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`${theme.cardBg} ${theme.text} border ${theme.border} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {error && userData && (
          <div className="mb-6 p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-300">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Backend Connection Issue</span>
            </div>
            <p className="text-yellow-200 text-sm mt-1">
              Using cached/demo data: {error}. Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
            </p>
          </div>
        )}

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.subtext} text-sm font-medium`}>Total Rating</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold">{(userData?.averageRating || 0).toFixed(1)}</span>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <span className={`text-sm font-medium flex items-center mt-1 ${
                  (userData?.improvement || '').startsWith('+') ? 'text-green-500' : 
                  (userData?.improvement || '').startsWith('-') ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {(userData?.improvement || '').startsWith('+') ? <TrendingUp className="w-4 h-4 mr-1" /> : 
                   (userData?.improvement || '').startsWith('-') ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                  {userData?.improvement || '0%'}
                </span>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.subtext} text-sm font-medium`}>Total Calls</p>
                <span className="text-2xl font-bold mt-2 block">{userData?.totalCalls || 0}</span>
                <span className={`${theme.subtext} text-sm mt-1`}>This month</span>
              </div>
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.subtext} text-sm font-medium`}>Best Skill</p>
                <span className="text-2xl font-bold mt-2 block">{userData?.bestSkill || 'N/A'}</span>
                <span className="text-blue-500 text-sm mt-1">{getBestProficiency()}% proficiency</span>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.subtext} text-sm font-medium`}>Current Streak</p>
                <span className="text-2xl font-bold mt-2 block">{userData?.currentStreak || 0}</span>
                <span className={`${theme.subtext} text-sm mt-1`}>Days improving</span>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Charts and Skills */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          {/* Performance Trend */}
          <div className={`xl:col-span-2 ${theme.cardBg} rounded-2xl p-6 border ${theme.border} shadow-lg`}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <BarChart4 className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
              Performance Trend - {userData?.name || 'User'}
            </h3>
            
            <div className="h-64 relative">
              {/* Chart background grid */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[5, 4, 3, 2, 1, 0].map((value) => (
                  <div key={value} className="flex items-center">
                    <span className={`text-xs ${theme.subtext} w-8`}>{value}</span>
                    <div className={`flex-1 h-px ${theme.border}`}></div>
                  </div>
                ))}
              </div>
              
              {/* Chart bars */}
              <div className="absolute bottom-0 left-8 right-0 h-full flex items-end justify-between gap-2">
                {(userData?.performanceData || []).map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-end h-full relative group">
                      <div
                        className={`w-10 bg-gradient-to-t ${
                          (data.rating || 0) >= 4.5 ? 'from-green-600 to-green-500' :
                          (data.rating || 0) >= 4.0 ? 'from-indigo-600 to-purple-600' :
                          (data.rating || 0) >= 3.5 ? 'from-yellow-600 to-yellow-500' :
                          'from-red-600 to-red-500'
                        } rounded-t-lg transition-all duration-300 group-hover:brightness-110`}
                        style={{ height: `${((data.rating || 0) / 5) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.rating || 0}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs ${theme.subtext} mt-2 text-center`}>{data.period}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} shadow-lg`}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Target className={`mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              Skills Analysis
            </h3>
            
            <div className="space-y-4">
              {(userData?.skillsData || []).map((skill) => (
                <div key={skill.skill} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{skill.score || 0}%</span>
                      {skill.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {skill.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {skill.trend === 'stable' && <div className="w-4 h-4 rounded-full bg-gray-400"></div>}
                    </div>
                  </div>
                  <div className={`h-2 ${theme.border} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full ${skill.bgColor} rounded-full transition-all duration-500 group-hover:brightness-110`}
                      style={{ width: `${skill.score || 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`mt-6 pt-4 border-t ${theme.border}`}>
              <p className={`text-sm ${theme.subtext}`}>
                <span className="font-semibold">Focus Area:</span> {userData?.improvementArea || 'General Performance'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Top Performed Calls */}
          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} shadow-lg`}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Award className={`mr-2 text-green-500`} />
              Top Performed Calls
            </h3>
            
            <div className="space-y-4">
              {(userData?.topCalls || []).length > 0 ? userData.topCalls.map((call, index) => (
                <div key={call.id} className={`p-4 rounded-xl ${theme.hover} transition-all duration-300 group cursor-pointer border-l-4 border-green-500`}
                     onClick={() => handleCallClick(call)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {call.id}
                          {call.hasRealData && (
                            <span className="px-1 py-0.5 bg-green-600/20 text-green-400 rounded text-xs">
                              Real Data
                            </span>
                          )}
                          {(call.session_id || call.sessionId) && (
                            <span className="px-1 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs">
                              Session: {call.session_id || call.sessionId}
                            </span>
                          )}
                        </h4>
                        <p className={`text-sm ${theme.subtext}`}>{call.date} at {call.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{call.rating || 0}</span>
                      </div>
                      <Eye className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={theme.subtext}>Overall Score</span>
                      <span className="font-bold text-green-500">{call.overall_score || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{width: `${call.overall_score || 0}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {(call.highlights || []).slice(0, 3).map((highlight, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )) : (
                <div className={`p-6 text-center ${theme.subtext}`}>
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No high-performing calls yet.</p>
                  <p className="text-sm mt-1">Complete more analyses to see top performances here!</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setCurrentPage && setCurrentPage('feedback')}
              className={`w-full mt-4 p-3 ${theme.hover} rounded-xl transition-all duration-200 text-center font-medium`}
            >
              View All Performance Data
              <ChevronRight className="w-4 h-4 inline ml-2" />
            </button>
          </div>

          {/* Calls Needing Attention */}
          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} shadow-lg`}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Target className={`mr-2 text-orange-500`} />
              Calls Needing Attention
            </h3>
            
            <div className="space-y-4">
              {(userData?.attentionCalls || []).length > 0 ? userData.attentionCalls.map((call, index) => (
                <div key={call.id} className={`p-4 rounded-xl ${theme.hover} transition-all duration-300 group cursor-pointer border-l-4 border-orange-500`}
                     onClick={() => handleCallClick(call)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                        !
                      </div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {call.id}
                          {call.hasRealData && (
                            <span className="px-1 py-0.5 bg-orange-600/20 text-orange-400 rounded text-xs">
                              Real Data
                            </span>
                          )}
                          {(call.session_id || call.sessionId) && (
                            <span className="px-1 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs">
                              Session: {call.session_id || call.sessionId}
                            </span>
                          )}
                        </h4>
                        <p className={`text-sm ${theme.subtext}`}>{call.date} at {call.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                        <span className="font-bold">{call.rating || 0}</span>
                      </div>
                      <Eye className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={theme.subtext}>Overall Score</span>
                      <span className="font-bold text-orange-500">{call.overall_score || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{width: `${call.overall_score || 0}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {(call.issues || []).slice(0, 3).map((issue, idx) => (
                      <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs rounded-full">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )) : (
                <div className={`p-6 text-center ${theme.subtext}`}>
                  <Target className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                  <p>Great job! No calls need immediate attention.</p>
                  <p className="text-sm mt-1">Keep up the excellent work!</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setCurrentPage && setCurrentPage('feedback')}
              className={`w-full mt-4 p-3 ${theme.hover} rounded-xl transition-all duration-200 text-center font-medium`}
            >
              View All Analysis Results
              <ChevronRight className="w-4 h-4 inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;