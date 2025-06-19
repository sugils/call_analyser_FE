import React, { useState } from 'react';
import { MessageSquare, Star, AlertTriangle, Check, X, Ear, Heart, Puzzle, SlidersHorizontal, ChevronRight, ArrowLeft, User } from 'lucide-react';
import Navbar from './Navbar';

const FeedbackSessions = ({ setCurrentPage, navigateToFeedbackDetail, isDarkMode = true }) => {
  const [selectedCall, setSelectedCall] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeTab, setActiveTab] = useState('feedback');

  // Theme variables - exactly matching UserManagement
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

  // Toggle theme function
  const toggleTheme = () => {
    // This would be handled by parent component
  };

  const calls = [
    {
      id: 'CALL001',
      user: 'John Doe',
      date: '2024-03-15',
      duration: '5:23',
      rating: 4.5,
      transcript: 'Hello, how can I help you today? This is a test call for demonstration purposes. The customer seems satisfied.',
      issues: ['Pacing too fast', 'Missed cross-sell opportunity'],
      strengths: ['Clear articulation', 'Good problem-solving'],
      sentiment: 'Positive'
    },
    {
      id: 'CALL002',
      user: 'Jane Smith',
      date: '2024-03-16',
      duration: '3:45',
      rating: 3.8,
      transcript: 'I am calling about my recent order. There was an issue with the delivery. I need to resolve this urgently. Please provide a solution.',
      issues: ['Lack of empathy', 'Did not offer alternative solution'],
      strengths: ['Listened actively'],
      sentiment: 'Neutral'
    },
    {
      id: 'CALL003',
      user: 'John Doe',
      date: '2024-03-17',
      duration: '7:12',
      rating: 4.8,
      transcript: 'Thank you for calling support. We are happy to assist you with your query. Is there anything else I can help you with?',
      issues: [],
      strengths: ['Excellent closing', 'Addressed all concerns'],
      sentiment: 'Very Positive'
    },
    {
      id: 'CALL004',
      user: 'Sarah Johnson',
      date: '2024-03-18',
      duration: '6:45',
      rating: 4.2,
      transcript: 'I need help with my account settings. The password reset is not working properly. Can you guide me through the process?',
      issues: ['Technical jargon used', 'Could have been more patient'],
      strengths: ['Resolved issue successfully', 'Good technical knowledge'],
      sentiment: 'Positive'
    },
    {
      id: 'CALL005',
      user: 'Michael Chen',
      date: '2024-03-19',
      duration: '4:30',
      rating: 3.5,
      transcript: 'My subscription was charged twice this month. I want a refund for the duplicate charge immediately.',
      issues: ['Did not apologize for inconvenience', 'Rushed through verification'],
      strengths: ['Quick resolution', 'Accurate information provided'],
      sentiment: 'Neutral'
    },
    {
      id: 'CALL006',
      user: 'Emily Davis',
      date: '2024-03-20',
      duration: '8:15',
      rating: 4.9,
      transcript: 'I wanted to thank your team for the excellent service. The previous agent helped me set up everything perfectly.',
      issues: [],
      strengths: ['Built great rapport', 'Captured feedback effectively', 'Offered additional services'],
      sentiment: 'Very Positive'
    },
    {
      id: 'CALL007',
      user: 'Robert Wilson',
      date: '2024-03-21',
      duration: '5:00',
      rating: 2.8,
      transcript: 'This is the third time I am calling about the same issue. Nobody seems to be able to help me properly.',
      issues: ['Failed to review previous tickets', 'Defensive tone', 'Did not escalate when needed'],
      strengths: ['Stayed calm under pressure'],
      sentiment: 'Negative'
    },
    {
      id: 'CALL008',
      user: 'Lisa Martinez',
      date: '2024-03-22',
      duration: '6:30',
      rating: 4.6,
      transcript: 'I need to upgrade my plan and also add family members to my account. Can you help me with the best options?',
      issues: ['Could have explained pricing more clearly'],
      strengths: ['Excellent product knowledge', 'Identified upsell opportunity', 'Patient explanation'],
      sentiment: 'Positive'
    },
    {
      id: 'CALL009',
      user: 'David Thompson',
      date: '2024-03-23',
      duration: '4:15',
      rating: 4.0,
      transcript: 'I received a notification about unusual activity on my account. Is everything secure?',
      issues: ['Initial response created more anxiety', 'Took time to access security protocols'],
      strengths: ['Thorough security check', 'Reassured customer effectively'],
      sentiment: 'Positive'
    }
  ];

  const feedbackCategories = [
    {
      id: 'communication',
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
      title: 'Communication',
      score: 85,
      color: 'from-blue-500 to-blue-600',
      details: "Agent's clarity, tone, and overall conversational flow. Avoidance of jargon."
    },
    {
      id: 'listening',
      icon: <Ear className="w-6 h-6 text-purple-400" />,
      title: 'Active Listening',
      score: 92,
      color: 'from-purple-500 to-purple-600',
      details: "Agent's ability to understand customer's needs and respond appropriately. Minimal interruptions."
    },
    {
      id: 'empathy',
      icon: <Heart className="w-6 h-6 text-pink-400" />,
      title: 'Empathy',
      score: 88,
      color: 'from-pink-500 to-pink-600',
      details: "Agent's ability to show understanding and compassion towards the customer's situation."
    },
    {
      id: 'problemSolving',
      icon: <Puzzle className="w-6 h-6 text-green-400" />,
      title: 'Problem Solving',
      score: 78,
      color: 'from-green-500 to-green-600',
      details: "Effectiveness in identifying and resolving customer issues."
    },
    {
      id: 'callControl',
      icon: <SlidersHorizontal className="w-6 h-6 text-orange-400" />,
      title: 'Call Control',
      score: 70,
      color: 'from-orange-500 to-orange-600',
      details: "Agent's ability to guide the conversation, manage time, and adhere to call flow protocols."
    }
  ];

  const handleCallClick = (call) => {
    // Navigate to detailed feedback page instead of showing modal
    navigateToFeedbackDetail(call);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedCall(null);
    setExpandedCategory('');
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="ml-20 lg:ml-64 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Feedback Sessions
          </h1>
          <p className="text-gray-400">Review and analyze call performance</p>
        </div>

        {/* Call List */}
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">
            Recent Calls
          </h2>
          
          {/* Grid layout for calls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calls.map((call) => (
              <div
                key={call.id}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group ${
                  selectedCall && selectedCall.id === call.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl transform scale-[1.02]'
                    : 'bg-gray-700/30 hover:bg-gray-600/40 hover:shadow-lg transform hover:scale-[1.005] border border-gray-600/50'
                }`}
                onClick={() => handleCallClick(call)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">
                    {call.id}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star
                      className={`w-4 h-4 ${
                        selectedCall && selectedCall.id === call.id
                          ? 'text-yellow-200 fill-yellow-200'
                          : 'text-yellow-400 fill-yellow-400'
                      }`}
                    />
                    <span className={`${
                        selectedCall && selectedCall.id === call.id
                          ? 'text-white'
                          : 'text-gray-300'
                      }`}>
                      {call.rating.toFixed(1)}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                        selectedCall && selectedCall.id === call.id
                          ? 'text-white'
                          : 'text-gray-400 group-hover:translate-x-1'
                      }`}
                    />
                  </div>
                </div>
                <p className={`text-sm font-semibold ${
                    selectedCall && selectedCall.id === call.id
                      ? 'text-indigo-100'
                      : 'text-gray-200'
                  }`}>
                  {call.user}
                </p>
                <p className={`text-sm ${
                    selectedCall && selectedCall.id === call.id
                      ? 'text-indigo-200'
                      : 'text-gray-400'
                  }`}>
                  {call.date} | {call.duration}
                </p>
              </div>
            ))}
          </div>
          
          {/* Instruction message */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Select a call to view its detailed feedback and analysis
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedCall && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700/50 relative">
            {/* Close Button */}
            <button
              onClick={closeFeedbackModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-125"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Back to Recent Calls Button */}
            <button
              onClick={() => setCurrentPage('feedback')}
              className="absolute top-4 left-4 text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2"
              title="Back to Recent Calls"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Recent Calls</span>
            </button>

            {/* Modal Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-4 border-b border-gray-600 mt-8">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  Call Details: {selectedCall.id}
                </h2>
                <p className="text-gray-300 text-sm md:text-base">
                  User: <span className="font-medium text-white">{selectedCall.user}</span> | Date:{' '}
                  <span className="font-medium text-white">{selectedCall.date}</span>
                </p>
                <p className="text-gray-300 text-sm md:text-base">
                  Duration: <span className="font-medium text-white">{selectedCall.duration}</span> | Rating:{' '}
                  <span className="font-medium inline-flex items-center gap-1 text-white">
                    {selectedCall.rating.toFixed(1)}{' '}
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </span>
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold mt-4 md:mt-0 border ${getSentimentColor(selectedCall.sentiment)}`}>
                Sentiment: {selectedCall.sentiment}
              </span>
            </div>

            {/* Call Transcript */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-200 mb-3">
                Transcript
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-4 h-40 overflow-y-auto border border-gray-600">
                <p className="text-gray-300 leading-relaxed">
                  {selectedCall.transcript}
                </p>
              </div>
            </div>

            {/* Key Issues */}
            {selectedCall.issues && selectedCall.issues.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-400" /> Key Issues
                </h3>
                <ul className="list-disc list-inside text-red-300 space-y-1">
                  {selectedCall.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            {selectedCall.strengths && selectedCall.strengths.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                  <Check className="w-6 h-6 text-green-400" /> Strengths
                </h3>
                <ul className="list-disc list-inside text-green-300 space-y-1">
                  {selectedCall.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Feedback Categories */}
            <h3 className="text-xl font-bold text-gray-200 mb-4">
              Performance Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-700/30 rounded-xl p-4 cursor-pointer transition-colors duration-200 border border-gray-600/50 hover:bg-gray-600/40 group"
                  onClick={() =>
                    setExpandedCategory(expandedCategory === category.id ? '' : category.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
                        {category.icon}
                      </span>
                      <h4 className="font-semibold text-gray-200">
                        {category.title}
                      </h4>
                    </div>
                    <span className={`text-lg font-bold transition-transform duration-200 group-hover:scale-110 ${getScoreColor(category.score)}`}>
                      {category.score}%
                    </span>
                  </div>
                  {expandedCategory === category.id && (
                    <p className="text-sm text-gray-400 mt-2 border-t border-gray-600 pt-2">
                      {category.details}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Detailed Analysis */}
            <div className="mt-8">
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Actionable Insights
              </h3>
              <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/30">
                <p className="text-indigo-200">
                  Based on this call, the agent could improve by focusing on <strong>active listening</strong> and{' '}
                  <strong>empathy</strong> in their opening statements. Consider incorporating more
                  open-ended questions to fully grasp customer needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSessions;