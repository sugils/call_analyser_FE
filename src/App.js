// Updated App.js - With Enhanced Dashboard and UserDashboard + SessionId Fix
import React, { useState } from 'react';
import './App.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import UserDashboard from './components/UserDashboard';
import UploadAudio from './components/UploadAudio';
import FeedbackSessions from './components/FeedbackSessions';
import Analytics from './components/Analytics';
import Calendar from './components/Calendar';
import Navbar from './components/Navbar';
import FeedbackDetail from './components/FeedbackDetail';
import { useUser } from './contexts/UserContext';
import { useTheme } from './contexts/ThemeContext';

// Main App Content Component
function AppContent() {
  const { isAuthenticated } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [currentPage, setCurrentPage] = useState('login');
  const [activeTab, setActiveTab] = useState('overview');
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null); // ADD THIS STATE
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Peter Jones', email: 'peter@example.com' }
  ]);

  // FIXED: Update navigateToFeedbackDetail to accept both parameters
  const navigateToFeedbackDetail = (feedbackData, sessionId) => {
    console.log('🧭 App: navigateToFeedbackDetail called with:', { 
      feedbackData: feedbackData ? 'Present' : 'Not present', 
      sessionId 
    });
    
    // Validate that we have either feedbackData or sessionId
    if (!feedbackData && !sessionId) {
      console.error('❌ App: No feedbackData or sessionId provided to navigateToFeedbackDetail');
      alert('Error: No session data provided for navigation');
      return;
    }
    
    // Set both states
    setCurrentFeedback(feedbackData);
    setCurrentSessionId(sessionId); // ADD THIS LINE
    setCurrentPage('feedback-detail');
    setActiveTab('feedback');
    
    console.log('✅ App: Navigation states set:', {
      currentPage: 'feedback-detail',
      currentSessionId: sessionId,
      currentFeedback: feedbackData ? 'Present' : 'Not present'
    });
  };

  // Add this function to handle user dashboard navigation
  const navigateToUserDashboard = (userId) => {
    setSelectedUserId(userId);
    setCurrentPage('user-dashboard');
    setActiveTab('users');
  };

  // Function to navigate back and clear states
  const navigateBack = (pageName) => {
    console.log('🔙 App: Navigating back to:', pageName);
    setCurrentPage(pageName);
    setCurrentFeedback(null);
    setCurrentSessionId(null); // Clear session ID when navigating back
  };

  // Automatically redirect to dashboard if authenticated
  React.useEffect(() => {
    if (isAuthenticated && currentPage === 'login') {
      setCurrentPage('dashboard');
    }
  }, [isAuthenticated, currentPage]);

  // Debug current app state
  console.log('🔍 App current state:', {
    currentPage,
    currentSessionId,
    hasCurrentFeedback: !!currentFeedback,
    selectedUserId
  });

  const renderPage = () => {
    // Show landing page if not authenticated
    if (!isAuthenticated || currentPage === 'login') {
      return <LandingPage setCurrentPage={setCurrentPage} />;
    }

    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
        <Navbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCurrentPage={setCurrentPage}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
        <div className="transition-all duration-300">
          {renderMainContent()}
        </div>
        
        {/* Add debug panel in development mode */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-sm max-w-xs">
            <div className="font-bold mb-2 text-yellow-400">🔍 Navigation Debug</div>
            <div className="space-y-1 text-xs">
              <div>Page: <span className="text-green-400">{currentPage}</span></div>
              <div>Session ID: <span className="text-blue-400">{currentSessionId || 'None'}</span></div>
              <div>Feedback: <span className="text-purple-400">{currentFeedback ? 'Present' : 'None'}</span></div>
              <div>User ID: <span className="text-orange-400">{selectedUserId || 'None'}</span></div>
            </div>
            <button 
              onClick={() => console.log('🔍 Full App State:', {
                currentPage,
                currentSessionId,
                currentFeedback,
                selectedUserId,
                activeTab
              })}
              className="mt-2 px-2 py-1 bg-blue-600 rounded text-xs w-full"
            >
              Log Full State
            </button>
          </div>
        )} */}
      </div>
    );
  };

  const renderMainContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard 
          setCurrentPage={setCurrentPage} 
          isDarkMode={isDarkMode} 
          navigateToUserDashboard={navigateToUserDashboard}
        />;
      case 'users':
        return <UserManagement 
          setCurrentPage={setCurrentPage} 
          users={users} 
          isDarkMode={isDarkMode}
          navigateToUserDashboard={navigateToUserDashboard}
        />;
      case 'user-dashboard':
        return <UserDashboard 
          userId={selectedUserId}
          setCurrentPage={setCurrentPage}
          isDarkMode={isDarkMode}
          navigateToFeedbackDetail={navigateToFeedbackDetail}
        />;
      case 'upload':
        return <UploadAudio 
          setCurrentPage={setCurrentPage} 
          users={users} 
          isDarkMode={isDarkMode}
          navigateToFeedbackDetail={navigateToFeedbackDetail}
        />;
      case 'feedback':
        return <FeedbackSessions 
          setCurrentPage={setCurrentPage} 
          isDarkMode={isDarkMode}
          navigateToFeedbackDetail={navigateToFeedbackDetail}
        />;
      case 'feedback-detail':
        return <FeedbackDetail 
          setCurrentPage={navigateBack} // Use navigateBack instead of setCurrentPage
          feedbackData={currentFeedback}
          sessionId={currentSessionId} // ADD THIS PROP - This was missing!
          isDarkMode={isDarkMode}
        />;
      case 'analytics':
        return (
          <div className={`ml-20 lg:ml-64 min-h-screen p-8 transition-colors duration-300 ${
            isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-900'
          }`}>
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Analytics</h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Advanced performance analytics and insights
                </p>
              </div>
              
              <div className={`rounded-2xl p-8 text-center transition-colors duration-300 ${
                isDarkMode ? 'bg-[#1e293b] border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Analytics Dashboard</h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Coming soon - Advanced analytics and performance metrics
                </p>
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className={`ml-20 lg:ml-64 min-h-screen p-8 transition-colors duration-300 ${
            isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-gray-900'
          }`}>
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Calendar</h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Schedule and manage your team's activities
                </p>
              </div>
              
              <div className={`rounded-2xl p-8 text-center transition-colors duration-300 ${
                isDarkMode ? 'bg-[#1e293b] border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Calendar System</h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Coming soon - Team scheduling and event management
                </p>
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard 
          setCurrentPage={setCurrentPage} 
          isDarkMode={isDarkMode} 
          navigateToUserDashboard={navigateToUserDashboard}
        />;
    }
  };

  return <div className="App">{renderPage()}</div>;
}

// Main App Component with Providers
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;