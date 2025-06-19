import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Star, 
  ChevronRight, 
  Users2, 
  BarChart4, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
  Eye,
  LayoutDashboard,
  Target,
  CheckCircle,
  XCircle,
  Calendar,
  Clock
} from 'lucide-react';

const Dashboard = ({ setCurrentPage, navigateToUserDashboard }) => {
  const [metrics] = useState({
    totalUsers: 15,
    activeTrainees: 12,
    avgTeamRating: 4.2,
    totalCallsToday: 45,
    improvementRate: 85,
    weeklyProgress: 12.5
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Sample data for top performers and attention needed
  const topPerformers = [
    {
      id: 2,
      name: 'Jane Smith',
      avatar: 'JS',
      rating: 4.8,
      improvement: '+15%',
      callsToday: 8,
      strongestSkill: 'Active Listening',
      trend: 'up'
    },
    {
      id: 4,
      name: 'Maria Garcia',
      avatar: 'MG',
      rating: 4.6,
      improvement: '+12%',
      callsToday: 6,
      strongestSkill: 'Problem Solving',
      trend: 'up'
    },
    {
      id: 1,
      name: 'John Doe',
      avatar: 'JD',
      rating: 4.5,
      improvement: '+8%',
      callsToday: 7,
      strongestSkill: 'Communication',
      trend: 'up'
    }
  ];

  const needsAttention = [
    {
      id: 5,
      name: 'David Wilson',
      avatar: 'DW',
      rating: 3.2,
      decline: '-5%',
      callsToday: 4,
      weakestSkill: 'Call Control',
      trend: 'down',
      priority: 'high'
    },
    {
      id: 3,
      name: 'Peter Jones',
      avatar: 'PJ',
      rating: 3.8,
      decline: '-2%',
      callsToday: 5,
      weakestSkill: 'Empathy',
      trend: 'down',
      priority: 'medium'
    }
  ];

  const recentTrainingActivities = [
    {
      id: 1,
      user: 'Sarah Johnson',
      activity: 'completed Advanced Communication module',
      time: '2 hours ago',
      type: 'training',
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      color: 'bg-green-500'
    },
    {
      id: 2,
      user: 'Mike Chen',
      activity: 'achieved 90% score in Call Control assessment',
      time: '4 hours ago',
      type: 'achievement',
      icon: <Award className="w-5 h-5 text-white" />,
      color: 'bg-yellow-500'
    },
    {
      id: 3,
      user: 'Lisa Wong',
      activity: 'requested feedback session for yesterday\'s calls',
      time: '6 hours ago',
      type: 'request',
      icon: <Phone className="w-5 h-5 text-white" />,
      color: 'bg-blue-500'
    },
    {
      id: 4,
      user: 'David Wilson',
      activity: 'missed scheduled training session',
      time: '1 day ago',
      type: 'alert',
      icon: <XCircle className="w-5 h-5 text-white" />,
      color: 'bg-red-500'
    }
  ];

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Navigate to individual user dashboard
  const viewUserDashboard = (userId) => {
    if (navigateToUserDashboard) {
      navigateToUserDashboard(userId);
    }
  };

  // Theme variables
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

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans overflow-hidden transition-colors duration-300`}>
      {/* Main Content */}
      <div className="ml-20 lg:ml-64 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold flex items-center">
              <LayoutDashboard className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              Training Dashboard
            </h2>
            <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} mt-1`}>Monitor team performance and training progress</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className={`text-sm ${theme.subtext}`}>Today's Date</p>
              <p className="font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Key Training Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Trainees */}
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur-sm border border-indigo-500/20' : 'bg-white border border-indigo-100 shadow-md'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600 rounded-full ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} text-sm font-medium`}>Total Trainees</p>
                  <p className={`text-4xl font-bold mt-2 ${isDarkMode ? '' : 'text-gray-800'}`}>{metrics.totalUsers}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-110">
                  <Users2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} text-sm font-medium`}>
                  {metrics.activeTrainees} active today
                </span>
              </div>
            </div>
          </div>

          {/* Team Average Rating */}
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-pink-600/10 to-red-600/10 backdrop-blur-sm border border-pink-500/20' : 'bg-white border border-pink-100 shadow-md'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-pink-600 rounded-full ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`${isDarkMode ? 'text-pink-300' : 'text-pink-600'} text-sm font-medium`}>Team Avg Rating</p>
                  <p className={`text-4xl font-bold mt-2 ${isDarkMode ? '' : 'text-gray-800'}`}>{metrics.avgTeamRating}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-pink-600 to-red-600 rounded-xl shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300 group-hover:scale-110">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +0.3 this week
                </span>
              </div>
            </div>
          </div>

          {/* Improvement Rate */}
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-sm border border-green-500/20' : 'bg-white border border-green-100 shadow-md'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-green-600 rounded-full ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`${isDarkMode ? 'text-green-300' : 'text-green-600'} text-sm font-medium`}>Improvement Rate</p>
                  <p className={`text-4xl font-bold mt-2 ${isDarkMode ? '' : 'text-gray-800'}`}>{metrics.improvementRate}%</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-110">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} text-sm font-medium`}>
                  12 trainees improving
                </span>
              </div>
            </div>
          </div>

          {/* Today's Calls */}
          <div className={`${isDarkMode ? 'bg-gradient-to-br from-amber-600/10 to-orange-600/10 backdrop-blur-sm border border-amber-500/20' : 'bg-white border border-amber-100 shadow-md'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-lg`}>
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-amber-600 rounded-full ${isDarkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className={`${isDarkMode ? 'text-amber-300' : 'text-amber-600'} text-sm font-medium`}>Today's Calls</p>
                  <p className={`text-4xl font-bold mt-2 ${isDarkMode ? '' : 'text-gray-800'}`}>{metrics.totalCallsToday}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300 group-hover:scale-110">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8 vs yesterday
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.border} relative overflow-hidden transition-all duration-300`}>
            <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
              <Award className={`mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
              Top Performers
            </h3>
            
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.id} className={`flex items-center justify-between p-4 rounded-xl ${theme.hover} transition-all duration-300 group`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">{performer.avatar}</span>
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-xs">👑</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{performer.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-bold text-sm">{performer.rating}</span>
                        </div>
                        <span className="text-green-500 text-sm font-medium">{performer.improvement}</span>
                        <span className={`text-xs ${theme.subtext}`}>{performer.callsToday} calls today</span>
                      </div>
                      <p className={`text-xs ${theme.subtext} mt-1`}>Best at: {performer.strongestSkill}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => viewUserDashboard(performer.id)}
                    className={`${isDarkMode ? 'text-green-400 hover:bg-green-400/10' : 'text-green-600 hover:bg-green-600/10'} p-2 rounded-lg transition-all group-hover:scale-110`}
                    title="View Dashboard"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className={`mt-6 pt-4 border-t ${theme.border} flex items-center justify-between`}>
              <span className={`text-sm ${theme.subtext}`}>Outstanding work this week!</span>
              <button 
                onClick={() => setCurrentPage('users')}
                className={`${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'} text-sm transition-colors flex items-center`}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Needs Attention */}
          <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.border} relative overflow-hidden transition-all duration-300`}>
            <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"></div>
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
              <AlertTriangle className={`mr-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
              Needs Attention
            </h3>
            
            <div className="space-y-4">
              {needsAttention.map((user) => (
                <div key={user.id} className={`flex items-center justify-between p-4 rounded-xl ${theme.hover} transition-all duration-300 group border-l-4 ${user.priority === 'high' ? 'border-red-500' : 'border-orange-500'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{user.avatar}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{user.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.priority === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                          {user.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                          <span className="font-bold text-sm">{user.rating}</span>
                        </div>
                        <span className="text-red-500 text-sm font-medium flex items-center">
                          <TrendingDown className="w-4 h-4 mr-1" />
                          {user.decline}
                        </span>
                        <span className={`text-xs ${theme.subtext}`}>{user.callsToday} calls today</span>
                      </div>
                      <p className={`text-xs ${theme.subtext} mt-1`}>Needs help with: {user.weakestSkill}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewUserDashboard(user.id)}
                      className={`${isDarkMode ? 'text-orange-400 hover:bg-orange-400/10' : 'text-orange-600 hover:bg-orange-600/10'} p-2 rounded-lg transition-all group-hover:scale-110`}
                      title="View Dashboard"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`mt-6 pt-4 border-t ${theme.border} flex items-center justify-between`}>
              <span className={`text-sm ${theme.subtext}`}>Schedule coaching sessions</span>
              <button 
                onClick={() => setCurrentPage('users')}
                className={`${isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-500'} text-sm transition-colors flex items-center`}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Training Activities */}
        <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.border} transition-all duration-300`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
              <Clock className={`mr-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
              Recent Training Activities
            </h3>
            <button 
              onClick={() => setCurrentPage('feedback')}
              className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} text-sm transition-colors flex items-center`}
            >
              View All Activities
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentTrainingActivities.map((item) => (
              <div key={item.id} className={`flex items-start p-4 rounded-xl ${theme.hover} transition-colors group`}>
                <div className={`p-3 ${item.color} rounded-xl mr-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className={isDarkMode ? 'text-white' : 'text-gray-800'}>
                    <span className="font-semibold">{item.user}</span> {item.activity}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={theme.subtext + ' text-sm'}>{item.time}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'training' ? 'bg-green-500/20 text-green-500' :
                      item.type === 'achievement' ? 'bg-yellow-500/20 text-yellow-500' :
                      item.type === 'request' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;