// import React, { useState } from 'react';
// import { ArrowLeft, Star, AlertTriangle, Check, Ear, Heart, Puzzle, SlidersHorizontal, MessageSquare, Play, Pause, Download, Share2 } from 'lucide-react';
// import Navbar from './Navbar';

// const FeedbackDetail = ({ setCurrentPage, feedbackData, isDarkMode = true }) => {
//   const [expandedCategory, setExpandedCategory] = useState('');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [activeTab, setActiveTab] = useState('feedback');

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

//   // Default feedback data if none provided (for demo purposes)
//   const defaultFeedback = {
//     id: 'CALL_NEW',
//     user: 'Demo User',
//     date: new Date().toISOString().split('T')[0],
//     duration: '4:32',
//     rating: 4.3,
//     fileName: 'uploaded_audio.mp3',
//     transcript: 'This is the generated transcript from your uploaded audio file. The AI has processed the conversation and identified key areas for improvement and strengths in the communication.',
//     issues: ['Speaking pace could be slower', 'Consider more empathetic responses'],
//     strengths: ['Clear articulation', 'Professional tone', 'Good problem resolution'],
//     sentiment: 'Positive'
//   };

//   const feedback = feedbackData || defaultFeedback;

//   const feedbackCategories = [
//     {
//       id: 'communication',
//       icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
//       title: 'Communication',
//       score: 87,
//       color: 'from-blue-500 to-blue-600',
//       details: "Agent's clarity, tone, and overall conversational flow. Good use of professional language.",
//       improvements: "Consider pausing between complex explanations to ensure customer understanding."
//     },
//     {
//       id: 'listening',
//       icon: <Ear className="w-6 h-6 text-purple-400" />,
//       title: 'Active Listening',
//       score: 91,
//       color: 'from-purple-500 to-purple-600',
//       details: "Excellent ability to understand customer needs and respond appropriately.",
//       improvements: "Continue this strong performance. Minimal interruptions detected."
//     },
//     {
//       id: 'empathy',
//       icon: <Heart className="w-6 h-6 text-pink-400" />,
//       title: 'Empathy',
//       score: 84,
//       color: 'from-pink-500 to-pink-600',
//       details: "Good understanding and compassion towards the customer's situation.",
//       improvements: "Use more empathetic phrases like 'I understand how frustrating this must be'."
//     },
//     {
//       id: 'problemSolving',
//       icon: <Puzzle className="w-6 h-6 text-green-400" />,
//       title: 'Problem Solving',
//       score: 89,
//       color: 'from-green-500 to-green-600',
//       details: "Effective identification and resolution of customer issues.",
//       improvements: "Excellent performance. Consider offering preventive measures for future issues."
//     },
//     {
//       id: 'callControl',
//       icon: <SlidersHorizontal className="w-6 h-6 text-orange-400" />,
//       title: 'Call Control',
//       score: 76,
//       color: 'from-orange-500 to-orange-600',
//       details: "Good conversation management and adherence to call flow protocols.",
//       improvements: "Work on smoother transitions between topics and better time management."
//     }
//   ];

//   const getSentimentColor = (sentiment) => {
//     switch (sentiment) {
//       case 'Very Positive':
//         return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
//       case 'Positive':
//         return 'bg-green-500/20 text-green-300 border-green-500/30';
//       case 'Neutral':
//         return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
//       case 'Negative':
//         return 'bg-red-500/20 text-red-300 border-red-500/30';
//       default:
//         return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
//     }
//   };

//   const getScoreColor = (score) => {
//     if (score >= 90) return 'text-emerald-400';
//     if (score >= 80) return 'text-blue-400';
//     if (score >= 70) return 'text-yellow-400';
//     return 'text-red-400';
//   };

//   const getOverallScore = () => {
//     const totalScore = feedbackCategories.reduce((sum, category) => sum + category.score, 0);
//     return Math.round(totalScore / feedbackCategories.length);
//   };

//   return (
//     <div className={`min-h-screen ${theme.bg} ${theme.text} font-['Proxima_Nova',_system-ui,_-apple-system,_sans-serif] overflow-hidden transition-colors duration-300`}>
//       {/* Side Navigation */}
//       <Navbar 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab} 
//         setCurrentPage={setCurrentPage} 
//         isDarkMode={isDarkMode} 
//         toggleTheme={toggleTheme} 
//       />

