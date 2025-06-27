import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, AlertTriangle, Check, Ear, Heart, Puzzle, SlidersHorizontal, MessageSquare, Play, Pause, Download, Share2, Info, TrendingUp, Loader, RefreshCw } from 'lucide-react';
import Navbar from './Navbar';
import apiService from './apiService';

const FeedbackDetail = ({ setCurrentPage, feedbackData, sessionId, isDarkMode = true }) => {
  // Add debugging logs right at the start
  console.log('🔍 FeedbackDetail component rendered with props:', {
    sessionId,
    feedbackData: feedbackData ? 'Present' : 'Not present',
    isDarkMode,
    setCurrentPage: typeof setCurrentPage
  });

  // State for dynamic data
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('feedback');
  const [showRawData, setShowRawData] = useState(false);

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

  // Enhanced fetchFeedbackData with extensive debugging
  const fetchFeedbackData = async () => {
    console.log('🚀 fetchFeedbackData called');
    console.log('📊 Current state:', { 
      sessionId, 
      feedbackData: !!feedbackData,
      apiBaseURL: apiService.baseURL
    });
    
    try {
      setIsLoading(true);
      setError(null);

      let feedbackResult;
      
      // Case 1: sessionId is provided - should fetch from backend
      if (sessionId) {
        console.log('✅ SessionId found, attempting API call:', sessionId);
        console.log('🔗 API Service base URL:', apiService.baseURL);
        
        try {
          // Test if API service is working first
          console.log('🏥 Testing API health check...');
          try {
            const healthCheck = await apiService.healthCheck();
            console.log('🏥 Health check result:', healthCheck);
          } catch (healthError) {
            console.warn('⚠️ Health check failed, but continuing with main API call:', healthError);
          }
          
          console.log('📞 Making API call to getFeedbackDetail...');
          console.log('📞 Full API URL will be:', `${apiService.baseURL}/api/feedback-sessions/${sessionId}`);
          
          feedbackResult = await apiService.getFeedbackDetail(sessionId);
          console.log('✅ API call successful:', feedbackResult);
          
          // Ensure it's marked as real data
          if (feedbackResult) {
            feedbackResult.hasRealData = true;
            feedbackResult.source = 'API_BACKEND';
            feedbackResult.apiSessionId = sessionId;
            console.log('✅ Marked as real data from API');
          } else {
            console.warn('⚠️ API returned null/undefined result');
            throw new Error('API returned empty result');
          }
          
        } catch (apiError) {
          console.error('❌ API call failed:', apiError);
          console.error('❌ Error details:', {
            message: apiError.message,
            stack: apiError.stack,
            name: apiError.name,
            apiUrl: `${apiService.baseURL}/api/feedback-sessions/${sessionId}`
          });
          
          // Don't fall back to demo data - show the error
          throw new Error(`Backend API Error: ${apiError.message}`);
        }
      } 
      // Case 2: feedbackData provided directly
      else if (feedbackData) {
        console.log('✅ Using provided feedbackData');
        feedbackResult = feedbackData;
        feedbackResult.source = 'DIRECT_PROP';
        feedbackResult.hasRealData = feedbackData.hasRealData !== false;
      } 
      // Case 3: No data provided - use demo
      else {
        console.log('⚠️ No sessionId or feedbackData provided, using demo data');
        feedbackResult = getDefaultFeedback();
        feedbackResult.source = 'DEMO_FALLBACK';
      }

      // Validate result
      if (!feedbackResult) {
        throw new Error('No feedback data received from any source');
      }

      console.log('📦 Final feedback result:', {
        id: feedbackResult.id,
        hasRealData: feedbackResult.hasRealData,
        source: feedbackResult.source,
        dataKeys: Object.keys(feedbackResult),
        transcript: feedbackResult.transcript ? 'Present' : 'Missing',
        rawAnalysis: feedbackResult.rawAnalysis ? 'Present' : 'Missing'
      });

      setFeedback(feedbackResult);
      
    } catch (error) {
      console.error('💥 fetchFeedbackData error:', error);
      setError(error.message);
      
      // Set feedback to null to trigger error display - DON'T fall back to demo data
      setFeedback(null);
    } finally {
      setIsLoading(false);
      console.log('🏁 fetchFeedbackData completed');
    }
  };

  // Enhanced getDefaultFeedback with clear demo marking
  const getDefaultFeedback = () => {
    console.log('🎭 Creating demo feedback data');
    return {
      id: 'DEMO_CALL',
      user: 'Demo User',
      date: new Date().toISOString().split('T')[0],
      duration: '4:32',
      rating: 4.3,
      fileName: 'demo_audio.mp3',
      transcript: '⚠️ THIS IS DEMO DATA ⚠️\n\nThe real API call was not triggered or failed. This is demonstration content to show how the interface works.\n\nExpected behavior: When you click on a session from the sessions list, it should fetch real analysis data from the backend API.\n\nIf you are seeing this message, check the browser console for API errors and ensure your Flask backend is running on port 8000.',
      issues: ['This is demo data - real API was not called successfully', 'Check console logs for API connection issues'],
      strengths: ['Demo data placeholder - not real analysis', 'Interface is working correctly'],
      sentiment: 'Demo',
      hasRealData: false,
      source: 'DEMO_DEFAULT',
      warning: '⚠️ This is demonstration data. The real API was not called successfully. Check console logs for details.'
    };
  };

  // Enhanced useEffect with debugging
  useEffect(() => {
    console.log('🔄 FeedbackDetail useEffect triggered');
    console.log('🔄 Dependencies:', { 
      sessionId, 
      feedbackData: !!feedbackData,
      dependencyTypes: {
        sessionId: typeof sessionId,
        feedbackData: typeof feedbackData
      }
    });
    
    // Add a small delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      console.log('⏰ Timer expired, calling fetchFeedbackData');
      fetchFeedbackData();
    }, 100);
    
    return () => {
      console.log('🧹 FeedbackDetail useEffect cleanup');
      clearTimeout(timer);
    };
  }, [sessionId, feedbackData]);

  // Test API service directly
  const testApiService = async () => {
    console.log('🧪 Testing API service directly...');
    try {
      console.log('🧪 1. Testing connection...');
      const isConnected = await apiService.testConnection();
      console.log('🧪 Connection test result:', isConnected);
      
      if (sessionId) {
        console.log('🧪 2. Testing getFeedbackDetail directly...');
        console.log('🧪 Session ID:', sessionId);
        console.log('🧪 Full URL:', `${apiService.baseURL}/api/feedback-sessions/${sessionId}`);
        
        const result = await apiService.getFeedbackDetail(sessionId);
        console.log('🧪 Direct API test result:', result);
        
        alert(`API Test Results:\n- Connection: ${isConnected ? 'SUCCESS' : 'FAILED'}\n- Data Fetch: SUCCESS\n- Has Data: ${!!result}`);
      } else {
        alert(`API Test Results:\n- Connection: ${isConnected ? 'SUCCESS' : 'FAILED'}\n- No Session ID to test data fetch`);
      }
    } catch (error) {
      console.error('🧪 API test failed:', error);
      alert(`API Test FAILED:\n${error.message}\n\nCheck console for details.`);
    }
  };

  // Force refresh with debug info
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    console.log('🔄 Current state before refresh:', {
      sessionId,
      hasCurrentFeedback: !!feedback,
      currentSource: feedback?.source
    });
    fetchFeedbackData();
  };

  // Development mode helpers
  const showDebugInfo = process.env.NODE_ENV === 'development';

  // Create performance categories from data
  const createPerformanceCategories = () => {
    if (!feedback) return [];

    const hasRealData = feedback.hasRealData || feedback.rawAnalysis;
    
    if (hasRealData && feedback.rawAnalysis) {
      // Extract from real backend analysis data
      const scores = feedback.scores || {};
      const backendAnalysis = feedback.rawAnalysis;
      
      return [
        {
          id: 'grammar',
          icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
          title: 'Grammar & Language',
          score: Math.round(scores.grammar || 75),
          color: 'from-blue-500 to-blue-600',
          details: `Detected ${backendAnalysis?.analysis?.grammar_issues?.length || 0} grammatical issues in the transcript.`,
          improvements: backendAnalysis?.analysis?.grammar_issues?.length > 3 
            ? "Focus on sentence structure and grammatical accuracy." 
            : "Good grammatical performance maintained."
        },
        {
          id: 'fluency',
          icon: <Ear className="w-6 h-6 text-purple-400" />,
          title: 'Speech Fluency',
          score: Math.round(scores.fluency || 80),
          color: 'from-purple-500 to-purple-600',
          details: `Speaking rate: ${backendAnalysis?.analysis?.speech_rate?.wpm || 'N/A'} words per minute.`,
          improvements: (backendAnalysis?.analysis?.speech_rate?.wpm || 130) < 120 
            ? "Consider speaking slightly faster for better engagement."
            : (backendAnalysis?.analysis?.speech_rate?.wpm || 130) > 160 
              ? "Consider slowing down for better comprehension."
              : "Good speaking pace maintained."
        },
        {
          id: 'filler_words',
          icon: <Heart className="w-6 h-6 text-pink-400" />,
          title: 'Filler Words',
          score: Math.round(scores.filler_words || 85),
          color: 'from-pink-500 to-pink-600',
          details: `Detected ${backendAnalysis?.analysis?.filler_words?.length || 0} filler words (um, uh, like, etc.).`,
          improvements: backendAnalysis?.analysis?.filler_words?.length > 5 
            ? "Try to reduce filler words by taking brief pauses instead."
            : "Good control of filler words demonstrated."
        },
        {
          id: 'pauses',
          icon: <Puzzle className="w-6 h-6 text-green-400" />,
          title: 'Pacing & Pauses',
          score: Math.round(scores.pauses || 78),
          color: 'from-green-500 to-green-600',
          details: `${backendAnalysis?.analysis?.pauses?.length || 0} significant pauses detected.`,
          improvements: backendAnalysis?.analysis?.pauses?.length > 8 
            ? "Work on reducing excessive pauses for smoother flow."
            : backendAnalysis?.analysis?.pauses?.length < 2
              ? "Consider adding strategic pauses for emphasis."
              : "Good use of pauses for natural speech rhythm."
        },
        {
          id: 'overall',
          icon: <TrendingUp className="w-6 h-6 text-orange-400" />,
          title: 'Overall Performance',
          score: Math.round(scores.overall || 80),
          color: 'from-orange-500 to-orange-600',
          details: "Combined analysis of all speech metrics and patterns.",
          improvements: scores.overall > 85 
            ? "Excellent overall performance with minor areas for refinement."
            : scores.overall > 70
              ? "Good performance with some areas for improvement."
              : "Focus on the specific areas highlighted for significant improvement."
        }
      ];
    } else {
      // Default categories for demo data
      return [
        {
          id: 'communication',
          icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
          title: 'Communication Clarity',
          score: 87,
          color: 'from-blue-500 to-blue-600',
          details: "DEMO: Overall communication effectiveness and clarity of expression.",
          improvements: "DEMO: Continue practicing clear and concise communication."
        },
        {
          id: 'grammar',
          icon: <Ear className="w-6 h-6 text-purple-400" />,
          title: 'Grammar & Language',
          score: 91,
          color: 'from-purple-500 to-purple-600',
          details: "DEMO: Grammatical accuracy and proper language usage.",
          improvements: "DEMO: Excellent grammatical performance maintained."
        },
        {
          id: 'flow',
          icon: <Heart className="w-6 h-6 text-pink-400" />,
          title: 'Speech Flow',
          score: 84,
          color: 'from-pink-500 to-pink-600',
          details: "DEMO: Natural rhythm and flow of speech patterns.",
          improvements: "DEMO: Work on reducing hesitations for smoother delivery."
        },
        {
          id: 'pronunciation',
          icon: <Puzzle className="w-6 h-6 text-green-400" />,
          title: 'Pronunciation',
          score: 89,
          color: 'from-green-500 to-green-600',
          details: "DEMO: Clarity and accuracy of word pronunciation.",
          improvements: "DEMO: Excellent pronunciation maintained throughout."
        },
        {
          id: 'overall',
          icon: <SlidersHorizontal className="w-6 h-6 text-orange-400" />,
          title: 'Overall Fluency',
          score: 88,
          color: 'from-orange-500 to-orange-600',
          details: "DEMO: Combined assessment of all speech aspects.",
          improvements: "DEMO: Strong overall performance with room for minor improvements."
        }
      ];
    }
  };

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
      case 'Demo':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getOverallScore = () => {
    if (!feedback) return 0;
    
    const feedbackCategories = createPerformanceCategories();
    if (feedback.hasRealData && feedback.scores?.overall) {
      return Math.round(feedback.scores.overall);
    }
    
    const totalScore = feedbackCategories.reduce((sum, category) => sum + category.score, 0);
    return Math.round(totalScore / feedbackCategories.length);
  };

  // Debug panel for development
//   const debugPanel = showDebugInfo && (
//     <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
//       <div className="font-bold text-yellow-400 mb-2">Debug Panel (Development Only)</div>
//       <div className="space-y-2 text-sm text-yellow-200">
//         <p>SessionId: {sessionId || 'None'}</p>
//         <p>Has FeedbackData Prop: {feedbackData ? 'Yes' : 'No'}</p>
//         <p>Current Feedback Source: {feedback?.source || 'None'}</p>
//         <p>Has Real Data: {feedback?.hasRealData ? 'Yes' : 'No'}</p>
//         <p>API Base URL: {apiService.baseURL}</p>
//         <p>Loading State: {isLoading ? 'Yes' : 'No'}</p>
//         <p>Error State: {error ? error : 'None'}</p>
//         <div className="flex gap-2 mt-2">
//           <button 
//             onClick={testApiService}
//             className="px-3 py-1 bg-yellow-600 text-white rounded text-xs"
//           >
//             Test API
//           </button>
//           <button 
//             onClick={handleRefresh}
//             className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
//           >
//             Force Refresh
//           </button>
//           <button 
//             onClick={() => setShowRawData(!showRawData)}
//             className="px-3 py-1 bg-green-600 text-white rounded text-xs"
//           >
//             Toggle Raw Data
//           </button>
//         </div>
//       </div>
//     </div>
//   );

  // Loading state with debug info
  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} font-['Proxima_Nova',_system-ui,_-apple-system,_sans-serif] overflow-hidden transition-colors duration-300`}>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setCurrentPage={setCurrentPage} 
          isDarkMode={isDarkMode} 
          toggleTheme={() => {}} 
        />
        <div className="ml-20 lg:ml-64 min-h-screen">
          <div className="p-8 lg:p-10">
            {/* {debugPanel} */}
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Loader  className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-500" />
                <h3 className="text-xl font-semibold mb-2">Loading Feedback Analysis</h3>
                <p className={theme.subtext}>
                  SessionId: {sessionId || 'None'} | 
                  FeedbackData: {feedbackData ? 'Present' : 'None'}
                </p>
                <p className={`${theme.subtext} text-sm mt-2`}>
                  API URL: {apiService.baseURL}
                </p>
                {showDebugInfo && (
                  <button 
                    onClick={testApiService}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Test API While Loading
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with debug info
  if (error) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} font-['Proxima_Nova',_system-ui,_-apple-system,_sans-serif] overflow-hidden transition-colors duration-300`}>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setCurrentPage={setCurrentPage} 
          isDarkMode={isDarkMode} 
          toggleTheme={() => {}} 
        />
        <div className="ml-20 lg:ml-64 min-h-screen">
          <div className="p-8 lg:p-10">
            {/* {debugPanel} */}
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-2xl">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Failed to Load Feedback</h3>
                <p className={`${theme.subtext} mb-4`}>{error}</p>
                
                <div className="text-sm text-gray-500 mb-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-left">
                    <p><strong>SessionId:</strong> {sessionId || 'None'}</p>
                    <p><strong>FeedbackData:</strong> {feedbackData ? 'Present' : 'None'}</p>
                    <p><strong>API Base URL:</strong> {apiService.baseURL}</p>
                    <p><strong>Expected API Endpoint:</strong> {apiService.baseURL}/api/feedback-sessions/{sessionId || 'SESSION_ID'}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleRefresh}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry API Call
                  </button>
                  {showDebugInfo && (
                    <button 
                      onClick={testApiService}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Test API Connection
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentPage('feedback')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                  >
                    Back to Sessions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No feedback state
  if (!feedback) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} font-['Proxima_Nova',_system-ui,_-apple-system,_sans-serif] overflow-hidden transition-colors duration-300`}>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setCurrentPage={setCurrentPage} 
          isDarkMode={isDarkMode} 
          toggleTheme={() => {}} 
        />
        <div className="ml-20 lg:ml-64 min-h-screen">
          <div className="p-8 lg:p-10">
            {/* {debugPanel} */}
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold mb-2">No Feedback Data</h3>
                <p className={theme.subtext}>
                  SessionId: {sessionId || 'None'} | 
                  FeedbackData: {feedbackData ? 'Present' : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const feedbackCategories = createPerformanceCategories();
  const hasRealData = feedback.hasRealData || feedback.rawAnalysis;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-['Proxima_Nova',_system-ui,_-apple-system,_sans-serif] overflow-hidden transition-colors duration-300`}>
      {/* Side Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setCurrentPage={setCurrentPage} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => {}} 
      />

      {/* Main Content */}
      <div className="ml-20 lg:ml-64 min-h-screen">
        <div className="p-8 lg:p-10">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setCurrentPage('feedback')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700/30' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Feedback Sessions
            </button>
            
            {/* Data Source Indicator */}
            <div className="flex items-center gap-2">
              {hasRealData ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Live Analysis Data
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Demo Data (API Failed)
                </div>
              )}
              
              <button
                onClick={handleRefresh}
                className="p-2 bg-gray-600/50 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Debug Panel */}
          {/* {debugPanel} */}

          {/* Backend Warning */}
          {feedback.warning && (
            <div className="mb-6 p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-300">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Processing Notice</span>
              </div>
              <p className="text-yellow-200 text-sm mt-1">{feedback.warning}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-8">
            {/* Call Summary Card */}
            <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
              <div className={`absolute right-0 top-0 w-full h-1 ${hasRealData ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'} rounded-t-3xl`}></div>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
                    {hasRealData ? 'AI Speech Analysis' : 'Demo Feedback Analysis'}: {feedback.id}
                  </h1>
                  <div className="space-y-2 text-lg">
                    <p className={`${theme.text}`}>
                      <span className={theme.subtext}>User:</span> <span className="font-semibold">{feedback.user}</span>
                      <span className={`${theme.subtext} mx-3`}>|</span>
                      <span className={theme.subtext}>Date:</span> <span className="font-semibold">{feedback.date}</span>
                    </p>
                    <p className={`${theme.text}`}>
                      <span className={theme.subtext}>Duration:</span> <span className="font-semibold">{feedback.duration}</span>
                      <span className={`${theme.subtext} mx-3`}>|</span>
                      <span className={theme.subtext}>File:</span> <span className="font-semibold">{feedback.fileName}</span>
                    </p>
                    <p className={`${theme.text}`}>
                      <span className={theme.subtext}>Source:</span> <span className="font-semibold">{feedback.source}</span>
                      {feedback.apiSessionId && (
                        <>
                          <span className={`${theme.subtext} mx-3`}>|</span>
                          <span className={theme.subtext}>Session:</span> <span className="font-semibold">{feedback.apiSessionId}</span>
                        </>
                      )}
                    </p>
                    {hasRealData && feedback.rawAnalysis && (
                      <p className={`${theme.text}`}>
                        <span className={theme.subtext}>Processing:</span> 
                        <span className="font-semibold ml-2">
                          {feedback.rawAnalysis?.analysis?.speech_rate?.wpm ? 
                            `${feedback.rawAnalysis.analysis.speech_rate.wpm} WPM` : 'Analyzed'}
                        </span>
                        <span className={`${theme.subtext} mx-3`}>|</span>
                        <span className={theme.subtext}>Issues:</span> 
                        <span className="font-semibold ml-2">
                          {feedback.rawAnalysis?.analysis?.grammar_issues?.length || 0} Grammar, 
                          {feedback.rawAnalysis?.analysis?.filler_words?.length || 0} Fillers
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center lg:items-end gap-4">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    <span className="text-4xl font-bold">{feedback.rating}</span>
                    <span className={`${theme.subtext} text-xl`}>/5.0</span>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold border ${getSentimentColor(feedback.sentiment)}`}>
                    {feedback.sentiment} Analysis
                  </span>
                </div>
              </div>

              {/* Overall Score */}
              <div className={`${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20' 
                  : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
              } rounded-2xl p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Overall Performance Score</h3>
                  <span className={`text-5xl font-bold ${getScoreColor(getOverallScore())}`}>
                    {getOverallScore()}%
                  </span>
                </div>
                <div className={`w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full h-4`}>
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${getOverallScore()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Transcript Card */}
            <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
              <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                {hasRealData ? 'AI Generated Transcript' : 'Demo Transcript'}
              </h3>
              <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-2xl p-6 h-64 overflow-y-auto border ${theme.border}`}>
                <p className={`${theme.text} leading-relaxed text-lg whitespace-pre-line`}>
                  {feedback.transcript}
                </p>
                {hasRealData && feedback.rawAnalysis?.processing_info && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-sm text-gray-400">
                      Transcript generated from {feedback.rawAnalysis.processing_info.format || 'audio'} file
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Issues & Strengths */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Issues */}
              {feedback.issues && feedback.issues.length > 0 && (
                <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
                  <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-3xl"></div>
                  <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                    <AlertTriangle className="w-8 h-8 mr-3" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-3">
                    {feedback.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-red-300 text-lg">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Strengths */}
              {feedback.strengths && feedback.strengths.length > 0 && (
                <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
                  <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-3xl"></div>
                  <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                    <Check className="w-8 h-8 mr-3" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-3">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-green-300 text-lg">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Performance Categories */}
            <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
              <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
              <h3 className="text-2xl font-bold mb-8 flex items-center">
                <SlidersHorizontal className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Detailed Performance Analysis
                {hasRealData ? (
                  <span className="ml-3 px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
                    AI Generated
                  </span>
                ) : (
                  <span className="ml-3 px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm">
                    Demo Data
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {feedbackCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-2xl p-6 cursor-pointer transition-all duration-200 border ${theme.border} hover:shadow-xl group`}
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? '' : category.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl transition-transform duration-200 group-hover:scale-110">
                          {category.icon}
                        </div>
                        <h4 className="font-bold text-xl">{category.title}</h4>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                        {category.score}%
                      </span>
                    </div>
                    
                    <div className={`w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full h-3 mb-4`}>
                      <div 
                        className={`bg-gradient-to-r ${category.color} h-3 rounded-full transition-all duration-1000`}
                        style={{ width: `${category.score}%` }}
                      ></div>
                    </div>

                    {expandedCategory === category.id && (
                      <div className="space-y-4 pt-4 border-t border-gray-600">
                        <div>
                          <p className="font-semibold mb-2">Analysis:</p>
                          <p className={`${theme.subtext} text-lg`}>{category.details}</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Recommendations:</p>
                          <p className={`${theme.subtext} text-lg`}>{category.improvements}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
              <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">
                {hasRealData ? 'AI-Generated Detailed Analysis' : 'Demo AI Insights & Recommendations'}
              </h3>
              
              {hasRealData && feedback.rawAnalysis?.structured_insights ? (
                <div className="space-y-6">
                  {/* Extract and display structured insights */}
                  <div className={`${
                    isDarkMode 
                      ? 'bg-indigo-600/10 border border-indigo-500/30' 
                      : 'bg-indigo-50 border border-indigo-200'
                  } rounded-2xl p-6`}>
                    <h4 className="font-bold text-indigo-400 mb-3 text-xl">AI Analysis Summary</h4>
                    <div className={`${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'} text-lg leading-relaxed`}>
                      {feedback.rawAnalysis.structured_insights.structured_format ? (
                        <div className="whitespace-pre-line">
                          {feedback.rawAnalysis.structured_insights.structured_format.split('\n').slice(0, 10).join('\n')}
                        </div>
                      ) : (
                        <p>Comprehensive analysis completed with detailed insights generated.</p>
                      )}
                    </div>
                  </div>
                  
                  {feedback.rawAnalysis.structured_insights.hf_analysis && (
                    <div className={`${
                      isDarkMode 
                        ? 'bg-purple-600/10 border border-purple-500/30' 
                        : 'bg-purple-50 border border-purple-200'
                    } rounded-2xl p-6`}>
                      <h4 className="font-bold text-purple-400 mb-3 text-xl">AI Model Insights</h4>
                      <p className={`${isDarkMode ? 'text-purple-200' : 'text-purple-700'} text-lg leading-relaxed`}>
                        {feedback.rawAnalysis.structured_insights.hf_analysis}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`${
                    isDarkMode 
                      ? 'bg-red-600/10 border border-red-500/30' 
                      : 'bg-red-50 border border-red-200'
                  } rounded-2xl p-6`}>
                    <h4 className="font-bold text-red-400 mb-3 text-xl">⚠️ Demo Data Notice</h4>
                    <p className={`${isDarkMode ? 'text-red-200' : 'text-red-700'} text-lg leading-relaxed`}>
                      This is demonstration data because the real API call failed or was not triggered. 
                      The system should be fetching live analysis data from your backend API at: 
                      <code className="bg-gray-800 px-2 py-1 rounded text-sm ml-2">{apiService.baseURL}/api/feedback-sessions/{sessionId || 'SESSION_ID'}</code>
                    </p>
                  </div>
                  <div className={`${
                    isDarkMode 
                      ? 'bg-purple-600/10 border border-purple-500/30' 
                      : 'bg-purple-50 border border-purple-200'
                  } rounded-2xl p-6`}>
                    <h4 className="font-bold text-purple-400 mb-3 text-xl">Demo Action Items</h4>
                    <ul className={`space-y-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-700'} text-lg`}>
                      <li>• Check if your Flask backend is running on port 8000</li>
                      <li>• Verify the API endpoint exists: /api/feedback-sessions/{sessionId || 'SESSION_ID'}</li>
                      <li>• Check browser console for detailed error messages</li>
                      <li>• Ensure the session data exists in your database</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Raw Data Section */}
            {showRawData && (
              <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden`}>
                <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-gray-500 to-gray-600 rounded-t-3xl"></div>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Info className="mr-3 text-gray-400" />
                  Raw Data (Development Debug)
                </h3>
                <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-2xl p-6 h-96 overflow-y-auto border ${theme.border}`}>
                  <pre className={`${theme.text} text-sm leading-relaxed`}>
                    {JSON.stringify(feedback, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;