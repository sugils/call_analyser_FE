import React, { useState, useEffect } from 'react';

// Modern Icon Components
const EditIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const StarIcon = ({ filled = false }) => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrendUpIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const UserManagement = ({ setCurrentPage, navigateToUserDashboard }) => {
  // Initial user data with call history
  const initialUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Agent',
      status: 'Active',
      avgRating: 4.5,
      totalCalls: 125,
      improvementRate: '+12%',
      calls: [
        { id: 'CALL001', date: '2024-03-15', time: '09:30 AM', duration: '5:23', rating: 4.5, sentiment: 'Positive' },
        { id: 'CALL002', date: '2024-03-14', time: '02:15 PM', duration: '3:45', rating: 3.8, sentiment: 'Neutral' },
        { id: 'CALL003', date: '2024-03-13', time: '11:00 AM', duration: '7:12', rating: 4.8, sentiment: 'Very Positive' },
        { id: 'CALL004', date: '2024-03-12', time: '04:30 PM', duration: '6:30', rating: 4.2, sentiment: 'Positive' },
        { id: 'CALL005', date: '2024-03-11', time: '10:45 AM', duration: '4:15', rating: 3.5, sentiment: 'Neutral' }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Supervisor',
      status: 'Active',
      avgRating: 4.7,
      totalCalls: 98,
      improvementRate: '+15%',
      calls: [
        { id: 'CALL011', date: '2024-03-15', time: '10:00 AM', duration: '4:30', rating: 4.7, sentiment: 'Positive' },
        { id: 'CALL012', date: '2024-03-14', time: '03:45 PM', duration: '5:15', rating: 4.1, sentiment: 'Positive' },
        { id: 'CALL013', date: '2024-03-13', time: '11:30 AM', duration: '6:00', rating: 3.9, sentiment: 'Neutral' },
        { id: 'CALL014', date: '2024-03-12', time: '02:00 PM', duration: '4:45', rating: 4.5, sentiment: 'Positive' },
        { id: 'CALL015', date: '2024-03-11', time: '09:15 AM', duration: '7:20', rating: 4.8, sentiment: 'Very Positive' }
      ]
    },
    {
      id: 3,
      name: 'Peter Jones',
      email: 'peter.jones@example.com',
      role: 'Agent',
      status: 'Inactive',
      avgRating: 4.3,
      totalCalls: 87,
      improvementRate: '+8%',
      calls: [
        { id: 'CALL021', date: '2024-03-15', time: '08:30 AM', duration: '5:00', rating: 4.3, sentiment: 'Positive' },
        { id: 'CALL022', date: '2024-03-14', time: '12:15 PM', duration: '6:30', rating: 3.7, sentiment: 'Neutral' },
        { id: 'CALL023', date: '2024-03-13', time: '02:45 PM', duration: '4:15', rating: 4.6, sentiment: 'Positive' },
        { id: 'CALL024', date: '2024-03-12', time: '10:00 AM', duration: '7:00', rating: 4.1, sentiment: 'Positive' },
        { id: 'CALL025', date: '2024-03-11', time: '03:30 PM', duration: '5:45', rating: 3.8, sentiment: 'Neutral' }
      ]
    },
    {
      id: 4,
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      role: 'Agent',
      status: 'Active',
      avgRating: 4.6,
      totalCalls: 110,
      improvementRate: '+18%',
      calls: [
        { id: 'CALL031', date: '2024-03-15', time: '10:30 AM', duration: '6:15', rating: 4.4, sentiment: 'Positive' },
        { id: 'CALL032', date: '2024-03-14', time: '01:45 PM', duration: '5:30', rating: 4.6, sentiment: 'Positive' },
        { id: 'CALL033', date: '2024-03-13', time: '09:15 AM', duration: '4:45', rating: 4.8, sentiment: 'Very Positive' },
        { id: 'CALL034', date: '2024-03-12', time: '03:20 PM', duration: '7:10', rating: 4.5, sentiment: 'Positive' },
        { id: 'CALL035', date: '2024-03-11', time: '11:50 AM', duration: '5:25', rating: 4.3, sentiment: 'Positive' }
      ]
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      role: 'Agent',
      status: 'Active',
      avgRating: 3.9,
      totalCalls: 92,
      improvementRate: '-5%',
      calls: [
        { id: 'CALL041', date: '2024-03-15', time: '11:15 AM', duration: '4:50', rating: 3.7, sentiment: 'Neutral' },
        { id: 'CALL042', date: '2024-03-14', time: '02:30 PM', duration: '6:05', rating: 3.9, sentiment: 'Neutral' },
        { id: 'CALL043', date: '2024-03-13', time: '10:45 AM', duration: '5:20', rating: 4.1, sentiment: 'Positive' },
        { id: 'CALL044', date: '2024-03-12', time: '03:55 PM', duration: '4:30', rating: 3.8, sentiment: 'Neutral' },
        { id: 'CALL045', date: '2024-03-11', time: '01:25 PM', duration: '7:45', rating: 4.0, sentiment: 'Positive' }
      ]
    }
  ];

  const [localUsers, setLocalUsers] = useState(initialUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [expandedCalls, setExpandedCalls] = useState({});
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAddUser = () => {
    const newUser = {
      id: Math.max(...localUsers.map(u => u.id), 0) + 1,
      name: 'New User',
      email: 'new.user@example.com',
      role: 'Agent',
      status: 'Active',
      avgRating: 0,
      totalCalls: 0,
      improvementRate: '0%',
      calls: []
    };
    setLocalUsers([...localUsers, newUser]);
    setShowAddModal(false);
  };

  const handleDeleteUser = (id) => {
    setLocalUsers(localUsers.filter(u => u.id !== id));
  };

  const handleEditUser = (user) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleSaveEdit = () => {
    setLocalUsers(localUsers.map(u =>
      u.id === editingId ? { ...u, name: editName, email: editEmail } : u
    ));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
  };

  const toggleCalls = (userId) => {
    setExpandedCalls(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Navigate to individual user dashboard
  const handleViewDashboard = (userId) => {
    if (navigateToUserDashboard) {
      navigateToUserDashboard(userId);
    }
  };

  // Search and filter functionality
  useEffect(() => {
    const results = localUsers.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchQuery, localUsers]);

  // Sorting functionality
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    let sortableUsers = [...filteredUsers];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredUsers(sortableUsers);
  }, [sortConfig]);

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
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans transition-colors duration-300`}>
      {/* Main Content */}
      <div className="ml-20 lg:ml-64 min-h-screen">
        <div className="p-8 lg:p-10">
          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-bold flex items-center tracking-tight">
                <UsersIcon className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                User Management
              </h2>
              <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} mt-2 text-lg`}>Manage users and analyze their performance</p>
            </div>
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className={`relative flex items-center ${theme.cardBg} rounded-full px-5 py-3 shadow-lg transition-all duration-200 focus-within:shadow-xl flex-1 lg:flex-initial lg:w-72`}>
                <SearchIcon className={`${theme.subtext}`} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className={`${theme.cardBg} ${theme.text} ml-3 outline-none text-sm w-full font-medium`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-xl transform hover:scale-105 transition-all whitespace-nowrap font-semibold"
              >
                <PlusIcon />
                <span className="hidden md:inline">Add User</span>
              </button>
            </div>
          </div>

          {/* User Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {/* Total Users */}
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-indigo-600/10 to-purple-600/10 backdrop-blur-sm border border-indigo-500/20' : 'bg-white border border-indigo-100 shadow-lg'} rounded-2xl p-7 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}>
              <div className={`absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-600 rounded-full ${isDarkMode ? 'opacity-10 group-hover:opacity-20' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} text-sm font-semibold uppercase tracking-wider`}>Total Users</p>
                    <p className={`text-5xl font-bold mt-3 flex items-end ${isDarkMode ? '' : 'text-gray-800'}`}>
                      {filteredUsers.length}
                      <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} text-xl ml-2 font-medium`}>users</span>
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:scale-110">
                    <UsersIcon className="text-white" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-green-500 text-sm font-semibold flex items-center bg-green-500/10 px-3 py-1 rounded-full">
                    <TrendUpIcon className="mr-1" />
                    +12.5%
                  </span>
                  <span className={`${theme.subtext} text-xs`}>vs last month</span>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-green-600/10 to-emerald-600/10 backdrop-blur-sm border border-green-500/20' : 'bg-white border border-green-100 shadow-lg'} rounded-2xl p-7 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}>
              <div className={`absolute -right-12 -bottom-12 w-48 h-48 bg-green-600 rounded-full ${isDarkMode ? 'opacity-10 group-hover:opacity-20' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${isDarkMode ? 'text-green-300' : 'text-green-600'} text-sm font-semibold uppercase tracking-wider`}>Active Users</p>
                    <p className={`text-5xl font-bold mt-3 flex items-end ${isDarkMode ? '' : 'text-gray-800'}`}>
                      {filteredUsers.filter(user => user.status === 'Active').length}
                      <span className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} text-xl ml-2 font-medium`}>users</span>
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-110">
                    <UsersIcon className="text-white" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-green-500 text-sm font-semibold flex items-center bg-green-500/10 px-3 py-1 rounded-full">
                    <TrendUpIcon className="mr-1" />
                    +5.2%
                  </span>
                  <span className={`${theme.subtext} text-xs`}>vs last month</span>
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-pink-600/10 to-red-600/10 backdrop-blur-sm border border-pink-500/20' : 'bg-white border border-pink-100 shadow-lg'} rounded-2xl p-7 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}>
              <div className={`absolute -right-12 -bottom-12 w-48 h-48 bg-pink-600 rounded-full ${isDarkMode ? 'opacity-10 group-hover:opacity-20' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${isDarkMode ? 'text-pink-300' : 'text-pink-600'} text-sm font-semibold uppercase tracking-wider`}>Average Rating</p>
                    <p className={`text-5xl font-bold mt-3 flex items-end ${isDarkMode ? '' : 'text-gray-800'}`}>
                      {(filteredUsers.reduce((acc, user) => acc + user.avgRating, 0) / filteredUsers.length).toFixed(1)}
                      <span className={`${isDarkMode ? 'text-pink-400' : 'text-pink-500'} text-xl ml-2 font-medium`}>/ 5.0</span>
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-pink-600 to-red-600 rounded-2xl shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300 group-hover:scale-110">
                    <StarIcon filled={true} className="text-white w-6 h-6" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-green-500 text-sm font-semibold flex items-center bg-green-500/10 px-3 py-1 rounded-full">
                    <TrendUpIcon className="mr-1" />
                    +0.3
                  </span>
                  <span className={`${theme.subtext} text-xs`}>vs last month</span>
                </div>
              </div>
            </div>

            {/* Total Calls */}
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-amber-600/10 to-orange-600/10 backdrop-blur-sm border border-amber-500/20' : 'bg-white border border-amber-100 shadow-lg'} rounded-2xl p-7 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]`}>
              <div className={`absolute -right-12 -bottom-12 w-48 h-48 bg-amber-600 rounded-full ${isDarkMode ? 'opacity-10 group-hover:opacity-20' : 'opacity-5 group-hover:opacity-10'} transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`${isDarkMode ? 'text-amber-300' : 'text-amber-600'} text-sm font-semibold uppercase tracking-wider`}>Total Calls</p>
                    <p className={`text-5xl font-bold mt-3 flex items-end ${isDarkMode ? '' : 'text-gray-800'}`}>
                      {filteredUsers.reduce((acc, user) => acc + (user.totalCalls || user.calls?.length || 0), 0)}
                      <span className={`${isDarkMode ? 'text-amber-400' : 'text-amber-500'} text-xl ml-2 font-medium`}>calls</span>
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl shadow-lg group-hover:shadow-amber-500/30 transition-all duration-300 group-hover:scale-110">
                    <PhoneIcon className="text-white" />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-green-500 text-sm font-semibold flex items-center bg-green-500/10 px-3 py-1 rounded-full">
                    <TrendUpIcon className="mr-1" />
                    +8.1%
                  </span>
                  <span className={`${theme.subtext} text-xs`}>vs last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className={`${theme.cardBg} rounded-3xl shadow-2xl border ${theme.border} relative overflow-hidden transition-all duration-300`}>
            <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-8 flex items-center">
                <UsersIcon className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                Users List
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className={`border-b ${theme.border}`}>
                      <th className={`px-6 py-4 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider cursor-pointer`} onClick={() => requestSort('name')}>
                        <div className="flex items-center gap-2">
                          Name
                          {sortConfig.key === 'name' && (
                            <span className="text-indigo-500">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider cursor-pointer`} onClick={() => requestSort('email')}>
                        <div className="flex items-center gap-2">
                          Email
                          {sortConfig.key === 'email' && (
                            <span className="text-indigo-500">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider cursor-pointer`} onClick={() => requestSort('role')}>
                        <div className="flex items-center gap-2">
                          Role
                          {sortConfig.key === 'role' && (
                            <span className="text-indigo-500">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider cursor-pointer`} onClick={() => requestSort('status')}>
                        <div className="flex items-center gap-2">
                          Status
                          {sortConfig.key === 'status' && (
                            <span className="text-indigo-500">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider cursor-pointer`} onClick={() => requestSort('avgRating')}>
                        <div className="flex items-center gap-2">
                          Rating
                          {sortConfig.key === 'avgRating' && (
                            <span className="text-indigo-500">
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th className={`px-6 py-4 text-center text-xs font-bold ${theme.subtext} uppercase tracking-wider`}>
                        Performance
                      </th>
                      <th className={`px-6 py-4 text-center text-xs font-bold ${theme.subtext} uppercase tracking-wider`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/20">
                    {filteredUsers.map(user => (
                      <React.Fragment key={user.id}>
                        <tr className={`${theme.hover} transition-all duration-200`}>
                          <td className="px-6 py-5 whitespace-nowrap">
                            {editingId === user.id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className={`${theme.bg} ${theme.text} border ${theme.border} rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full font-medium`}
                              />
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden shadow-md">
                                  <span className="text-white font-bold text-sm">{user.name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <div>
                                  <span className="font-semibold block">{user.name}</span>
                                  <span className={`text-xs ${theme.subtext}`}>{user.totalCalls || user.calls?.length || 0} calls</span>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            {editingId === user.id ? (
                              <input
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className={`${theme.bg} ${theme.text} border ${theme.border} rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full font-medium`}
                              />
                            ) : (
                              <div className="text-sm font-medium">{user.email}</div>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-medium">{user.role}</div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                              user.status === 'Active' 
                                ? 'bg-green-500/20 text-green-500' 
                                : 'bg-red-500/20 text-red-500'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <StarIcon filled={true} className={`${
                                user.avgRating >= 4.5 ? 'text-yellow-400' : 
                                user.avgRating >= 4.0 ? 'text-yellow-500' : 
                                user.avgRating >= 3.5 ? 'text-orange-500' : 
                                'text-orange-600'
                              }`} />
                              <span className="font-bold text-sm">{user.avgRating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`text-sm font-semibold ${
                                user.improvementRate?.startsWith('+') ? 'text-green-500' : 
                                user.improvementRate?.startsWith('-') ? 'text-red-500' : 
                                'text-gray-500'
                              }`}>
                                {user.improvementRate || '0%'}
                              </span>
                              <button
                                onClick={() => toggleCalls(user.id)}
                                className={`${isDarkMode ? 'text-indigo-400 hover:bg-indigo-400/10' : 'text-indigo-600 hover:bg-indigo-600/10'} flex items-center gap-1 transition-all duration-200 px-2 py-1 rounded-lg text-xs font-medium`}
                                title="View Call History"
                              >
                                <PhoneIcon className="w-3 h-3" />
                                {user.calls ? user.calls.length : 0}
                                {expandedCalls[user.id] ? <ChevronUpIcon /> : <ChevronDownIcon />}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-center">
                            {editingId === user.id ? (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={handleSaveEdit}
                                  className={`text-green-500 hover:bg-green-500/10 rounded-lg p-2 transition-all`}
                                  title="Save"
                                >
                                  <CheckIcon />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className={`text-red-500 hover:bg-red-500/10 rounded-lg p-2 transition-all`}
                                  title="Cancel"
                                >
                                  <CloseIcon />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewDashboard(user.id)}
                                  className={`text-purple-500 hover:bg-purple-500/10 rounded-lg p-2 transition-all transform hover:scale-110`}
                                  title="View Performance Dashboard"
                                >
                                  <BarChartIcon />
                                </button>
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className={`text-indigo-500 hover:bg-indigo-500/10 rounded-lg p-2 transition-all`}
                                  title="Edit"
                                >
                                  <EditIcon />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className={`text-red-500 hover:bg-red-500/10 rounded-lg p-2 transition-all`}
                                  title="Delete"
                                >
                                  <DeleteIcon />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Call History Row */}
                        {expandedCalls[user.id] && (
                          <tr>
                            <td colSpan="7" className="px-6 py-6">
                              <div className={`${isDarkMode ? 'bg-indigo-900/10' : 'bg-indigo-50'} p-6 rounded-2xl shadow-inner border ${isDarkMode ? 'border-indigo-500/20' : 'border-indigo-200'}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                                  <p className={`text-lg font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                    Recent Call History for {user.name}
                                  </p>
                                  <button
                                    onClick={() => handleViewDashboard(user.id)}
                                    className={`${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'} flex items-center gap-2 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-purple-500/10`}
                                  >
                                    <BarChartIcon />
                                    View Full Dashboard
                                  </button>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className={`min-w-full rounded-xl overflow-hidden`}>
                                    <thead className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-indigo-100'}`}>
                                      <tr>
                                        <th className={`px-5 py-3 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider`}>Call ID</th>
                                        <th className={`px-5 py-3 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider`}>Date</th>
                                        <th className={`px-5 py-3 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider`}>Duration</th>
                                        <th className={`px-5 py-3 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider`}>Rating</th>
                                        <th className={`px-5 py-3 text-left text-xs font-bold ${theme.subtext} uppercase tracking-wider`}>Sentiment</th>
                                      </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700/30' : 'divide-gray-200'} ${isDarkMode ? 'bg-slate-900/30' : 'bg-white'}`}>
                                      {user.calls && user.calls.slice(0, 3).map(call => (
                                        <tr key={call.id} className={`${theme.hover} transition-all duration-200`}>
                                          <td className={`px-5 py-4 text-sm ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold`}>{call.id}</td>
                                          <td className="px-5 py-4 text-sm font-medium">{call.date}</td>
                                          <td className="px-5 py-4 text-sm font-medium">{call.duration}</td>
                                          <td className="px-5 py-4 text-sm">
                                            <div className="flex items-center gap-1">
                                              <StarIcon filled={true} className="text-yellow-400" />
                                              <span className="font-bold">{call.rating}</span>
                                            </div>
                                          </td>
                                          <td className="px-5 py-4 text-sm">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                                              call.sentiment === 'Positive' ? 'bg-green-500/20 text-green-500' :
                                              call.sentiment === 'Very Positive' ? 'bg-green-600/20 text-green-600' :
                                              call.sentiment === 'Neutral' ? 'bg-yellow-500/20 text-yellow-500' :
                                              'bg-red-500/20 text-red-500'
                                            }`}>
                                              {call.sentiment}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200'} flex justify-between items-center`}>
                                  <span className={`text-sm ${theme.subtext}`}>Showing {Math.min(3, user.calls?.length || 0)} of {user.calls?.length || 0} calls</span>
                                  <button
                                    onClick={() => handleViewDashboard(user.id)}
                                    className={`${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'} transition-colors flex items-center font-semibold`}
                                  >
                                    View All Performance Data
                                    <ChevronRightIcon className="ml-1" />
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
          <div className={`${theme.cardBg} rounded-3xl p-10 w-full max-w-md shadow-2xl transform scale-95 animate-modal-pop-in relative`}>
            <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
            <button
              onClick={() => setShowAddModal(false)}
              className={`absolute top-6 right-6 ${theme.text} hover:text-gray-400 transition-colors p-2 hover:bg-white/10 rounded-lg`}
            >
              <CloseIcon />
            </button>
            <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-8 flex items-center`}>
              <PlusIcon className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
              Add User
            </h3>
            <div className="space-y-5">
              <div>
                <label className={`block text-sm font-bold ${theme.subtext} mb-2`}>Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className={`w-full px-5 py-3 ${theme.bg} ${theme.text} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium`}
                />
              </div>
              <div>
                <label className={`block text-sm font-bold ${theme.subtext} mb-2`}>Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className={`w-full px-5 py-3 ${theme.bg} ${theme.text} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium`}
                />
              </div>
              <div>
                <label className={`block text-sm font-bold ${theme.subtext} mb-2`}>Role</label>
                <select className={`w-full px-5 py-3 ${theme.bg} ${theme.text} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium`}>
                  <option value="Agent">Agent</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className={`flex-1 px-4 py-3 border ${theme.border} rounded-xl ${theme.hover} font-semibold transition-all`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-pop-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-modal-pop-in {
          animation: modal-pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;