//       {/* Main Content */}
//       <div className="ml-20 lg:ml-64 min-h-screen">
//         <div className="p-8 lg:p-10">
//           {/* Header with Back Button */}
//           <div className="flex items-center gap-4 mb-8">
//             <button
//               onClick={() => setCurrentPage('feedback')}
//               className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
//                 isDarkMode 
//                   ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700/30' 
//                   : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
//               }`}
//             >
//               <ArrowLeft className="w-5 h-5" />
//               Back to Feedback Sessions
//             </button>
//           </div>

//           {/* Main Content */}
//           <div className="space-y-8">
//             {/* Call Summary Card */}
//             <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
//               <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
//               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
//                 <div>
//                   <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
//                     Feedback Analysis: {feedback.id}
//                   </h1>
//                   <div className="space-y-2 text-lg">
//                     <p className={`${theme.text}`}>
//                       <span className={theme.subtext}>User:</span> <span className="font-semibold">{feedback.user}</span>
//                       <span className={`${theme.subtext} mx-3`}>|</span>
//                       <span className={theme.subtext}>Date:</span> <span className="font-semibold">{feedback.date}</span>
//                     </p>
//                     <p className={`${theme.text}`}>
//                       <span className={theme.subtext}>Duration:</span> <span className="font-semibold">{feedback.duration}</span>
//                       <span className={`${theme.subtext} mx-3`}>|</span>
//                       <span className={theme.subtext}>File:</span> <span className="font-semibold">{feedback.fileName}</span>
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="flex flex-col items-center lg:items-end gap-4">
//                   <div className="flex items-center gap-3">
//                     <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
//                     <span className="text-4xl font-bold">{feedback.rating}</span>
//                     <span className={`${theme.subtext} text-xl`}>/5.0</span>
//                   </div>
//                   <span className={`px-4 py-2 rounded-full font-semibold border ${getSentimentColor(feedback.sentiment)}`}>
//                     {feedback.sentiment} Sentiment
//                   </span>
//                 </div>
//               </div>

//               {/* Overall Score */}
//               <div className={`${
//                 isDarkMode 
//                   ? 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20' 
//                   : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
//               } rounded-2xl p-6`}>
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-2xl font-bold">Overall Performance Score</h3>
//                   <span className={`text-5xl font-bold ${getScoreColor(getOverallScore())}`}>
//                     {getOverallScore()}%
//                   </span>
//                 </div>
//                 <div className={`w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full h-4`}>
//                   <div 
//                     className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
//                     style={{ width: `${getOverallScore()}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>

//             {/* Audio Player Card */}
//             <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
//               <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
//               <h3 className="text-2xl font-bold mb-6 flex items-center">
//                 <Play className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Audio Playback
//               </h3>
//               <div className={`flex items-center gap-6 p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-2xl border ${theme.border}`}>
//                 <button
//                   onClick={() => setIsPlaying(!isPlaying)}
//                   className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-2xl hover:shadow-xl transform hover:scale-110 transition-all"
//                 >
//                   {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
//                 </button>
//                 <div className="flex-1">
//                   <div className="flex justify-between text-lg mb-3">
//                     <span className="font-semibold">{feedback.fileName}</span>
//                     <span className={theme.subtext}>{feedback.duration}</span>
//                   </div>
//                   <div className={`w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full h-3`}>
//                     <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full w-1/3"></div>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <button className={`p-3 rounded-xl ${theme.hover} transition-colors`}>
//                     <Download className="w-6 h-6" />
//                   </button>
//                   <button className={`p-3 rounded-xl ${theme.hover} transition-colors`}>
//                     <Share2 className="w-6 h-6" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Transcript Card */}
//             <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
//               <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
//               <h3 className="text-2xl font-bold mb-6 flex items-center">
//                 <MessageSquare className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Call Transcript
//               </h3>
//               <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-2xl p-6 h-64 overflow-y-auto border ${theme.border}`}>
//                 <p className={`${theme.text} leading-relaxed text-lg`}>
//                   {feedback.transcript}
//                 </p>
//               </div>
//             </div>

//             {/* Issues & Strengths */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Issues */}
//               {feedback.issues && feedback.issues.length > 0 && (
//                 <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
//                   <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-3xl"></div>
//                   <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
//                     <AlertTriangle className="w-8 h-8 mr-3" />
//                     Areas for Improvement
//                   </h3>
//                   <ul className="space-y-3">
//                     {feedback.issues.map((issue, index) => (
//                       <li key={index} className="flex items-start gap-3">
//                         <div className="w-3 h-3 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
//                         <span className="text-red-300 text-lg">{issue}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {/* Strengths */}
//               {feedback.strengths && feedback.strengths.length > 0 && (
//                 <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
//                   <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-3xl"></div>
//                   <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
//                     <Check className="w-8 h-8 mr-3" />
//                     Key Strengths
//                   </h3>
//                   <ul className="space-y-3">
//                     {feedback.strengths.map((strength, index) => (
//                       <li key={index} className="flex items-start gap-3">
//                         <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
//                         <span className="text-green-300 text-lg">{strength}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* Performance Categories */}
//             <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
//               <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
//               <h3 className="text-2xl font-bold mb-8 flex items-center">
//                 <SlidersHorizontal className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Detailed Performance Analysis
//               </h3>
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {feedbackCategories.map((category) => (
//                   <div
//                     key={category.id}
//                     className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-2xl p-6 cursor-pointer transition-all duration-200 border ${theme.border} hover:shadow-xl group`}
//                     onClick={() => setExpandedCategory(expandedCategory === category.id ? '' : category.id)}
//                   >
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-4">
//                         <div className="text-3xl transition-transform duration-200 group-hover:scale-110">
//                           {category.icon}
//                         </div>
//                         <h4 className="font-bold text-xl">{category.title}</h4>
//                       </div>
//                       <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
//                         {category.score}%
//                       </span>
//                     </div>
                    
//                     <div className={`w-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full h-3 mb-4`}>
//                       <div 
//                         className={`bg-gradient-to-r ${category.color} h-3 rounded-full transition-all duration-1000`}
//                         style={{ width: `${category.score}%` }}
//                       ></div>
//                     </div>

//                     {expandedCategory === category.id && (
//                       <div className="space-y-4 pt-4 border-t border-gray-600">
//                         <div>
//                           <p className="font-semibold mb-2">Analysis:</p>
//                           <p className={`${theme.subtext} text-lg`}>{category.details}</p>
//                         </div>
//                         <div>
//                           <p className="font-semibold mb-2">Recommendations:</p>
//                           <p className={`${theme.subtext} text-lg`}>{category.improvements}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* AI Insights */}
//             <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
//               <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
//               <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">
//                 AI-Generated Insights & Recommendations
//               </h3>
//               <div className="space-y-6">
//                 <div className={`${
//                   isDarkMode 
//                     ? 'bg-indigo-600/10 border border-indigo-500/30' 
//                     : 'bg-indigo-50 border border-indigo-200'
//                 } rounded-2xl p-6`}>
//                   <h4 className="font-bold text-indigo-400 mb-3 text-xl">Key Takeaway</h4>
//                   <p className={`${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'} text-lg leading-relaxed`}>
//                     This call demonstrates strong technical knowledge and professional communication. 
//                     Focus on incorporating more empathetic language and slightly slower pacing to maximize customer satisfaction.
//                   </p>
//                 </div>
//                 <div className={`${
//                   isDarkMode 
//                     ? 'bg-purple-600/10 border border-purple-500/30' 
//                     : 'bg-purple-50 border border-purple-200'
//                 } rounded-2xl p-6`}>
//                   <h4 className="font-bold text-purple-400 mb-3 text-xl">Action Items</h4>
//                   <ul className={`space-y-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-700'} text-lg`}>
//                     <li>• Practice active listening techniques with pause-and-reflect statements</li>
//                     <li>• Incorporate more empathetic phrases during problem acknowledgment</li>
//                     <li>• Consider offering additional resources or follow-up opportunities</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add animation styles */}
//       <style jsx>{`
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes modal-pop-in {
//           0% { transform: scale(0.9); opacity: 0; }
//           100% { transform: scale(1); opacity: 1; }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out forwards;
//         }
//         .animate-modal-pop-in {
//           animation: modal-pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FeedbackDetail;

import React, { useState } from 'react';
import { ArrowLeft, Star, AlertTriangle, Check, Ear, Heart, Puzzle, SlidersHorizontal, MessageSquare, Play, Pause, Download, Share2, Info, TrendingUp } from 'lucide-react';
import Navbar from './Navbar';

const FeedbackDetail = ({ setCurrentPage, feedbackData, isDarkMode = true }) => {
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

  // Default feedback data if none provided
  const defaultFeedback = {
    id: 'CALL_NEW',
    user: 'Demo User',
    date: new Date().toISOString().split('T')[0],
    duration: '4:32',
    rating: 4.3,
    fileName: 'uploaded_audio.mp3',
    transcript: 'This is the generated transcript from your uploaded audio file. The AI has processed the conversation and identified key areas for improvement and strengths in the communication.',
    issues: ['Speaking pace could be slower', 'Consider more empathetic responses'],
    strengths: ['Clear articulation', 'Professional tone', 'Good problem resolution'],
    sentiment: 'Positive',
    scores: { overall: 86, grammar: 90, fluency: 82, speech_rate: 85, filler_words: 88, pauses: 80 }
  };

  const feedback = feedbackData || defaultFeedback;
  const hasRealData = feedbackData && feedbackData.rawAnalysis;

  // Extract real backend data if available
  const backendAnalysis = hasRealData ? feedback.rawAnalysis : null;
  const scores = hasRealData ? feedback.scores : feedback.scores || {};

  // Create performance categories from real data or use defaults
  const createPerformanceCategories = () => {
    if (!hasRealData) {
      // Default categories for demo
      return [
        {
          id: 'communication',
          icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
          title: 'Communication Clarity',
          score: 87,
          color: 'from-blue-500 to-blue-600',
          details: "Agent's clarity, tone, and overall conversational flow. Good use of professional language.",
          improvements: "Consider pausing between complex explanations to ensure customer understanding."
        },
        {
          id: 'listening',
          icon: <Ear className="w-6 h-6 text-purple-400" />,
          title: 'Grammar & Language',
          score: 91,
          color: 'from-purple-500 to-purple-600',
          details: "Good grammatical accuracy and proper sentence structure.",
          improvements: "Continue maintaining high grammatical standards."
        },
        {
          id: 'empathy',
          icon: <Heart className="w-6 h-6 text-pink-400" />,
          title: 'Speech Flow',
          score: 84,
          color: 'from-pink-500 to-pink-600',
          details: "Natural speaking rhythm with appropriate pacing.",
          improvements: "Reduce filler words for smoother delivery."
        },
        {
          id: 'problemSolving',
          icon: <Puzzle className="w-6 h-6 text-green-400" />,
          title: 'Pronunciation',
          score: 89,
          color: 'from-green-500 to-green-600',
          details: "Clear articulation and proper pronunciation of key terms.",
          improvements: "Excellent performance maintained throughout."
        },
        {
          id: 'callControl',
          icon: <SlidersHorizontal className="w-6 h-6 text-orange-400" />,
          title: 'Overall Fluency',
          score: 76,
          color: 'from-orange-500 to-orange-600',
          details: "Good conversation flow with minimal stuttering or repetition.",
          improvements: "Work on reducing pauses between thoughts."
        }
      ];
    }

    // Create categories from real backend data
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
  };

  const feedbackCategories = createPerformanceCategories();

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

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getOverallScore = () => {
    if (hasRealData && scores.overall) {
      return Math.round(scores.overall);
    }
    const totalScore = feedbackCategories.reduce((sum, category) => sum + category.score, 0);
    return Math.round(totalScore / feedbackCategories.length);
  };

  // Format structured insights for better display
  const formatStructuredInsights = () => {
    if (!hasRealData || !backendAnalysis.structured_insights?.structured_format) {
      return null;
    }

    const content = backendAnalysis.structured_insights.structured_format;
    
    // Split into sections
    const sections = content.split(/\d+\.\s/).filter(section => section.trim());
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim());
      const title = lines[0] || `Section ${index + 1}`;
      const content = lines.slice(1);
      
      return {
        title: title.replace(/–.*$/, '').trim(),
        rating: title.match(/(\d+(?:\.\d+)?)\s*\/\s*5/)?.[1] || null,
        content: content
      };
    });
  };

  const structuredSections = formatStructuredInsights();

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
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Demo Data
                </div>
              )}
              
              {hasRealData && (
                <button
                  onClick={() => setShowRawData(!showRawData)}
                  className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
                >
                  {showRawData ? 'Hide' : 'Show'} Raw Data
                </button>
              )}
            </div>
          </div>

          {/* Backend Warning */}
          {hasRealData && feedback.warning && (
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
              <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
                    {hasRealData ? 'AI Speech Analysis' : 'Feedback Analysis'}: {feedback.id}
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
                    {hasRealData && (
                      <p className={`${theme.text}`}>
                        <span className={theme.subtext}>Processing:</span> 
                        <span className="font-semibold ml-2">
                          {backendAnalysis?.analysis?.speech_rate?.wpm ? 
            `${backendAnalysis.analysis.speech_rate.wpm} WPM` : 'Analyzed'}
                        </span>
                        <span className={`${theme.subtext} mx-3`}>|</span>
                        <span className={theme.subtext}>Issues:</span> 
                        <span className="font-semibold ml-2">
                          {backendAnalysis?.analysis?.grammar_issues?.length || 0} Grammar, 
                          {backendAnalysis?.analysis?.filler_words?.length || 0} Fillers
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
                {hasRealData ? 'AI Generated Transcript' : 'Sample Transcript'}
              </h3>
              <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-2xl p-6 h-64 overflow-y-auto border ${theme.border}`}>
                <p className={`${theme.text} leading-relaxed text-lg`}>
                  {feedback.transcript}
                </p>
                {hasRealData && backendAnalysis?.timestamps && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <p className="text-sm text-gray-400">
                      Transcript generated with {backendAnalysis.timestamps.length} time segments
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
                {hasRealData && (
                  <span className="ml-3 px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm">
                    AI Generated
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

            {/* AI Insights - Enhanced for real data */}
            <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.005]`}>
              <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6">
                {hasRealData ? 'AI-Generated Detailed Analysis' : 'AI-Generated Insights & Recommendations'}
              </h3>
              
              {hasRealData && structuredSections ? (
                <div className="space-y-6">
                  {structuredSections.slice(0, 3).map((section, index) => (
                    <div key={index} className={`${
                      isDarkMode 
                        ? 'bg-indigo-600/10 border border-indigo-500/30' 
                        : 'bg-indigo-50 border border-indigo-200'
                    } rounded-2xl p-6`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-indigo-400 text-xl">{section.title}</h4>
                        {section.rating && (
                          <span className="text-lg font-bold text-indigo-300">
                            {section.rating}/5
                          </span>
                        )}
                      </div>
                      <div className={`${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'} text-lg leading-relaxed`}>
                        {section.content.slice(0, 5).map((line, lineIndex) => (
                          <p key={lineIndex} className="mb-2">
                            {line.replace(/^[✅⚠️💡]\s*/, '')}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {hasRealData && backendAnalysis.structured_insights?.hf_analysis && (
                    <div className={`${
                      isDarkMode 
                        ? 'bg-purple-600/10 border border-purple-500/30' 
                        : 'bg-purple-50 border border-purple-200'
                    } rounded-2xl p-6`}>
                      <h4 className="font-bold text-purple-400 mb-3 text-xl">AI Model Insights</h4>
                      <p className={`${isDarkMode ? 'text-purple-200' : 'text-purple-700'} text-lg leading-relaxed`}>
                        {backendAnalysis.structured_insights.hf_analysis}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Default insights for demo data
                <div className="space-y-6">
                  <div className={`${
                    isDarkMode 
                      ? 'bg-indigo-600/10 border border-indigo-500/30' 
                      : 'bg-indigo-50 border border-indigo-200'
                  } rounded-2xl p-6`}>
                    <h4 className="font-bold text-indigo-400 mb-3 text-xl">Key Takeaway</h4>
                    <p className={`${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'} text-lg leading-relaxed`}>
                      This analysis demonstrates the system's capability to process speech and provide detailed feedback. 
                      For real insights, upload an actual audio file to see comprehensive AI-powered analysis.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Raw Data Section - Only for real data */}
            {hasRealData && showRawData && (
              <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} p-8 relative overflow-hidden`}>
                <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-gray-500 to-gray-600 rounded-t-3xl"></div>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Info className="mr-3 text-gray-400" />
                  Raw Backend Data
                </h3>
                <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-2xl p-6 h-96 overflow-y-auto border ${theme.border}`}>
                  <pre className={`${theme.text} text-sm leading-relaxed`}>
                    {JSON.stringify(backendAnalysis, null, 2)}
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