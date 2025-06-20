import React, { useState, useEffect } from 'react';
import { FileAudio, Play, Pause, Upload, X, CheckCircle, AlertCircle, Loader, MessageSquare, User, Wifi, WifiOff } from 'lucide-react';
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

  const supportedFormats = ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac'];

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
        // Create audio preview URL
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

  // Get progress message
  const getProgressMessage = (stage, progress) => {
    switch (stage) {
      case 'uploading':
        return 'Uploading audio file to server...';
      case 'processing':
        return 'Processing audio and generating transcript...';
      case 'analyzing':
        return 'Analyzing speech patterns and grammar...';
      case 'generating':
        return 'Generating detailed feedback and insights...';
      case 'complete':
        return 'Analysis complete! Redirecting to feedback...';
      default:
        return 'Processing audio...';
    }
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
      // Progress callback for real-time updates
      const onProgress = (progressData) => {
        setAnalysisProgress(progressData);
        setProcessingStage(getProgressMessage(progressData.stage, progressData.progress));
      };

      // Call the backend API for analysis
      const analysisResult = await apiService.analyzeSpeech(uploadedFile, selectedUser, onProgress);
      
      setAnalysisProgress({ stage: 'complete', progress: 100 });
      setProcessingStage('Analysis complete! Redirecting to feedback...');
      
      showToastMessage('Analysis completed successfully!', 'success');
      
      // Navigate to detailed feedback page with real data
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

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-['Proxima_Nova',_system-ui,_-apple-system,_sans-serif] transition-colors duration-300`}>
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 transform ${
          showToast ? 'translate-x-0' : 'translate-x-full'
        } ${toastType === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toastType === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          <span className="text-white font-medium">{toastMessage}</span>
          <button onClick={() => setShowToast(false)}>
            <X className="w-4 h-4 text-white hover:text-gray-200" />
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

      <div className="ml-20 lg:ml-64 p-6">
        {/* Header with System Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Upload Audio
              </h1>
              <p className="text-gray-400">Upload and analyze call recordings with AI-powered insights</p>
            </div>
            
            {/* System Status Indicator */}
            <div className="flex items-center gap-2">
              {systemStatus.checking ? (
                <div className="flex items-center gap-2 text-yellow-400">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Checking system...</span>
                </div>
              ) : systemStatus.online ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm">System Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm">System Offline</span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                className="ml-2 px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* System Status Alert */}
        {!systemStatus.online && !systemStatus.checking && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Backend Service Unavailable</span>
            </div>
            <p className="text-red-200 text-sm mt-1">
              The speech analysis service is currently unavailable. Please ensure the backend server is running and accessible.
            </p>
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-indigo-500/20">
          <h3 className="text-xl font-bold text-indigo-300 mb-4">
            Audio Upload Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-1 text-gray-300">Supported formats:</p>
              <p className="text-gray-400">{supportedFormats.join(', ').toUpperCase()}</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-gray-300">Maximum file size:</p>
              <p className="text-gray-400">100MB</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-gray-300">Processing time:</p>
              <p className="text-gray-400">2-5 minutes depending on file size</p>
            </div>
            <div>
              <p className="font-semibold mb-1 text-gray-300">User Assignment:</p>
              <p className="text-gray-400">Required before upload</p>
            </div>
          </div>
        </div>

        {/* User Selection */}
        <div className={`${theme.cardBg} rounded-2xl p-6 mb-6 border ${theme.border}`}>
          <label className="block text-lg font-semibold text-gray-200 mb-3">
            Select User for Audio Upload
            {isLoadingUsers && <Loader className="inline w-4 h-4 ml-2 animate-spin" />}
          </label>
          
          {isLoadingUsers ? (
            <div className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400">
              Loading users...
            </div>
          ) : error ? (
            <div className="w-full px-4 py-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="w-full px-4 py-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-300">
              No users available. Please add users first.
            </div>
          ) : (
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
              disabled={isAnalyzing}
            >
              <option value="">Choose a user...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email} ({user.role})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Upload Area */}
        <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border}`}>
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-500/10' 
                : !selectedUser || isAnalyzing
                  ? 'border-gray-600 bg-gray-700/20 opacity-50 cursor-not-allowed'
                  : 'border-gray-600 bg-gray-700/20 hover:border-indigo-400 hover:bg-indigo-500/5 cursor-pointer'
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
            <FileAudio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              {!selectedUser ? 'Please select a user to upload audio' : 
               isAnalyzing ? 'Processing audio...' : 
               'Drop your audio file here'}
            </h3>
            <p className="text-gray-400 mb-4">or</p>
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
              className={`px-6 py-3 rounded-lg font-medium transition-all inline-block ${
                selectedUser && !isAnalyzing
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg cursor-pointer transform hover:scale-105'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Browse Files
            </label>
          </div>

          {/* Audio Preview and Analysis */}
          {uploadedFile && (
            <div className="mt-6 bg-gray-700/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-200">{uploadedFile.name}</h4>
                  <p className="text-gray-400 text-sm">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p className="text-gray-400 text-sm">
                    User: {users.find(u => u.id === selectedUser)?.name || 'Unknown'}
                  </p>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isAnalyzing}
                  className={`p-3 rounded-full transition-all ${
                    isAnalyzing 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-110'
                  }`}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Audio Element */}
              {audioPreview && (
                <audio
                  src={audioPreview}
                  controls
                  className="w-full mb-4"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  style={{ filter: isDarkMode ? 'invert(1) hue-rotate(180deg)' : 'none' }}
                />
              )}

              {/* Progress Bar for Analysis */}
              {isAnalyzing && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      {processingStage}
                    </span>
                    <span className="text-sm text-gray-400">
                      {analysisProgress.progress}%
                    </span>
                  </div>
                  <div className="bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysisProgress.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    This may take several minutes depending on audio length...
                  </div>
                </div>
              )}

              {/* Analysis Details (if analyzing) */}
              {isAnalyzing && analysisProgress.stage && (
                <div className="mb-4 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Loader className="w-5 h-5 animate-spin text-indigo-400" />
                    <div>
                      <p className="font-medium text-indigo-300">Processing Stage: {analysisProgress.stage}</p>
                      <div className="text-sm text-indigo-400 mt-1">
                        {analysisProgress.stage === 'uploading' && "Uploading your audio file to our secure servers..."}
                        {analysisProgress.stage === 'processing' && "Converting audio format and extracting speech data..."}
                        {analysisProgress.stage === 'analyzing' && "AI is analyzing speech patterns, grammar, and fluency..."}
                        {analysisProgress.stage === 'generating' && "Generating comprehensive feedback and recommendations..."}
                        {analysisProgress.stage === 'complete' && "Analysis complete! Preparing your detailed report..."}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleGenerateFeedback}
                  disabled={isAnalyzing || !systemStatus.online}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isAnalyzing || !systemStatus.online
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing Audio...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      Generate AI Feedback
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isAnalyzing}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isAnalyzing 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                  }`}
                >
                  Cancel
                </button>
              </div>

              {/* Additional Information */}
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <h5 className="font-semibold text-gray-300 mb-2">What happens next?</h5>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Your audio will be securely processed using advanced AI models</li>
                  <li>• We'll analyze speech patterns, grammar, fluency, and pronunciation</li>
                  <li>• You'll receive detailed feedback with actionable insights</li>
                  <li>• Results will be saved to the user's performance history</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Recent Analyses Section */}
        {!uploadedFile && !isLoadingUsers && users.length > 0 && (
          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} mt-6`}>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <MessageSquare className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              Quick Actions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* View All Users */}
              <button
                onClick={() => setCurrentPage('users')}
                className={`p-4 rounded-xl ${theme.hover} transition-all duration-200 text-left group border ${theme.border}`}
              >
                <User className="w-8 h-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Manage Users</h4>
                <p className={`text-sm ${theme.subtext}`}>View and manage all users in the system</p>
              </button>

              {/* View Feedback Sessions */}
              <button
                onClick={() => setCurrentPage('feedback')}
                className={`p-4 rounded-xl ${theme.hover} transition-all duration-200 text-left group border ${theme.border}`}
              >
                <MessageSquare className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-1">Feedback Sessions</h4>
                <p className={`text-sm ${theme.subtext}`}>Review previous analysis results</p>
              </button>

              {/* System Status */}
              <button
                onClick={handleRefresh}
                className={`p-4 rounded-xl ${theme.hover} transition-all duration-200 text-left group border ${theme.border}`}
              >
                {systemStatus.online ? (
                  <Wifi className="w-8 h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                ) : (
                  <WifiOff className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                )}
                <h4 className="font-semibold mb-1">System Status</h4>
                <p className={`text-sm ${theme.subtext}`}>
                  {systemStatus.online ? 'All systems operational' : 'Check system connectivity'}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} mt-6`}>
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <AlertCircle className={`mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
            Tips for Best Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-green-400">Audio Quality</h4>
              <ul className={`text-sm ${theme.subtext} space-y-1`}>
                <li>• Use clear, noise-free recordings</li>
                <li>• Ensure speaker is close to microphone</li>
                <li>• Avoid background music or noise</li>
                <li>• Minimum 128kbps bitrate recommended</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-blue-400">Content Guidelines</h4>
              <ul className={`text-sm ${theme.subtext} space-y-1`}>
                <li>• Natural conversation works best</li>
                <li>• Include complete sentences</li>
                <li>• 30 seconds to 30 minutes duration</li>
                <li>• Single speaker recommended</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-600/10 border border-yellow-500/20 rounded-lg">
            <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
              <strong>Privacy Note:</strong> All audio files are processed securely and are not stored permanently on our servers. 
              Analysis results are saved but original audio files are automatically deleted after processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAudio;