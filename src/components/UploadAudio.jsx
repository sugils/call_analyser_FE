import React, { useState, useEffect } from 'react';
import { FileAudio, Play, Pause, Upload, X, CheckCircle, AlertCircle, Loader, MessageSquare, User, Wifi, WifiOff, RefreshCw, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import apiService from './apiService';

const UploadAudio = ({ setCurrentPage, navigateToFeedbackDetail, isDarkMode = true }) => {
  // State for users and audio upload
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState({ stage: '', progress: 0 });
  const [audioPreview, setAudioPreview] = useState(null);
  const [processingStage, setProcessingStage] = useState('');

  // System status and error handling
  const [systemStatus, setSystemStatus] = useState({ online: false, checking: true });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [activeTab, setActiveTab] = useState('upload');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const supportedFormats = ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac'];

  // Enhanced theme with better colors and gradients
  const themes = {
    dark: {
      bg: 'bg-slate-900',
      cardBg: 'bg-slate-800/80',
      text: 'text-slate-100',
      subtext: 'text-slate-400',
      border: 'border-slate-700/60',
      hover: 'hover:bg-slate-700/50',
      input: 'bg-slate-700/60 border-slate-600/50 text-slate-100',
      button: {
        primary: 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25',
        secondary: 'bg-slate-700/70 hover:bg-slate-600/70 text-slate-200 border border-slate-600/50',
        success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25',
        danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/25'
      },
      accent: {
        primary: 'text-blue-400',
        success: 'text-emerald-400',
        warning: 'text-amber-400',
        danger: 'text-red-400'
      }
    },
    light: {
      bg: 'bg-slate-50',
      cardBg: 'bg-white/90',
      text: 'text-slate-800',
      subtext: 'text-slate-500',
      border: 'border-slate-200/60',
      hover: 'hover:bg-slate-100/50',
      input: 'bg-white border-slate-300 text-slate-800',
      button: {
        primary: 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25',
        secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300',
        success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25',
        danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-500/25'
      },
      accent: {
        primary: 'text-blue-600',
        success: 'text-emerald-600',
        warning: 'text-amber-600',
        danger: 'text-red-600'
      }
    }
  };

  const theme = isDarkMode ? themes.dark : themes.light;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Fetch users and system status on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      await Promise.all([
        fetchUsers(),
        checkSystemStatus()
      ]);
    };
    
    initializeComponent();
  }, []);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const usersData = await apiService.getUsers();
      const formattedUsers = usersData.map(user => apiService.formatUserForFrontend(user));
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users: ' + error.message);
      showToastMessage('Failed to load users: ' + error.message, 'error');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Check system status
  const checkSystemStatus = async () => {
    try {
      const status = await apiService.getSystemStatus();
      setSystemStatus({ ...status, checking: false });
    } catch (error) {
      setSystemStatus({ online: false, checking: false, error: error.message });
    }
  };

  // Show toast notification
  const showToastMessage = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Validate file
  const validateFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!supportedFormats.includes(fileExtension)) {
      showToastMessage(`Unsupported format: .${fileExtension}. Please upload: ${supportedFormats.join(', ')}`);
      return false;
    }
    if (file.size > 100 * 1024 * 1024) { // 100MB
      showToastMessage('File size exceeds 100MB limit');
      return false;
    }
    return true;
  };

  // Handle file selection
  const handleFileSelect = (files) => {
    if (files.length > 0 && selectedUser) {
      const file = files[0];
      if (validateFile(file)) {
        setUploadedFile(file);
        const audioUrl = URL.createObjectURL(file);
        setAudioPreview(audioUrl);
        setIsAnalyzing(false);
        setAnalysisProgress({ stage: '', progress: 0 });
        setProcessingStage('');
      }
    } else if (files.length > 0 && !selectedUser) {
      showToastMessage('Please select a user before uploading audio');
    }
  };

  // Get progress message with more detailed stages
  const getProgressMessage = (stage, progress) => {
    switch (stage) {
      case 'uploading':
        return progress < 50 ? 'Preparing audio file for upload...' : 'Uploading audio file to server...';
      case 'processing':
        return progress < 25 ? 'Initializing audio processing...' : 
               progress < 50 ? 'Converting audio format...' :
               progress < 75 ? 'Extracting audio features...' : 
               'Generating transcript from audio...';
      case 'analyzing':
        return progress < 30 ? 'Analyzing speech patterns...' :
               progress < 60 ? 'Evaluating grammar and fluency...' :
               progress < 85 ? 'Calculating performance metrics...' :
               'Finalizing speech analysis...';
      case 'generating':
        return progress < 40 ? 'Generating AI insights...' :
               progress < 70 ? 'Creating detailed feedback...' :
               'Preparing comprehensive report...';
      case 'complete':
        return 'Analysis complete! Redirecting to feedback...';
      default:
        return 'Processing audio...';
    }
  };

  // Get stage icon
  const getStageIcon = (stage) => {
    switch (stage) {
      case 'uploading':
        return <Upload className="w-6 h-6" />;
      case 'processing':
        return <FileAudio className="w-6 h-6" />;
      case 'analyzing':
        return <MessageSquare className="w-6 h-6" />;
      case 'generating':
        return <CheckCircle className="w-6 h-6" />;
      case 'complete':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Loader className="w-6 h-6" />;
    }
  };

  // Get estimated time remaining
  const getEstimatedTime = (stage, progress) => {
    const stageWeights = {
      uploading: 10,
      processing: 40,
      analyzing: 35,
      generating: 15
    };
    
    const currentStageWeight = stageWeights[stage] || 25;
    const completedWeight = Object.keys(stageWeights).reduce((acc, key) => {
      if (key === stage) return acc + (currentStageWeight * progress / 100);
      const stageIndex = Object.keys(stageWeights).indexOf(key);
      const currentIndex = Object.keys(stageWeights).indexOf(stage);
      return stageIndex < currentIndex ? acc + stageWeights[key] : acc;
    }, 0);
    
    const remainingWeight = 100 - completedWeight;
    const estimatedMinutes = Math.ceil((remainingWeight / 100) * 3); // Assume 3 minutes total
    
    return estimatedMinutes <= 1 ? 'Less than a minute' : `~${estimatedMinutes} minutes`;
  };

  // Handle feedback generation (main analysis function)
  const handleGenerateFeedback = async () => {
    if (!uploadedFile || !selectedUser) {
      showToastMessage('Please select a user and upload an audio file');
      return;
    }

    if (!systemStatus.online) {
      showToastMessage('Backend service is not available. Please check system status.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress({ stage: 'uploading', progress: 0 });

    try {
      const onProgress = (progressData) => {
        setAnalysisProgress(progressData);
        setProcessingStage(getProgressMessage(progressData.stage, progressData.progress));
      };

      const analysisResult = await apiService.analyzeSpeech(uploadedFile, selectedUser, onProgress);
      
      setAnalysisProgress({ stage: 'complete', progress: 100 });
      setProcessingStage('Analysis complete! Redirecting to feedback...');
      
      showToastMessage('Analysis completed successfully!', 'success');
      
      setTimeout(() => {
        navigateToFeedbackDetail(analysisResult);
      }, 1500);

    } catch (error) {
      setIsAnalyzing(false);
      setAnalysisProgress({ stage: '', progress: 0 });
      setProcessingStage('');
      console.error('Analysis failed:', error);
      showToastMessage('Analysis failed: ' + error.message);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setUploadedFile(null);
    setAudioPreview(null);
    setIsPlaying(false);
    setIsAnalyzing(false);
    setAnalysisProgress({ stage: '', progress: 0 });
    setProcessingStage('');
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    Promise.all([
      fetchUsers(),
      checkSystemStatus()
    ]);
  };

  const selectedUserData = users.find(u => u.id === selectedUser);

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans antialiased transition-all duration-300`}>
      {/* Enhanced Toast Notification */}
      {showToast && (
        <div className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-xl backdrop-blur-md shadow-2xl flex items-start gap-3 transition-all duration-500 transform ${
          showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } ${toastType === 'error' 
          ? 'bg-red-500/90 border border-red-400/50' 
          : 'bg-emerald-500/90 border border-emerald-400/50'
        }`}>
          <div className="flex-shrink-0 mt-0.5">
            {toastType === 'error' ? 
              <AlertCircle className="w-5 h-5 text-white" /> : 
              <CheckCircle className="w-5 h-5 text-white" />
            }
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm leading-relaxed">{toastMessage}</p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="flex-shrink-0 p-1 rounded-md hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white/80 hover:text-white" />
          </button>
        </div>
      )}

      {/* Side Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setCurrentPage={setCurrentPage} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => {}} 
      />

      <div className="ml-20 lg:ml-64 p-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Audio Analysis Hub
              </h1>
              <p className={`text-lg ${theme.subtext} font-medium`}>
                Upload and analyze call recordings with AI-powered insights
              </p>
            </div>
            
            {/* Enhanced System Status */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${
                systemStatus.checking 
                  ? 'bg-amber-500/10 border-amber-400/30 text-amber-400'
                  : systemStatus.online 
                    ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-400/30 text-red-400'
              }`}>
                {systemStatus.checking ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Checking...</span>
                  </>
                ) : systemStatus.online ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Offline</span>
                  </>
                )}
              </div>
              <button
                onClick={handleRefresh}
                className={`p-2 rounded-lg ${theme.button.secondary} transition-all duration-200 hover:scale-105`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* System Status Alert */}
        {!systemStatus.online && !systemStatus.checking && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-400/30 rounded-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-300 text-lg mb-1">Service Unavailable</h3>
                <p className="text-red-200 leading-relaxed">
                  The speech analysis service is currently unavailable. Please ensure the backend server is running and try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Upload Section */}
          <div className="xl:col-span-2 space-y-8">
            {/* Enhanced User Selection */}
            <div className={`${theme.cardBg} backdrop-blur-sm rounded-2xl p-8 border ${theme.border} shadow-xl relative z-[60]`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-400/20">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Select User</h2>
                  <p className={`text-sm ${theme.subtext}`}>Choose who this audio analysis is for</p>
                </div>
              </div>
              
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-blue-400" />
                  <span className="ml-3 text-lg font-medium">Loading users...</span>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-500/10 border border-red-400/30 rounded-xl">
                  <p className="text-red-300 font-medium">{error}</p>
                </div>
              ) : users.length === 0 ? (
                <div className="p-6 bg-amber-500/10 border border-amber-400/30 rounded-xl text-center">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <p className="text-amber-300 font-medium">No users available</p>
                  <p className="text-amber-200/80 text-sm mt-1">Please add users first to continue</p>
                </div>
              ) : (
                <div className="relative user-dropdown-container z-[60]">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isAnalyzing}
                    className={`w-full px-6 py-4 ${theme.input} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all duration-200 flex items-center justify-between text-left ${
                      isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {selectedUserData ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold">
                            {selectedUserData.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{selectedUserData.name}</p>
                            <p className={`text-sm ${theme.subtext}`}>{selectedUserData.email} • {selectedUserData.role}</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full border-2 border-dashed ${theme.border} flex items-center justify-center`}>
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <span className={theme.subtext}>Select a user...</span>
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 ${theme.subtext} transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
  <div className={`absolute top-full left-0 right-0 mt-2 ${theme.cardBg} border ${theme.border} rounded-xl shadow-2xl z-[9999] max-h-64 overflow-y-auto`}
       style={{
         backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.98)' : 'rgba(255, 255, 255, 0.98)',
         backdropFilter: 'blur(20px)',
         WebkitBackdropFilter: 'blur(20px)'
       }}>
    {users.map(user => (
      <button
        key={user.id}
        onClick={() => {
          setSelectedUser(user.id);
          setIsDropdownOpen(false);
        }}
        className={`w-full px-6 py-4 text-left hover:bg-blue-500/20 transition-colors duration-200 flex items-center gap-3 ${
          selectedUser === user.id ? 'bg-blue-500/20 border-r-2 border-blue-400' : ''
        }`}
        style={{
          backgroundColor: selectedUser === user.id 
            ? (isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)') 
            : 'transparent'
        }}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className={`text-sm ${theme.subtext}`}>{user.email} • {user.role}</p>
        </div>
      </button>
    ))}
  </div>
)}
                </div>
              )}
            </div>

            {/* Enhanced Upload Area */}
            <div className={`${theme.cardBg} backdrop-blur-sm rounded-2xl p-8 border ${theme.border} shadow-xl transition-all duration-500 ${
              isAnalyzing ? 'ring-2 ring-blue-500/30 shadow-2xl shadow-blue-500/10' : ''
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg border transition-all duration-300 ${
                  isAnalyzing 
                    ? 'bg-blue-500/20 border-blue-400/40 animate-pulse' 
                    : 'bg-violet-500/10 border-violet-400/20'
                }`}>
                  {isAnalyzing ? (
                    <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                  ) : (
                    <FileAudio className="w-5 h-5 text-violet-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {isAnalyzing ? 'Analyzing Audio...' : 'Audio Upload'}
                  </h2>
                  <p className={`text-sm ${theme.subtext}`}>
                    {isAnalyzing 
                      ? 'AI is processing your audio file' 
                      : 'Drag & drop or browse to upload your audio file'
                    }
                  </p>
                </div>
              </div>

              {/* Show processing overlay when analyzing */}
              {isAnalyzing ? (
                <div className="space-y-8">
                  {/* Animated Processing Header */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-violet-500/20 animate-pulse"></div>
                      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500/30 to-violet-500/30 animate-ping"></div>
                      <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center">
                        {getStageIcon(analysisProgress.stage)}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                      Processing Your Audio
                    </h3>
                    <p className={`${theme.subtext} text-lg`}>
                      AI is analyzing your recording for insights
                    </p>
                  </div>

                  {/* Real-time Progress Section */}
                  <div className="bg-gradient-to-r from-blue-500/5 to-violet-500/5 border border-blue-400/20 rounded-2xl p-8 space-y-6">
                    {/* Current Stage Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400/30">
                          {getStageIcon(analysisProgress.stage)}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-blue-300 capitalize">
                            {analysisProgress.stage || 'Processing'}
                          </h4>
                          <p className="text-sm text-blue-200/80">
                            {getProgressMessage(analysisProgress.stage, analysisProgress.progress)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-400 mb-1">
                          {analysisProgress.progress}%
                        </div>
                        <div className="text-xs text-blue-300/70">
                          ETA: {getEstimatedTime(analysisProgress.stage, analysisProgress.progress)}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300 font-medium">Progress</span>
                        <span className="text-blue-400 font-bold">{analysisProgress.progress}% Complete</span>
                      </div>
                      <div className="relative h-4 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                          style={{ 
                            width: `${analysisProgress.progress}%`,
                            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white/90 mix-blend-difference">
                            {analysisProgress.progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stage Progress Indicators */}
                    <div className="grid grid-cols-4 gap-4">
                      {['uploading', 'processing', 'analyzing', 'generating'].map((stage, index) => {
                        const currentStageIndex = ['uploading', 'processing', 'analyzing', 'generating'].indexOf(analysisProgress.stage);
                        const isCompleted = index < currentStageIndex;
                        const isCurrent = index === currentStageIndex;

                        return (
                          <div key={stage} className={`text-center p-3 rounded-xl border transition-all duration-300 ${
                            isCompleted 
                              ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300' 
                              : isCurrent 
                                ? 'bg-blue-500/10 border-blue-400/30 text-blue-300 animate-pulse' 
                                : 'bg-slate-700/30 border-slate-600/30 text-slate-500'
                          }`}>
                            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              isCompleted 
                                ? 'bg-emerald-500/20' 
                                : isCurrent 
                                  ? 'bg-blue-500/20' 
                                  : 'bg-slate-600/20'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : isCurrent ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                getStageIcon(stage)
                              )}
                            </div>
                            <p className="text-xs font-medium capitalize">{stage}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* File Info During Processing */}
                    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center">
                        <FileAudio className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{uploadedFile?.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{(uploadedFile?.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>{selectedUserData?.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse mb-1"></div>
                        <span className="text-xs text-blue-300">Processing</span>
                      </div>
                    </div>

                    {/* Processing Tips */}
                    <div className="bg-amber-500/5 border border-amber-400/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-amber-300 mb-1">Processing in Progress</h5>
                          <p className="text-amber-200/80 text-sm leading-relaxed">
                            Please keep this tab open while we analyze your audio. 
                            The process may take several minutes depending on file length and complexity.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Cancel Button */}
                    <div className="text-center">
                      <button
                        onClick={handleCancel}
                        className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                      >
                        Cancel Analysis
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      isDragging 
                        ? 'border-blue-400 bg-blue-500/10 scale-105' 
                        : !selectedUser || isAnalyzing
                          ? 'border-gray-600/50 bg-gray-500/5 opacity-50 cursor-not-allowed'
                          : 'border-gray-600/50 bg-gray-500/5 hover:border-blue-400/50 hover:bg-blue-500/5 cursor-pointer'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (selectedUser && !isAnalyzing) setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (selectedUser && !isAnalyzing) {
                        handleFileSelect(Array.from(e.dataTransfer.files));
                      }
                    }}
                  >
                    <div className="space-y-6">
                      <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
                        isDragging ? 'bg-blue-500/20 border-2 border-blue-400/50' : 'bg-gray-500/10'
                      } transition-all duration-300`}>
                        <FileAudio className={`w-10 h-10 ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {!selectedUser ? 'Select a user first' : 
                           isDragging ? 'Drop your file here' : 'Drop your audio file here'}
                        </h3>
                        <p className={`${theme.subtext} text-lg mb-6`}>
                          {!selectedUser ? 'Choose a user from the dropdown above' :
                           'Supported formats: MP3, WAV, M4A, OGG, AAC, FLAC'}
                        </p>
                        
                        <div className="flex flex-col items-center gap-4">
                          <div className="text-lg font-medium text-gray-400">or</div>
                          <input
                            type="file"
                            id="audio-upload-input"
                            className="hidden"
                            accept="audio/*"
                            disabled={!selectedUser || isAnalyzing}
                            onChange={(e) => handleFileSelect(Array.from(e.target.files))}
                          />
                          <label
                            htmlFor="audio-upload-input"
                            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 inline-flex items-center gap-3 ${
                              selectedUser && !isAnalyzing
                                ? `${theme.button.primary} cursor-pointer transform hover:scale-105`
                                : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Upload className="w-5 h-5" />
                            Browse Files
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Audio Preview */}
                  {uploadedFile && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/5 to-violet-500/5 border border-blue-400/20 rounded-2xl">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                            <FileAudio className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1">{uploadedFile.name}</h4>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`${theme.subtext} flex items-center gap-1`}>
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                              </span>
                              {selectedUserData && (
                                <span className={`${theme.subtext} flex items-center gap-1`}>
                                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                                  {selectedUserData.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          disabled={isAnalyzing}
                          className={`p-3 rounded-xl transition-all duration-200 ${
                            isAnalyzing 
                              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-110'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Audio Element */}
                      {audioPreview && (
                        <div className="mb-6">
                          <audio
                            src={audioPreview}
                            controls
                            className="w-full h-12 rounded-lg"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            style={{ 
                              filter: isDarkMode ? 'invert(1) hue-rotate(180deg)' : 'none',
                              outline: 'none'
                            }}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <button
                          onClick={handleGenerateFeedback}
                          disabled={isAnalyzing || !systemStatus.online}
                          className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 ${
                            isAnalyzing || !systemStatus.online
                              ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                              : `${theme.button.success} transform hover:scale-105`
                          }`}
                        >
                          <MessageSquare className="w-5 h-5" />
                          Generate AI Feedback
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isAnalyzing}
                          className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                            isAnalyzing 
                              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                              : `${theme.button.secondary} hover:scale-105`
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Guidelines Card */}
            <div className={`${theme.cardBg} backdrop-blur-sm rounded-2xl p-6 border ${theme.border} shadow-xl`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400"></div>
                Upload Guidelines
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold mb-1 text-emerald-400">Supported Formats</p>
                  <p className={theme.subtext}>{supportedFormats.join(', ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-blue-400">File Size Limit</p>
                  <p className={theme.subtext}>Maximum 100MB per file</p>
                </div>
                <div>
                  <p className="font-semibold mb-1 text-violet-400">Processing Time</p>
                  <p className={theme.subtext}>2-5 minutes average</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${theme.cardBg} backdrop-blur-sm rounded-2xl p-6 border ${theme.border} shadow-xl`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"></div>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentPage('users')}
                  className={`w-full p-4 rounded-xl ${theme.hover} transition-all duration-200 text-left group border ${theme.border}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold">Manage Users</p>
                      <p className={`text-xs ${theme.subtext}`}>View all users</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setCurrentPage('feedback')}
                  className={`w-full p-4 rounded-xl ${theme.hover} transition-all duration-200 text-left group border ${theme.border}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                      <MessageSquare className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-semibold">View Feedback</p>
                      <p className={`text-xs ${theme.subtext}`}>Previous results</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div className={`${theme.cardBg} backdrop-blur-sm rounded-2xl p-6 border ${theme.border} shadow-xl`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"></div>
                Pro Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                  <p className={theme.subtext}>Use clear, noise-free recordings for best results</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                  <p className={theme.subtext}>Ensure single speaker for accurate analysis</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0"></div>
                  <p className={theme.subtext}>30 seconds to 30 minutes duration works best</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAudio;