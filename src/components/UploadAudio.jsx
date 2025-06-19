// import React, { useState } from 'react';
// import { FileAudio, Play, Pause, Upload, X, CheckCircle, AlertCircle, Loader, MessageSquare, User } from 'lucide-react';
// import Navbar from './Navbar';

// const UploadAudio = ({ setCurrentPage, users = [], navigateToFeedbackDetail, isDarkMode = true }) => {
//   const [selectedUser, setSelectedUser] = useState('');
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState('error'); // 'error' or 'success'
//   const [audioPreview, setAudioPreview] = useState(null);
//   const [activeTab, setActiveTab] = useState('upload');

//   const supportedFormats = ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac'];

//   // Theme variables - exactly matching UserManagement
//   const themes = {
//     dark: {
//       bg: 'bg-[#0f172a]',
//       sidebarBg: 'bg-[#1e293b]',
//       cardBg: 'bg-[#1e293b]',
//       text: 'text-white',
//       subtext: 'text-gray-400',
//       border: 'border-gray-700/50',
//       hover: 'hover:bg-white/5',
//       barBg: 'bg-gray-700/50',
//       gradients: {
//         sidebar: 'from-indigo-900/40 to-purple-900/40',
//         heading: 'from-indigo-400 to-purple-400',
//       }
//     },
//     light: {
//       bg: 'bg-gray-50',
//       sidebarBg: 'bg-white',
//       cardBg: 'bg-white',
//       text: 'text-gray-800',
//       subtext: 'text-gray-500',
//       border: 'border-gray-200',
//       hover: 'hover:bg-gray-100',
//       barBg: 'bg-gray-200',
//       gradients: {
//         sidebar: 'from-indigo-100 to-purple-100',
//         heading: 'from-indigo-600 to-purple-600',
//       }
//     }
//   };

//   const theme = isDarkMode ? themes.dark : themes.light;

//   // Toggle theme function
//   const toggleTheme = () => {
//     // This would be handled by parent component
//   };

//   const showToastMessage = (message, type = 'error') => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 4000);
//   };

//   const validateFile = (file) => {
//     const fileExtension = file.name.split('.').pop().toLowerCase();
//     if (!supportedFormats.includes(fileExtension)) {
//       showToastMessage(`Unsupported format: .${fileExtension}. Please upload: ${supportedFormats.join(', ')}`);
//       return false;
//     }
//     if (file.size > 100 * 1024 * 1024) { // 100MB
//       showToastMessage('File size exceeds 100MB limit');
//       return false;
//     }
//     return true;
//   };

//   const handleFileSelect = (files) => {
//     if (files.length > 0 && selectedUser) {
//       const file = files[0];
//       if (validateFile(file)) {
//         setUploadedFile(file);
//         // Create audio preview URL
//         const audioUrl = URL.createObjectURL(file);
//         setAudioPreview(audioUrl);
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (!uploadedFile || !selectedUser) return;
    
//     setIsUploading(true);
//     // Simulate upload process
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     setIsUploading(false);
//     showToastMessage('Audio uploaded successfully!', 'success');
//   };

//   const handleGenerateFeedback = async () => {
//     setIsGeneratingFeedback(true);
//     // Simulate feedback generation
//     await new Promise(resolve => setTimeout(resolve, 3000));
//     setIsGeneratingFeedback(false);
    
//     // Create feedback data for the uploaded audio
//     const feedbackData = {
//       id: `CALL_${Date.now()}`,
//       user: users.find(u => u.id.toString() === selectedUser)?.name || 'Unknown User',
//       date: new Date().toISOString().split('T')[0],
//       duration: '4:32', // This would come from actual audio analysis
//       rating: 4.3,
//       fileName: uploadedFile.name,
//       transcript: 'This is the AI-generated transcript from your uploaded audio file. The system has analyzed the conversation and identified key communication patterns, strengths, and areas for improvement.',
//       issues: ['Speaking pace could be optimized', 'Consider more empathetic responses in greeting'],
//       strengths: ['Clear articulation', 'Professional tone maintained', 'Effective problem resolution approach'],
//       sentiment: 'Positive'
//     };
    
//     // Navigate to detailed feedback page
//     navigateToFeedbackDetail(feedbackData);
//   };

