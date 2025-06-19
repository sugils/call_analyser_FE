// contexts/AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('login');
  const [activeTab, setActiveTab] = useState('overview');
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const navigate = (page, tab = null) => {
    setCurrentPage(page);
    if (tab) setActiveTab(tab);
  };

  const navigateToFeedbackDetail = (feedbackData) => {
    setCurrentFeedback(feedbackData);
    setCurrentPage('feedback-detail');
    setActiveTab('feedback');
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const value = {
    currentPage,
    activeTab,
    currentFeedback,
    notifications,
    navigate,
    setActiveTab,
    navigateToFeedbackDetail,
    addNotification,
    markNotificationAsRead,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};