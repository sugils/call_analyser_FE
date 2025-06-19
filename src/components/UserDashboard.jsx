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
  ChevronRight
} from 'lucide-react';

const UserDashboard = ({ userId = 1, setCurrentPage, navigateToFeedbackDetail }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // All users database - in real app, this would come from your backend/context
  const allUsersData = {
    1: {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Agent',
      avatar: 'JD',
      joinDate: '2023-01-15',
      totalCalls: 125,
      averageRating: 4.2,
      improvement: '+12%',
      currentStreak: 5,
      bestSkill: 'Communication',
      improvementArea: 'Call Control',
      performanceData: [
        { period: 'Week 1', rating: 3.8, calls: 15, improvement: 2 },
        { period: 'Week 2', rating: 3.9, calls: 18, improvement: 5 },
        { period: 'Week 3', rating: 4.1, calls: 22, improvement: 8 },
        { period: 'Week 4', rating: 4.2, calls: 20, improvement: 12 },
        { period: 'Week 5', rating: 4.3, calls: 25, improvement: 15 },
        { period: 'Week 6', rating: 4.2, calls: 25, improvement: 12 }
      ],
      skillsData: [
        { skill: 'Communication', score: 85, trend: 'up', color: 'text-blue-500', bgColor: 'bg-blue-500' },
        { skill: 'Active Listening', score: 92, trend: 'up', color: 'text-purple-500', bgColor: 'bg-purple-500' },
        { skill: 'Empathy', score: 78, trend: 'stable', color: 'text-pink-500', bgColor: 'bg-pink-500' },
        { skill: 'Problem Solving', score: 88, trend: 'up', color: 'text-green-500', bgColor: 'bg-green-500' },
        { skill: 'Call Control', score: 65, trend: 'down', color: 'text-orange-500', bgColor: 'bg-orange-500' }
      ],
      topCalls: [
        {
          id: 'CALL001',
          date: '2024-03-15',
          time: '09:30 AM',
          rating: 4.8,
          duration: '5:23',
          customerSatisfaction: 95,
          highlights: ['Excellent problem resolution', 'Great empathy shown', 'Professional tone'],
          overallScore: 92
        },
        {
          id: 'CALL003',
          date: '2024-03-13',
          time: '11:00 AM',
          rating: 4.7,
          duration: '7:12',
          customerSatisfaction: 92,
          highlights: ['Active listening demonstrated', 'Clear communication', 'Efficient resolution'],
          overallScore: 89
        },
        {
          id: 'CALL007',
          date: '2024-03-10',
          time: '02:15 PM',
          rating: 4.6,
          duration: '4:45',
          customerSatisfaction: 90,
          highlights: ['Strong opening', 'Good rapport building', 'Satisfactory closing'],
          overallScore: 87
        }
      ],
      attentionCalls: [
        {
          id: 'CALL005',
          date: '2024-03-11',
          time: '10:45 AM',
          rating: 3.2,
          duration: '8:30',
          customerSatisfaction: 65,
          issues: ['Long resolution time', 'Missed empathy opportunities', 'Unclear explanations'],
          overallScore: 58
        },
        {
          id: 'CALL002',
          date: '2024-03-14',
          time: '02:15 PM',
          rating: 3.5,
          duration: '6:15',
          customerSatisfaction: 70,
          issues: ['Pacing too fast', 'Could improve active listening', 'Abrupt closing'],
          overallScore: 62
        }
      ]
    },
    2: {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Supervisor',
      avatar: 'JS',
      joinDate: '2022-08-20',
      totalCalls: 98,
      averageRating: 4.8,
      improvement: '+15%',
      currentStreak: 8,
      bestSkill: 'Active Listening',
      improvementArea: 'Time Management',
      performanceData: [
        { period: 'Week 1', rating: 4.5, calls: 12, improvement: 10 },
        { period: 'Week 2', rating: 4.6, calls: 15, improvement: 12 },
        { period: 'Week 3', rating: 4.7, calls: 18, improvement: 14 },
        { period: 'Week 4', rating: 4.8, calls: 16, improvement: 15 },
        { period: 'Week 5', rating: 4.9, calls: 20, improvement: 17 },
        { period: 'Week 6', rating: 4.8, calls: 17, improvement: 15 }
      ],
      skillsData: [
        { skill: 'Communication', score: 92, trend: 'up', color: 'text-blue-500', bgColor: 'bg-blue-500' },
        { skill: 'Active Listening', score: 95, trend: 'up', color: 'text-purple-500', bgColor: 'bg-purple-500' },
        { skill: 'Empathy', score: 88, trend: 'up', color: 'text-pink-500', bgColor: 'bg-pink-500' },
        { skill: 'Problem Solving', score: 90, trend: 'up', color: 'text-green-500', bgColor: 'bg-green-500' },
        { skill: 'Call Control', score: 85, trend: 'stable', color: 'text-orange-500', bgColor: 'bg-orange-500' }
      ],
      topCalls: [
        {
          id: 'CALL011',
          date: '2024-03-15',
          time: '10:00 AM',
          rating: 4.9,
          duration: '4:30',
          customerSatisfaction: 98,
          highlights: ['Outstanding leadership', 'Perfect problem solving', 'Exceptional rapport'],
          overallScore: 96
        },
        {
          id: 'CALL015',
          date: '2024-03-11',
          time: '09:15 AM',
          rating: 4.8,
          duration: '7:20',
          customerSatisfaction: 95,
          highlights: ['Great coaching skills', 'Clear guidance', 'Supportive approach'],
          overallScore: 94
        },
        {
          id: 'CALL014',
          date: '2024-03-12',
          time: '02:00 PM',
          rating: 4.7,
          duration: '4:45',
          customerSatisfaction: 93,
          highlights: ['Efficient resolution', 'Professional demeanor', 'Great follow-up'],
          overallScore: 91
        }
      ],
      attentionCalls: [
        {
          id: 'CALL013',
          date: '2024-03-13',
          time: '11:30 AM',
          rating: 4.1,
          duration: '6:00',
          customerSatisfaction: 82,
          issues: ['Slightly rushed pace', 'Could improve time allocation'],
          overallScore: 78
        }
      ]
    },
    3: {
      id: 3,
      name: 'Peter Jones',
      email: 'peter.jones@example.com',
      role: 'Agent',
      avatar: 'PJ',
      joinDate: '2023-03-10',
      totalCalls: 87,
      averageRating: 3.8,
      improvement: '-2%',
      currentStreak: 2,
      bestSkill: 'Technical Knowledge',
      improvementArea: 'Empathy',
      performanceData: [
        { period: 'Week 1', rating: 4.0, calls: 14, improvement: 5 },
        { period: 'Week 2', rating: 3.9, calls: 16, improvement: 3 },
        { period: 'Week 3', rating: 3.8, calls: 15, improvement: 1 },
        { period: 'Week 4', rating: 3.7, calls: 13, improvement: -1 },
        { period: 'Week 5', rating: 3.8, calls: 14, improvement: 0 },
        { period: 'Week 6', rating: 3.8, calls: 15, improvement: -2 }
      ],
      skillsData: [
        { skill: 'Communication', score: 72, trend: 'down', color: 'text-blue-500', bgColor: 'bg-blue-500' },
        { skill: 'Active Listening', score: 68, trend: 'down', color: 'text-purple-500', bgColor: 'bg-purple-500' },
        { skill: 'Empathy', score: 65, trend: 'down', color: 'text-pink-500', bgColor: 'bg-pink-500' },
        { skill: 'Problem Solving', score: 85, trend: 'stable', color: 'text-green-500', bgColor: 'bg-green-500' },
        { skill: 'Call Control', score: 70, trend: 'stable', color: 'text-orange-500', bgColor: 'bg-orange-500' }
      ],
      topCalls: [
        {
          id: 'CALL023',
          date: '2024-03-13',
          time: '02:45 PM',
          rating: 4.6,
          duration: '4:15',
          customerSatisfaction: 88,
          highlights: ['Strong technical knowledge', 'Good problem analysis', 'Clear solutions'],
          overallScore: 85
        },
        {
          id: 'CALL024',
          date: '2024-03-12',
          time: '10:00 AM',
          rating: 4.1,
          duration: '7:00',
          customerSatisfaction: 80,
          highlights: ['Thorough investigation', 'Persistent approach', 'Good documentation'],
          overallScore: 79
        }
      ],
      attentionCalls: [
        {
          id: 'CALL021',
          date: '2024-03-15',
          time: '08:30 AM',
          rating: 3.2,
          duration: '5:00',
          customerSatisfaction: 68,
          issues: ['Lack of empathy', 'Rushed customer interaction', 'Missed emotional cues'],
          overallScore: 62
        },
        {
          id: 'CALL022',
          date: '2024-03-14',
          time: '12:15 PM',
          rating: 3.0,
          duration: '6:30',
          customerSatisfaction: 65,
          issues: ['Poor listening skills', 'Interrupted customer', 'Inadequate follow-up'],
          overallScore: 58
        },
        {
          id: 'CALL025',
          date: '2024-03-11',
          time: '03:30 PM',
          rating: 3.4,
          duration: '5:45',
          customerSatisfaction: 70,
          issues: ['Monotone delivery', 'Lack of engagement', 'Minimal rapport building'],
          overallScore: 64
        }
      ]
    },
    4: {
      id: 4,
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      role: 'Agent',
      avatar: 'MG',
      joinDate: '2022-11-05',
      totalCalls: 110,
      averageRating: 4.6,
      improvement: '+18%',
      currentStreak: 7,
      bestSkill: 'Problem Solving',
      improvementArea: 'Call Efficiency',
      performanceData: [
        { period: 'Week 1', rating: 4.2, calls: 18, improvement: 8 },
        { period: 'Week 2', rating: 4.3, calls: 20, improvement: 12 },
        { period: 'Week 3', rating: 4.5, calls: 19, improvement: 15 },
        { period: 'Week 4', rating: 4.6, calls: 18, improvement: 18 },
        { period: 'Week 5', rating: 4.7, calls: 17, improvement: 20 },
        { period: 'Week 6', rating: 4.6, calls: 18, improvement: 18 }
      ],
      skillsData: [
        { skill: 'Communication', score: 88, trend: 'up', color: 'text-blue-500', bgColor: 'bg-blue-500' },
        { skill: 'Active Listening', score: 85, trend: 'up', color: 'text-purple-500', bgColor: 'bg-purple-500' },
        { skill: 'Empathy', score: 90, trend: 'up', color: 'text-pink-500', bgColor: 'bg-pink-500' },
        { skill: 'Problem Solving', score: 95, trend: 'up', color: 'text-green-500', bgColor: 'bg-green-500' },
        { skill: 'Call Control', score: 78, trend: 'stable', color: 'text-orange-500', bgColor: 'bg-orange-500' }
      ],
      topCalls: [
        {
          id: 'CALL033',
          date: '2024-03-13',
          time: '09:15 AM',
          rating: 4.8,
          duration: '4:45',
          customerSatisfaction: 96,
          highlights: ['Brilliant problem solving', 'Creative solutions', 'Customer delight'],
          overallScore: 94
        },
        {
          id: 'CALL034',
          date: '2024-03-12',
          time: '03:20 PM',
          rating: 4.7,
          duration: '7:10',
          customerSatisfaction: 93,
          highlights: ['Thorough analysis', 'Patient approach', 'Great follow-through'],
          overallScore: 91
        },
        {
          id: 'CALL032',
          date: '2024-03-14',
          time: '01:45 PM',
          rating: 4.6,
          duration: '5:30',
          customerSatisfaction: 90,
          highlights: ['Empathetic response', 'Clear explanations', 'Proactive suggestions'],
          overallScore: 88
        }
      ],
      attentionCalls: [
        {
          id: 'CALL031',
          date: '2024-03-15',
          time: '10:30 AM',
          rating: 4.0,
          duration: '6:15',
          customerSatisfaction: 78,
          issues: ['Call took too long', 'Could be more efficient', 'Over-explained solutions'],
          overallScore: 75
        }
      ]
    },
    5: {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      role: 'Agent',
      avatar: 'DW',
      joinDate: '2023-06-12',
      totalCalls: 92,
      averageRating: 3.2,
      improvement: '-5%',
      currentStreak: 1,
      bestSkill: 'Technical Knowledge',
      improvementArea: 'Call Control',
      performanceData: [
        { period: 'Week 1', rating: 3.5, calls: 16, improvement: 2 },
        { period: 'Week 2', rating: 3.4, calls: 15, improvement: 0 },
        { period: 'Week 3', rating: 3.3, calls: 14, improvement: -2 },
        { period: 'Week 4', rating: 3.2, calls: 16, improvement: -3 },
        { period: 'Week 5', rating: 3.1, calls: 15, improvement: -5 },
        { period: 'Week 6', rating: 3.2, calls: 16, improvement: -5 }
      ],
      skillsData: [
        { skill: 'Communication', score: 60, trend: 'down', color: 'text-blue-500', bgColor: 'bg-blue-500' },
        { skill: 'Active Listening', score: 55, trend: 'down', color: 'text-purple-500', bgColor: 'bg-purple-500' },
        { skill: 'Empathy', score: 58, trend: 'down', color: 'text-pink-500', bgColor: 'bg-pink-500' },
        { skill: 'Problem Solving', score: 75, trend: 'stable', color: 'text-green-500', bgColor: 'bg-green-500' },
        { skill: 'Call Control', score: 52, trend: 'down', color: 'text-orange-500', bgColor: 'bg-orange-500' }
      ],
      topCalls: [
        {
          id: 'CALL043',
          date: '2024-03-13',
          time: '10:45 AM',
          rating: 4.1,
          duration: '5:20',
          customerSatisfaction: 82,
          highlights: ['Good technical knowledge', 'Accurate information', 'Resolved issue'],
          overallScore: 78
        }
      ],
      attentionCalls: [
        {
          id: 'CALL041',
          date: '2024-03-15',
          time: '11:15 AM',
          rating: 2.8,
          duration: '4:50',
          customerSatisfaction: 45,
          issues: ['Poor call control', 'Customer frustration', 'Inadequate resolution', 'Unprofessional tone'],
          overallScore: 42
        },
        {
          id: 'CALL042',
          date: '2024-03-14',
          time: '02:30 PM',
          rating: 3.0,
          duration: '6:05',
          customerSatisfaction: 58,
          issues: ['Long hold times', 'Confusion during call', 'Multiple transfers', 'Poor communication'],
          overallScore: 48
        },
        {
          id: 'CALL044',
          date: '2024-03-12',
          time: '03:55 PM',
          rating: 3.2,
          duration: '4:30',
          customerSatisfaction: 62,
          issues: ['Rushed approach', 'Missed customer needs', 'Incomplete follow-up'],
          overallScore: 55
        }
      ]
    }
  };

  // Get current user data or fallback to default
  const userData = allUsersData[userId] || allUsersData[1];

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

  const handleCallClick = (call) => {
    // Navigate to feedback detail page with call data
    const feedbackData = {
      ...call,
      userName: userData.name,
      user: userData.name,
      sentiment: call.rating >= 4.5 ? 'Very Positive' : call.rating >= 4.0 ? 'Positive' : call.rating >= 3.5 ? 'Neutral' : 'Negative',
      transcript: `This is a detailed transcript for call ${call.id} with ${userData.name}. The call lasted ${call.duration} and covered various topics related to customer service and support.`,
      issues: call.issues || ['No major issues identified'],
      strengths: call.highlights || ['Professional approach', 'Good technical knowledge'],
      fileName: `${call.id}_${userData.name.replace(' ', '_')}.mp3`,
      callDetails: {
        transcript: `Detailed transcript for ${call.id} with ${userData.name}...`,
        categories: userData.skillsData.map(skill => ({
          id: skill.skill.toLowerCase().replace(' ', ''),
          title: skill.skill,
          score: skill.score,
          color: skill.color,
          subtitle: `${skill.skill} performance analysis`
        }))
      }
    };
    
    if (navigateToFeedbackDetail) {
      navigateToFeedbackDetail(feedbackData);
    }
  };

  const handleBackToDashboard = () => {
    if (setCurrentPage) {
      setCurrentPage('dashboard');
    }
  };

  // Get best proficiency score
  const getBestProficiency = () => {
    const bestSkill = userData.skillsData.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    return bestSkill.score;
  };

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
                <span className="text-white font-bold text-xl">{userData.avatar}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <p className={`${theme.subtext} text-lg`}>{userData.role} • Member since {new Date(userData.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
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

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${theme.cardBg} rounded-2xl p-6 border ${theme.border} shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${theme.subtext} text-sm font-medium`}>Total Rating</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold">{userData.averageRating}</span>
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <span className={`text-sm font-medium flex items-center mt-1 ${
                  userData.improvement.startsWith('+') ? 'text-green-500' : 
                  userData.improvement.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {userData.improvement.startsWith('+') ? <TrendingUp className="w-4 h-4 mr-1" /> : 
                   userData.improvement.startsWith('-') ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                  {userData.improvement}
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
                <span className="text-2xl font-bold mt-2 block">{userData.totalCalls}</span>
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
                <span className="text-2xl font-bold mt-2 block">{userData.bestSkill}</span>
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
                <span className="text-2xl font-bold mt-2 block">{userData.currentStreak}</span>
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
              Performance Trend - {userData.name}
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
                {userData.performanceData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-end h-full relative group">
                      <div
                        className={`w-10 bg-gradient-to-t ${
                          data.rating >= 4.5 ? 'from-green-600 to-green-500' :
                          data.rating >= 4.0 ? 'from-indigo-600 to-purple-600' :
                          data.rating >= 3.5 ? 'from-yellow-600 to-yellow-500' :
                          'from-red-600 to-red-500'
                        } rounded-t-lg transition-all duration-300 group-hover:brightness-110`}
                        style={{ height: `${(data.rating / 5) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.rating}
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
              {userData.skillsData.map((skill) => (
                <div key={skill.skill} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{skill.score}%</span>
                      {skill.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {skill.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {skill.trend === 'stable' && <div className="w-4 h-4 rounded-full bg-gray-400"></div>}
                    </div>
                  </div>
                  <div className={`h-2 ${theme.border} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full ${skill.bgColor} rounded-full transition-all duration-500 group-hover:brightness-110`}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`mt-6 pt-4 border-t ${theme.border}`}>
              <p className={`text-sm ${theme.subtext}`}>
                <span className="font-semibold">Focus Area:</span> {userData.improvementArea}
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
              {userData.topCalls.length > 0 ? userData.topCalls.map((call, index) => (
                <div key={call.id} className={`p-4 rounded-xl ${theme.hover} transition-all duration-300 group cursor-pointer border-l-4 border-green-500`}
                     onClick={() => handleCallClick(call)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{call.id}</h4>
                        <p className={`text-sm ${theme.subtext}`}>{call.date} at {call.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{call.rating}</span>
                      </div>
                      <Eye className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={theme.subtext}>Overall Score</span>
                      <span className="font-bold text-green-500">{call.overallScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{width: `${call.overallScore}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {call.highlights.slice(0, 3).map((highlight, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )) : (
                <div className={`p-6 text-center ${theme.subtext}`}>
                  <p>No high-performing calls yet. Keep improving!</p>
                </div>
              )}
            </div>
            
            <button className={`w-full mt-4 p-3 ${theme.hover} rounded-xl transition-all duration-200 text-center font-medium`}>
              View All High-Performance Calls
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
              {userData.attentionCalls.length > 0 ? userData.attentionCalls.map((call, index) => (
                <div key={call.id} className={`p-4 rounded-xl ${theme.hover} transition-all duration-300 group cursor-pointer border-l-4 border-orange-500`}
                     onClick={() => handleCallClick(call)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                        !
                      </div>
                      <div>
                        <h4 className="font-semibold">{call.id}</h4>
                        <p className={`text-sm ${theme.subtext}`}>{call.date} at {call.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                        <span className="font-bold">{call.rating}</span>
                      </div>
                      <Eye className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={theme.subtext}>Overall Score</span>
                      <span className="font-bold text-orange-500">{call.overallScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{width: `${call.overallScore}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {call.issues.slice(0, 3).map((issue, idx) => (
                      <span key={idx} className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs rounded-full">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )) : (
                <div className={`p-6 text-center ${theme.subtext}`}>
                  <p>Great job! No calls need immediate attention.</p>
                </div>
              )}
            </div>
            
            <button className={`w-full mt-4 p-3 ${theme.hover} rounded-xl transition-all duration-200 text-center font-medium`}>
              View All Improvement Opportunities
              <ChevronRight className="w-4 h-4 inline ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;