//   const handleCancel = () => {
//     setUploadedFile(null);
//     setAudioPreview(null);
//     setIsPlaying(false);
//     if (audioPreview) {
//       URL.revokeObjectURL(audioPreview);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0f172a] text-white">
//       {/* Toast Notification */}
//       {showToast && (
//         <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 transform ${
//           showToast ? 'translate-x-0' : 'translate-x-full'
//         } ${toastType === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
//           {toastType === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
//           <span className="text-white font-medium">{toastMessage}</span>
//           <button onClick={() => setShowToast(false)}>
//             <X className="w-4 h-4 text-white hover:text-gray-200" />
//           </button>
//         </div>
//       )}

//       <div className="ml-20 lg:ml-64 p-6">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
//             Upload Audio
//           </h1>
//           <p className="text-gray-400">Upload and analyze call recordings</p>
//         </div>

//         {/* Guidelines */}
//         <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-indigo-500/20">
//           <h3 className="text-xl font-bold text-indigo-300 mb-4">
//             Audio Upload Guidelines
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//             <div>
//               <p className="font-semibold mb-1 text-gray-300">Supported formats:</p>
//               <p className="text-gray-400">{supportedFormats.join(', ').toUpperCase()}</p>
//             </div>
//             <div>
//               <p className="font-semibold mb-1 text-gray-300">Maximum file size:</p>
//               <p className="text-gray-400">100MB</p>
//             </div>
//             <div>
//               <p className="font-semibold mb-1 text-gray-300">Audio quality:</p>
//               <p className="text-gray-400">Minimum 128kbps bitrate</p>
//             </div>
//             <div>
//               <p className="font-semibold mb-1 text-gray-300">User Assignment:</p>
//               <p className="text-gray-400">Select user before uploading</p>
//             </div>
//           </div>
//         </div>

//         {/* User Selection */}
//         <div className="bg-[#1e293b] rounded-2xl p-6 mb-6 border border-gray-700/50">
//           <label className="block text-lg font-semibold text-gray-200 mb-3">
//             Select User for Audio Upload
//           </label>
//           <select
//             value={selectedUser}
//             onChange={(e) => setSelectedUser(e.target.value)}
//             className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
//           >
//             <option value="">Choose a user...</option>
//             {users.map(user => (
//               <option key={user.id} value={user.id}>{user.name}</option>
//             ))}
//           </select>
//         </div>

//         {/* Upload Area */}
//         <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-700/50">
//           <div
//             className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
//               isDragging 
//                 ? 'border-indigo-500 bg-indigo-500/10' 
//                 : !selectedUser 
//                   ? 'border-gray-600 bg-gray-700/20 opacity-50 cursor-not-allowed'
//                   : 'border-gray-600 bg-gray-700/20 hover:border-indigo-400 hover:bg-indigo-500/5 cursor-pointer'
//             }`}
//             onDragOver={(e) => {
//               e.preventDefault();
//               if (selectedUser) setIsDragging(true);
//             }}
//             onDragLeave={() => setIsDragging(false)}
//             onDrop={(e) => {
//               e.preventDefault();
//               setIsDragging(false);
//               if (selectedUser) {
//                 handleFileSelect(Array.from(e.dataTransfer.files));
//               }
//             }}
//           >
//             <FileAudio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-200 mb-2">
//               {selectedUser ? 'Drop your audio file here' : 'Please select a user to upload audio'}
//             </h3>
//             <p className="text-gray-400 mb-4">or</p>
//             <input
//               type="file"
//               id="audio-upload-input"
//               className="hidden"
//               accept="audio/*"
//               disabled={!selectedUser}
//               onChange={(e) => handleFileSelect(Array.from(e.target.files))}
//             />
//             <label
//               htmlFor="audio-upload-input"
//               className={`px-6 py-3 rounded-lg font-medium transition-all inline-block ${
//                 selectedUser
//                   ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg cursor-pointer transform hover:scale-105'
//                   : 'bg-gray-600 text-gray-400 cursor-not-allowed'
//               }`}
//             >
//               Browse Files
//             </label>
//           </div>

