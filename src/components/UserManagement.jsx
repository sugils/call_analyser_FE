import React, { useState, useEffect } from 'react';
import apiService from './apiService';

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

const LoaderIcon = () => (
  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
  </svg>
);

const UserManagement = ({ setCurrentPage, navigateToUserDashboard }) => {
  // State for dynamic data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [expandedCalls, setExpandedCalls] = useState({});
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });

  // Add user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'candidate'
  });

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const usersData = await apiService.getUsers();
      const formattedUsers = usersData.map(user => apiService.formatUserForFrontend(user));
      
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
    
    // Set up auto-refresh every 2 minutes
    const refreshInterval = setInterval(fetchUsers, 2 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Search and filter functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const results = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchQuery, users]);

  // Sorting functionality
  useEffect(() => {
    if (!sortConfig.key) return;
    
    let sortableUsers = [...filteredUsers];
    sortableUsers.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle numeric values
      if (sortConfig.key === 'avgRating' || sortConfig.key === 'totalCalls') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredUsers(sortableUsers);
  }, [sortConfig, users]);

  // Add new user
  const handleAddUser = async () => {
    try {
      if (!newUser.name.trim() || !newUser.email.trim()) {
        alert('Name and email are required');
        return;
      }

      setIsLoading(true);
      const createdUser = await apiService.createUser(newUser);
      
      // Add to local state
      const formattedUser = apiService.formatUserForFrontend(createdUser);
      setUsers(prev => [formattedUser, ...prev]);
      
      // Reset form and close modal
      setNewUser({ name: '', email: '', role: 'candidate' });
      setShowAddModal(false);
      
      // Show success message
      alert('User created successfully!');
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete/deactivate user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    try {
      setIsLoading(true);
      await apiService.deactivateUser(userId);
      
      // Remove from local state
      setUsers(prev => prev.filter(u => u.id !== userId));
      
      alert('User deactivated successfully!');
      
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Failed to deactivate user: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing user
  const handleEditUser = (user) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  // Save edit
  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      
      const updatedUser = await apiService.updateUser(editingId, {
        name: editName,
        email: editEmail,
        role: editRole
      });
      
      // Update local state
      const formattedUser = apiService.formatUserForFrontend(updatedUser);
      setUsers(prev => prev.map(u => u.id === editingId ? formattedUser : u));
      
      // Reset editing state
      setEditingId(null);
      setEditName('');
      setEditEmail('');
      setEditRole('');
      
      alert('User updated successfully!');
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
    setEditRole('');
  };

  // Toggle call history
  const toggleCalls = (userId) => {
    setExpandedCalls(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Navigate to user dashboard
  const handleViewDashboard = (userId) => {
    if (navigateToUserDashboard) {
      navigateToUserDashboard(userId);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    fetchUsers();
  };

  // Sorting request
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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

  // Loading state
  if (isLoading && !lastUpdated) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans transition-colors duration-300`}>
        <div className="ml-20 lg:ml-64 min-h-screen">
          <div className="p-8 lg:p-10">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <LoaderIcon className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
                <h3 className="text-xl font-semibold mb-2">Loading Users</h3>
                <p className={theme.subtext}>Fetching user data from server...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !lastUpdated) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans transition-colors duration-300`}>
        <div className="ml-20 lg:ml-64 min-h-screen">
          <div className="p-8 lg:p-10">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Failed to Load Users</h3>
                <p className={`${theme.subtext} mb-4`}>{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshIcon />
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                {isLoading && (
                  <LoaderIcon className="ml-3 text-indigo-400" />
                )}
              </h2>
              <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'} mt-2 text-lg`}>
                Manage users and analyze their performance
              </p>
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
                onClick={handleRefresh}
                disabled={isLoading}
                className={`p-3 rounded-full transition-colors ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-white/10'
                }`}
                title="Refresh Data"
              >
                <RefreshIcon className={isLoading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-xl transform hover:scale-105 transition-all whitespace-nowrap font-semibold"
              >
                <PlusIcon />
                <span className="hidden md:inline">Add User</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && lastUpdated && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-300">
                <AlertTriangleIcon />
                <span className="font-medium">Warning</span>
              </div>
              <p className="text-red-200 text-sm mt-1">
                Failed to fetch latest data: {error}. Showing cached data from {lastUpdated.toLocaleTimeString()}.
              </p>
            </div>
          )}

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
                      {filteredUsers.length > 0 ? (filteredUsers.reduce((acc, user) => acc + (user.avgRating || 0), 0) / filteredUsers.length).toFixed(1) : '0.0'}
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
                      {filteredUsers.reduce((acc, user) => acc + (user.totalCalls || 0), 0)}
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
                Users List ({filteredUsers.length})
              </h3>

              {filteredUsers.length === 0 ? (
                <div className={`text-center py-12 ${theme.subtext}`}>
                  <UsersIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h4 className="text-xl font-semibold mb-2">No Users Found</h4>
                  <p className="mb-4">
                    {searchQuery ? 'No users match your search criteria.' : 'Get started by adding your first user.'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add First User
                    </button>
                  )}
                </div>
              ) : (
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
                                    <span className="text-white font-bold text-sm">{user.avatar || user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold block">{user.name}</span>
                                    <span className={`text-xs ${theme.subtext}`}>{user.totalCalls || 0} calls</span>
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
                              {editingId === user.id ? (
                                <select
                                  value={editRole}
                                  onChange={(e) => setEditRole(e.target.value)}
                                  className={`${theme.bg} ${theme.text} border ${theme.border} rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium`}
                                >
                                  <option value="candidate">Candidate</option>
                                  <option value="supervisor">Supervisor</option>
                                  <option value="admin">Admin</option>
                                </select>
                              ) : (
                                <div className="text-sm font-medium capitalize">{user.role}</div>
                              )}
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
                                  (user.avgRating || 0) >= 4.5 ? 'text-yellow-400' : 
                                  (user.avgRating || 0) >= 4.0 ? 'text-yellow-500' : 
                                  (user.avgRating || 0) >= 3.5 ? 'text-orange-500' : 
                                  'text-orange-600'
                                }`} />
                                <span className="font-bold text-sm">{(user.avgRating || 0).toFixed(1)}</span>
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
                                    disabled={isLoading}
                                    className={`text-green-500 hover:bg-green-500/10 rounded-lg p-2 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title="Save"
                                  >
                                    {isLoading ? <LoaderIcon /> : <CheckIcon />}
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    disabled={isLoading}
                                    className={`text-red-500 hover:bg-red-500/10 rounded-lg p-2 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                    disabled={isLoading}
                                    className={`text-indigo-500 hover:bg-indigo-500/10 rounded-lg p-2 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    title="Edit"
                                  >
                                    <EditIcon />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={isLoading}
                                    className={`text-red-500 hover:bg-red-500/10 rounded-lg p-2 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                  
                                  {user.calls && user.calls.length > 0 ? (
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
                                          {user.calls.slice(0, 3).map(call => (
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
                                  ) : (
                                    <div className={`text-center py-8 ${theme.subtext}`}>
                                      <PhoneIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                      <p>No call history available</p>
                                      <p className="text-sm mt-1">Call history will appear here after analyses are completed</p>
                                    </div>
                                  )}
                                  
                                  <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200'} flex justify-between items-center`}>
                                    <span className={`text-sm ${theme.subtext}`}>
                                      Showing {Math.min(3, user.calls?.length || 0)} of {user.calls?.length || 0} calls
                                    </span>
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
              )}
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
              disabled={isLoading}
              className={`absolute top-6 right-6 ${theme.text} hover:text-gray-400 transition-colors p-2 hover:bg-white/10 rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <CloseIcon />
            </button>
            <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-8 flex items-center`}>
              <PlusIcon className={`mr-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
              Add User
            </h3>
            <div className="space-y-5">
              <div>
                <label className={`block text-sm font-bold ${theme.subtext} mb-2`}>Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({...prev, name: e.target.value}))}
                  className={`w-full px-5 py-3 ${theme.bg} ${theme.text} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium`}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className={`block text-sm font-bold ${theme.subtext} mb-2`}>Email *</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({...prev, email: e.target.value}))}
                  className={`w-full px-5 py-3 ${theme.bg} ${theme.text} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium`}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className={`block text-sm font-bold ${theme.subtext} mb-2`}>Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({...prev, role: e.target.value}))}
                  className={`w-full px-5 py-3 ${theme.bg} ${theme.text} border ${theme.border} rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium`}
                  disabled={isLoading}
                >
                  <option value="candidate">Candidate</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isLoading}
                className={`flex-1 px-4 py-3 border ${theme.border} rounded-xl ${theme.hover} font-semibold transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={isLoading || !newUser.name.trim() || !newUser.email.trim()}
                className={`flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  isLoading || !newUser.name.trim() || !newUser.email.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg'
                }`}
              >
                {isLoading ? <LoaderIcon /> : <PlusIcon />}
                {isLoading ? 'Creating...' : 'Add User'}
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