//           {/* File Selected - Show Upload Button */}
//           {uploadedFile && !audioPreview && (
//             <div className="mt-6 bg-gray-700/30 rounded-xl p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <p className="text-gray-200 font-medium">{uploadedFile.name}</p>
//                   <p className="text-gray-400 text-sm">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
//                 </div>
//                 <button
//                   onClick={handleCancel}
//                   className="text-gray-400 hover:text-red-400 transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//               <button
//                 onClick={handleUpload}
//                 disabled={isUploading}
//                 className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
//                   isUploading
//                     ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                     : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
//                 } flex items-center justify-center gap-2`}
//               >
//                 {isUploading ? (
//                   <>
//                     <Loader className="w-5 h-5 animate-spin" />
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-5 h-5" />
//                     Upload Audio
//                   </>
//                 )}
//               </button>
//             </div>
//           )}

//           {/* Audio Preview (after upload) */}
//           {audioPreview && (
//             <div className="mt-6 bg-gray-700/30 rounded-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h4 className="font-semibold text-gray-200">{uploadedFile.name}</h4>
//                 <button
//                   onClick={() => setIsPlaying(!isPlaying)}
//                   className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-full hover:shadow-lg transform hover:scale-110 transition-all"
//                 >
//                   {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
//                 </button>
//               </div>
              
//               {/* Audio Element */}
//               <audio
//                 src={audioPreview}
//                 controls
//                 className="w-full mb-4"
//                 style={{ filter: 'invert(1) hue-rotate(180deg)' }}
//               />

//               {/* Progress Bar */}
//               <div className="bg-gray-600 rounded-full h-2 mb-2">
//                 <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full w-1/3"></div>
//               </div>

//               {/* Sample Transcript */}
//               <div className="mt-6">
//                 <h4 className="font-semibold text-gray-200 mb-3">Sample Transcript Preview</h4>
//                 <div className="bg-gray-800/50 rounded-lg p-4 h-32 overflow-y-auto border border-gray-600">
//                   <p className="text-gray-300 leading-relaxed">
//                     This is a sample transcript preview. The actual transcript will be generated after processing the audio file.
//                     The system will analyze speech patterns, tone, and content to provide comprehensive feedback.
//                   </p>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-4 mt-6">
//                 <button
//                   onClick={handleGenerateFeedback}
//                   disabled={isGeneratingFeedback}
//                   className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
//                     isGeneratingFeedback
//                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
//                   }`}
//                 >
//                   {isGeneratingFeedback ? (
//                     <>
//                       <Loader className="w-5 h-5 animate-spin" />
//                       Generating Feedback...
//                     </>
//                   ) : (
//                     'Generate Feedback'
//                   )}
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   className="px-6 py-3 rounded-lg font-medium bg-gray-600 text-gray-200 hover:bg-gray-500 transition-all"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadAudio;


import React, { useState, useEffect } from 'react';
import { FileAudio, Play, Pause, Upload, X, CheckCircle, AlertCircle, Loader, MessageSquare, User, Wifi, WifiOff } from 'lucide-react';
import Navbar from './Navbar';
import apiService from './apiService';

const UploadAudio = ({ setCurrentPage, users = [], navigateToFeedbackDetail, isDarkMode = true }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');
  const [audioPreview, setAudioPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [analysisProgress, setAnalysisProgress] = useState({ stage: '', progress: 0 });
  const [systemStatus, setSystemStatus] = useState({ online: false, checking: true });
  const [processingStage, setProcessingStage] = useState('');

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

  // Check system status on component mount
  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const status = await apiService.getSystemStatus();
      setSystemStatus({ ...status, checking: false });
    } catch (error) {
      setSystemStatus({ online: false, checking: false, error: error.message });
    }
  };

  const showToastMessage = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

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

  const handleFileSelect = (files) => {
    if (files.length > 0 && selectedUser) {
      const file = files[0];
      if (validateFile(file)) {
        setUploadedFile(file);
        // Create audio preview URL
        const audioUrl = URL.createObjectURL(file);
        setAudioPreview(audioUrl);
        setIsUploading(false);
        setIsGeneratingFeedback(false);
        setAnalysisProgress({ stage: '', progress: 0 });
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile || !selectedUser) return;
    
    setIsUploading(true);
    try {
      // Simulate upload process - in real implementation, this might be separate
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsUploading(false);
      showToastMessage('Audio uploaded successfully!', 'success');
    } catch (error) {
      setIsUploading(false);
      showToastMessage('Upload failed: ' + error.message);
    }
  };

  const getProgressMessage = (stage, progress) => {
    switch (stage) {
      case 'uploading':
        return 'Uploading audio file...';
      case 'processing':
        return 'Processing audio and generating transcript...';
      case 'analyzing':
        return 'Analyzing speech patterns and grammar...';
      case 'generating':
        return 'Generating detailed feedback...';
      case 'complete':
        return 'Analysis complete!';
      default:
        return 'Processing...';
    }
  };

  const handleGenerateFeedback = async () => {
    if (!uploadedFile || !selectedUser) {
      showToastMessage('Please select a user and upload an audio file');
      return;
    }

    if (!systemStatus.online) {
      showToastMessage('Backend service is not available. Please check system status.');
      return;
    }

    setIsGeneratingFeedback(true);
    setAnalysisProgress({ stage: 'uploading', progress: 0 });

    try {
      // Progress callback for real-time updates
      const onProgress = (progressData) => {
        setAnalysisProgress(progressData);
        setProcessingStage(getProgressMessage(progressData.stage, progressData.progress));
      };

      // Call the actual backend API
      const analysisResult = await apiService.analyzeSpeech(uploadedFile, onProgress);
      
      // Format the response for the frontend
      const feedbackData = apiService.formatAnalysisForFrontend(analysisResult, uploadedFile);
      
      // Add user information
      const selectedUserData = users.find(u => u.id.toString() === selectedUser);
      if (selectedUserData) {
        feedbackData.user = selectedUserData.name;
      }

      setIsGeneratingFeedback(false);
      setAnalysisProgress({ stage: 'complete', progress: 100 });
      
      showToastMessage('Feedback generated successfully!', 'success');
      
      // Navigate to detailed feedback page with real data
      setTimeout(() => {
        navigateToFeedbackDetail(feedbackData);
      }, 1000);

    } catch (error) {
      setIsGeneratingFeedback(false);
      setAnalysisProgress({ stage: '', progress: 0 });
      console.error('Feedback generation failed:', error);
      showToastMessage('Failed to generate feedback: ' + error.message);
    }
  };

  const handleCancel = () => {
    setUploadedFile(null);
    setAudioPreview(null);
    setIsPlaying(false);
    setIsUploading(false);
    setIsGeneratingFeedback(false);
    setAnalysisProgress({ stage: '', progress: 0 });
    setProcessingStage('');
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }
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
              <p className="text-gray-400">Upload and analyze call recordings</p>
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
                onClick={checkSystemStatus}
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
              The speech analysis service is currently unavailable. Please ensure the backend server is running on the correct port.
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
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
          >
            <option value="">Choose a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>

        {/* Upload Area */}
        <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border}`}>
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-500/10' 
                : !selectedUser 
                  ? 'border-gray-600 bg-gray-700/20 opacity-50 cursor-not-allowed'
                  : 'border-gray-600 bg-gray-700/20 hover:border-indigo-400 hover:bg-indigo-500/5 cursor-pointer'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              if (selectedUser) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (selectedUser) {
                handleFileSelect(Array.from(e.dataTransfer.files));
              }
            }}
          >
            <FileAudio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              {selectedUser ? 'Drop your audio file here' : 'Please select a user to upload audio'}
            </h3>
            <p className="text-gray-400 mb-4">or</p>
            <input
              type="file"
              id="audio-upload-input"
              className="hidden"
              accept="audio/*"
              disabled={!selectedUser}
              onChange={(e) => handleFileSelect(Array.from(e.target.files))}
            />
            <label
              htmlFor="audio-upload-input"
              className={`px-6 py-3 rounded-lg font-medium transition-all inline-block ${
                selectedUser
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
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-full hover:shadow-lg transform hover:scale-110 transition-all"
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
              {isGeneratingFeedback && (
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
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleGenerateFeedback}
                  disabled={isGeneratingFeedback || !systemStatus.online}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    isGeneratingFeedback || !systemStatus.online
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
                  }`}
                >
                  {isGeneratingFeedback ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing Audio...
                    </>
                  ) : (
                    'Generate AI Feedback'
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isGeneratingFeedback}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    isGeneratingFeedback 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadAudio;