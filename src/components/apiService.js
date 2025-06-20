// apiService.js - Enhanced service with comprehensive debugging for VoiceAI Flask backend

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    this.timeout = 30000000; // 5 minutes timeout for audio processing
    this._cache = new Map();
    this._cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Debug logging
    console.log('🔧 ApiService initialized with baseURL:', this.baseURL);
  }

  // Helper method to handle fetch with timeout and proper error handling
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      headers: options.headers,
      hasBody: !!options.body
    });

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      console.log('📨 API Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('❌ API Request failed:', {
        url,
        error: error.message,
        name: error.name,
        stack: error.stack
      });
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - processing took too long');
      }
      throw error;
    }
  }

  // Health check endpoint with enhanced debugging
  async healthCheck() {
    try {
      console.log('🏥 Health check starting for:', this.baseURL);
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/health`);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Health check successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw new Error(`Backend service unavailable: ${error.message}`);
    }
  }

  // ================== USER MANAGEMENT ==================

  // Get all users with debugging
  async getUsers() {
    try {
      console.log('👥 Fetching users from:', `${this.baseURL}/api/users`);
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/users`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Users fetch failed:', errorText);
        throw new Error(`Failed to fetch users: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Users response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      console.log('👥 Users fetched successfully:', data.users?.length || 0, 'users');
      return data.users || [];
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw this.handleApiError(error, 'fetching users');
    }
  }

  // Get user details for dashboard
  async getUserDetails(userId) {
    try {
      console.log('👤 Fetching user details for:', userId);
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/users/${userId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ User details fetch failed:', errorText);
        throw new Error(`Failed to fetch user details: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ User details response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch user details');
      }
      
      return data.user;
    } catch (error) {
      console.error('❌ Error fetching user details:', error);
      throw this.handleApiError(error, 'fetching user details');
    }
  }

  // Create new user
  async createUser(userData) {
    try {
      console.log('👤 Creating new user:', userData);
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/users`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ User creation failed:', errorData);
        throw new Error(errorData.error || `Failed to create user: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ User created successfully:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create user');
      }
      
      return data.user;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw this.handleApiError(error, 'creating user');
    }
  }

  // Update user
  async updateUser(userId, userData) {
    try {
      console.log('👤 Updating user:', userId, userData);
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/users/${userId}`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ User update failed:', errorData);
        throw new Error(errorData.error || `Failed to update user: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ User updated successfully:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update user');
      }
      
      return data.user;
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw this.handleApiError(error, 'updating user');
    }
  }

  // Deactivate user
  async deactivateUser(userId) {
    try {
      console.log('👤 Deactivating user:', userId);
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/users/${userId}/deactivate`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ User deactivation failed:', errorData);
        throw new Error(errorData.error || `Failed to deactivate user: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ User deactivated successfully:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to deactivate user');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error deactivating user:', error);
      throw this.handleApiError(error, 'deactivating user');
    }
  }

  // ================== AUDIO ANALYSIS ==================

  // Main speech analysis endpoint with backend integration
  async analyzeSpeech(audioFile, userId, onProgress = null) {
    try {
      console.log('🎵 Starting speech analysis:', {
        fileName: audioFile?.name,
        fileSize: audioFile?.size,
        userId,
        hasProgressCallback: !!onProgress
      });

      // Validate inputs
      if (!audioFile) {
        throw new Error('No audio file provided');
      }

      if (!userId) {
        throw new Error('User ID is required');
      }

      // Check file size (100MB limit as per backend)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (audioFile.size > maxSize) {
        throw new Error('File size exceeds 100MB limit');
      }

      // Check file type
      const fileExtension = audioFile.name.split('.').pop().toLowerCase();
      const supportedExtensions = ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac'];
      
      if (!supportedExtensions.includes(fileExtension)) {
        throw new Error(`Unsupported file format. Supported formats: ${supportedExtensions.join(', ')}`);
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('user_id', userId);

      console.log('📤 Uploading file to:', `${this.baseURL}/api/analyze-audio`);

      // Report progress
      if (onProgress) {
        onProgress({ stage: 'uploading', progress: 10 });
      }

      // Make request to backend with extended timeout for large files
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(`${this.baseURL}/api/analyze-audio`, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
          // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
        });

        clearTimeout(timeoutId);

        console.log('📨 Analysis response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (onProgress) {
          onProgress({ stage: 'processing', progress: 50 });
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Analysis failed with error:', errorData);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Analysis result received:', result);

        if (onProgress) {
          onProgress({ stage: 'analyzing', progress: 80 });
        }

        // Validate response structure
        if (!result.success) {
          throw new Error(result.error || 'Analysis failed');
        }

        if (onProgress) {
          onProgress({ stage: 'complete', progress: 100 });
        }

        // Format the response for frontend compatibility
        const formatted = this.formatAnalysisForFrontend(result.analysis, audioFile, userId);
        console.log('📊 Formatted analysis result:', formatted);
        return formatted;

      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }

    } catch (error) {
      console.error('❌ Speech analysis failed:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        throw new Error('Cannot connect to speech analysis service. Please check if the backend server is running on port 8000.');
      } else if (error.message.includes('timeout') || error.name === 'AbortError') {
        throw new Error('Audio processing is taking too long. Please try with a shorter audio file.');
      } else {
        throw error;
      }
    }
  }

  // ================== FEEDBACK SESSIONS ==================

  // Get all feedback sessions with enhanced debugging
  async getFeedbackSessions(userId = null, limit = 50) {
    try {
      const params = new URLSearchParams();
      if (userId) params.append('user_id', userId);
      if (limit) params.append('limit', limit.toString());
      
      const url = `${this.baseURL}/api/feedback-sessions${params.toString() ? '?' + params.toString() : ''}`;
      console.log('📋 Fetching feedback sessions from:', url);
      
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Feedback sessions fetch failed:', errorText);
        throw new Error(`Failed to fetch feedback sessions: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Feedback sessions response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch feedback sessions');
      }
      
      console.log('📋 Feedback sessions fetched successfully:', data.sessions?.length || 0, 'sessions');
      return data.sessions || [];
    } catch (error) {
      console.error('❌ Error fetching feedback sessions:', error);
      throw this.handleApiError(error, 'fetching feedback sessions');
    }
  }

  // Get detailed feedback for a session with EXTENSIVE debugging
  async getFeedbackDetail(sessionId) {
    try {
      const url = `${this.baseURL}/api/feedback-sessions/${sessionId}`;
      console.log('🔍 getFeedbackDetail called with sessionId:', sessionId);
      console.log('🔗 Full API URL:', url);
      
      // Validate sessionId
      if (!sessionId) {
        throw new Error('Session ID is required');
      }
      
      console.log('📞 Making API request to get feedback detail...');
      const response = await this.fetchWithTimeout(url);
      
      console.log('📨 getFeedbackDetail response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ getFeedbackDetail failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
          url
        });
        throw new Error(`Failed to fetch feedback detail: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📊 getFeedbackDetail raw response data:', data);
      
      if (!data.success) {
        console.error('❌ API returned success: false:', data);
        throw new Error(data.error || 'Failed to fetch feedback detail');
      }
      
      // Ensure the response has the correct structure
      const feedback = data.feedback;
      console.log('📋 Extracted feedback from response:', feedback);
      
      if (!feedback) {
        console.error('❌ No feedback data in response:', data);
        throw new Error('No feedback data returned from server');
      }
      
      // Mark as real data and add metadata
      feedback.hasRealData = true;
      feedback.rawAnalysis = feedback.rawAnalysis || data.rawAnalysis;
      feedback.source = 'API_BACKEND';
      feedback.fetchedAt = new Date().toISOString();
      feedback.apiSessionId = sessionId;
      
      console.log('✅ getFeedbackDetail successful:', {
        id: feedback.id,
        hasRealData: feedback.hasRealData,
        source: feedback.source,
        keysAvailable: Object.keys(feedback)
      });
      
      return feedback;
    } catch (error) {
      console.error('❌ getFeedbackDetail error:', {
        sessionId,
        error: error.message,
        stack: error.stack,
        url: `${this.baseURL}/api/feedback-sessions/${sessionId}`
      });
      throw this.handleApiError(error, 'fetching feedback detail');
    }
  }

  // ================== DASHBOARD STATISTICS ==================

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      console.log('📊 Fetching dashboard stats...');
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/dashboard/stats`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Dashboard stats fetch failed:', errorText);
        throw new Error(`Failed to fetch dashboard stats: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Dashboard stats response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch dashboard stats');
      }
      
      return data.stats;
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      throw this.handleApiError(error, 'fetching dashboard stats');
    }
  }

  // Get top performers
  async getTopPerformers() {
    try {
      console.log('🏆 Fetching top performers...');
      // Since this endpoint might not exist in backend, we'll derive it from users data
      const users = await this.getUsers();
      
      // Sort users by average rating and get top 5
      const topPerformers = users
        .filter(user => user.total_calls > 0) // Only users with calls
        .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
        .slice(0, 5)
        .map(user => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          rating: user.average_rating || 0,
          improvement: user.improvement_rate || '0%',
          calls_today: 0, // Would need today's data
          strongest_skill: user.best_skill || 'Communication',
          trend: (user.improvement_rate && parseFloat(user.improvement_rate.replace('%', '')) >= 0) ? 'up' : 'down'
        }));
      
      console.log('🏆 Top performers calculated:', topPerformers);
      return topPerformers;
    } catch (error) {
      console.error('❌ Error fetching top performers:', error);
      // Return mock data for development
      return [
        {
          id: '1',
          name: 'John Doe',
          avatar: 'JD',
          rating: 4.8,
          improvement: '+15%',
          calls_today: 3,
          strongest_skill: 'Communication',
          trend: 'up'
        },
        {
          id: '2',
          name: 'Jane Smith',
          avatar: 'JS',
          rating: 4.6,
          improvement: '+12%',
          calls_today: 2,
          strongest_skill: 'Active Listening',
          trend: 'up'
        }
      ];
    }
  }

  // Get users needing attention
  async getNeedsAttention() {
    try {
      console.log('⚠️ Fetching users needing attention...');
      // Derive from users data
      const users = await this.getUsers();
      
      // Find users with low ratings or negative improvement
      const needsAttention = users
        .filter(user => {
          const rating = user.average_rating || 0;
          const improvement = parseFloat((user.improvement_rate || '0%').replace('%', ''));
          return rating < 3.5 || improvement < -5;
        })
        .sort((a, b) => (a.average_rating || 0) - (b.average_rating || 0))
        .slice(0, 5)
        .map(user => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          rating: user.average_rating || 0,
          decline: user.improvement_rate || '0%',
          calls_today: 0, // Would need today's data
          weakest_skill: user.improvement_area || 'Call Control',
          trend: 'down',
          priority: (user.average_rating || 0) < 3.0 ? 'high' : 'medium'
        }));
      
      console.log('⚠️ Users needing attention calculated:', needsAttention);
      return needsAttention;
    } catch (error) {
      console.error('❌ Error fetching users needing attention:', error);
      // Return empty array as fallback
      return [];
    }
  }

  // Get recent activity
  async getRecentActivity(limit = 10) {
    try {
      console.log('📰 Fetching recent activity...');
      const sessions = await this.getFeedbackSessions(null, limit);
      
      const activity = sessions.map(session => ({
        id: session.id,
        user: session.user_name,
        action: 'completed analysis',
        timestamp: session.created_at,
        rating: session.overall_rating,
        details: `${session.file_name} - ${session.duration || '0:00'}`
      }));
      
      console.log('📰 Recent activity calculated:', activity);
      return activity;
    } catch (error) {
      console.error('❌ Error fetching recent activity:', error);
      return [];
    }
  }

  // Get performance trends
  async getPerformanceTrends(period = 'week') {
    try {
      console.log('📈 Fetching performance trends for period:', period);
      // This would typically come from a dedicated endpoint
      // For now, we'll return mock data that matches expected format
      const trends = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        trends.push({
          date: date.toISOString().split('T')[0],
          calls: Math.floor(Math.random() * 20) + 5,
          average_rating: (Math.random() * 2 + 3).toFixed(1),
          improvement: (Math.random() * 20 - 10).toFixed(1)
        });
      }
      
      console.log('📈 Performance trends calculated:', trends);
      return trends;
    } catch (error) {
      console.error('❌ Error fetching performance trends:', error);
      return [];
    }
  }

  // ================== UTILITY METHODS ==================

  // Get system status
  async getSystemStatus() {
    try {
      console.log('🔧 Checking system status...');
      const health = await this.healthCheck();
      const status = {
        online: true,
        status: health.status,
        database: health.database,
        version: health.version,
        timestamp: health.timestamp
      };
      console.log('✅ System status:', status);
      return status;
    } catch (error) {
      console.error('❌ System status check failed:', error);
      return {
        online: false,
        error: error.message
      };
    }
  }

  // Format response for frontend compatibility
  formatAnalysisForFrontend(backendResponse, audioFile, userId) {
    console.log('🔄 Formatting analysis for frontend:', {
      hasBackendResponse: !!backendResponse,
      audioFileName: audioFile?.name,
      userId
    });

    if (!backendResponse) {
      console.warn('⚠️ No backend response to format');
      return null;
    }

    // The backend already formats the response correctly for the most part
    // Just ensure all required fields are present and properly formatted
    const formatted = {
      id: backendResponse.id || `CALL_${Date.now()}`,
      user: backendResponse.user || 'Unknown User',
      userName: backendResponse.user || 'Unknown User',
      date: backendResponse.date || new Date().toISOString().split('T')[0],
      duration: backendResponse.duration || '0:00',
      rating: backendResponse.rating || 0,
      fileName: backendResponse.fileName || audioFile?.name || 'unknown.mp3',
      transcript: backendResponse.transcript || 'Transcript not available',
      sentiment: backendResponse.sentiment || 'Neutral',
      scores: backendResponse.scores || {},
      rawAnalysis: backendResponse.rawAnalysis || {},
      structuredInsights: backendResponse.rawAnalysis?.structured_insights || null,
      issues: this.extractIssuesFromAnalysis(backendResponse.rawAnalysis),
      strengths: this.extractStrengthsFromAnalysis(backendResponse.rawAnalysis),
      hasRealData: backendResponse.hasRealData !== false,
      warning: backendResponse.warning || null,
      source: 'API_FORMATTED',
      callDetails: {
        transcript: backendResponse.transcript || 'Transcript not available',
        categories: this.formatCategoriesForFrontend(backendResponse.scores || {})
      }
    };

    console.log('✅ Analysis formatted for frontend:', {
      id: formatted.id,
      hasRealData: formatted.hasRealData,
      source: formatted.source,
      keysCount: Object.keys(formatted).length
    });

    return formatted;
  }

  // Extract issues from raw analysis
  extractIssuesFromAnalysis(rawAnalysis) {
    if (!rawAnalysis) return [];
    
    const issues = [];
    
    // Grammar issues
    const grammarIssues = rawAnalysis.analysis?.grammar_issues || [];
    grammarIssues.forEach(issue => {
      if (typeof issue === 'object' && issue.message) {
        issues.push(issue.message);
      }
    });
    
    // Filler words
    const fillerWords = rawAnalysis.analysis?.filler_words || [];
    if (fillerWords.length > 5) {
      issues.push(`Excessive filler words detected (${fillerWords.length} instances)`);
    }
    
    // Speech rate issues
    const speechRate = rawAnalysis.analysis?.speech_rate;
    if (speechRate && speechRate.wpm) {
      if (speechRate.wpm < 120) {
        issues.push('Speaking pace is too slow');
      } else if (speechRate.wpm > 160) {
        issues.push('Speaking pace is too fast');
      }
    }
    
    console.log('📋 Extracted issues from analysis:', issues);
    return issues.slice(0, 5); // Limit to top 5 issues
  }

  // Extract strengths from raw analysis
  extractStrengthsFromAnalysis(rawAnalysis) {
    if (!rawAnalysis) return [];
    
    const strengths = [];
    
    // Check grammar
    const grammarIssues = rawAnalysis.analysis?.grammar_issues || [];
    if (grammarIssues.length <= 2) {
      strengths.push('Good grammatical accuracy');
    }
    
    // Check filler words
    const fillerWords = rawAnalysis.analysis?.filler_words || [];
    if (fillerWords.length <= 3) {
      strengths.push('Minimal use of filler words');
    }
    
    // Check speech rate
    const speechRate = rawAnalysis.analysis?.speech_rate;
    if (speechRate && speechRate.wpm >= 120 && speechRate.wpm <= 160) {
      strengths.push('Good speaking pace');
    }
    
    // Check fluency
    const fluency = rawAnalysis.analysis?.fluency_analysis;
    if (fluency && fluency.potential_stutters && fluency.potential_stutters.length <= 2) {
      strengths.push('Clear and fluent speech');
    }
    
    console.log('📋 Extracted strengths from analysis:', strengths);
    return strengths.slice(0, 5); // Limit to top 5 strengths
  }

  // Format categories for frontend display
  formatCategoriesForFrontend(scores) {
    const categories = [];
    const colors = ['text-blue-500', 'text-purple-500', 'text-green-500', 'text-orange-500', 'text-indigo-500'];
    const bgColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-indigo-500'];
    
    const categoryMappings = [
      { key: 'grammar', title: 'Grammar & Language', subtitle: 'Grammatical accuracy and language usage' },
      { key: 'fluency', title: 'Speech Fluency', subtitle: 'Flow and fluency of speech patterns' },
      { key: 'speech_rate', title: 'Speaking Rate', subtitle: 'Pace and timing of speech' },
      { key: 'filler_words', title: 'Filler Words', subtitle: 'Usage of filler words and pauses' },
      { key: 'overall', title: 'Overall Performance', subtitle: 'Combined speech analysis score' }
    ];
    
    categoryMappings.forEach((mapping, index) => {
      if (scores[mapping.key] !== undefined) {
        categories.push({
          id: mapping.key,
          title: mapping.title,
          subtitle: mapping.subtitle,
          score: Math.round(scores[mapping.key]),
          color: colors[index % colors.length],
          bgColor: bgColors[index % bgColors.length],
          details: `Analysis of ${mapping.title.toLowerCase()}`,
          improvements: `Continue working on ${mapping.title.toLowerCase()} skills`
        });
      }
    });
    
    console.log('📊 Formatted categories for frontend:', categories);
    return categories;
  }

  // Format user data for frontend
  formatUserForFrontend(backendUser) {
    return {
      id: backendUser.id,
      name: backendUser.name,
      email: backendUser.email,
      role: backendUser.role,
      status: backendUser.is_active ? 'Active' : 'Inactive',
      avatar: backendUser.avatar,
      joinDate: backendUser.join_date,
      totalCalls: backendUser.total_calls || 0,
      avgRating: backendUser.average_rating || 0,
      improvementRate: backendUser.improvement_rate || '0%',
      bestSkill: backendUser.best_skill,
      improvementArea: backendUser.improvement_area,
      currentStreak: backendUser.current_streak || 0,
      calls: backendUser.recent_calls || []
    };
  }

  // Enhanced error handling with user-friendly messages
  handleApiError(error, context = '') {
    console.error(`❌ API Error ${context}:`, error);
    
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      return new Error(`Unable to connect to the server. Please ensure the backend server is running on port 8000.\n\nTechnical details: ${error.message}`);
    }
    
    if (error.message.includes('timeout') || error.name === 'AbortError') {
      return new Error('Request timed out. Please try again.');
    }
    
    if (error.message.includes('404')) {
      return new Error(`Requested resource not found. The API endpoint may not exist.\n\nTechnical details: ${error.message}`);
    }
    
    if (error.message.includes('500')) {
      return new Error('Server error. Please try again later.');
    }
    
    return error;
  }

  // ================== CACHE MANAGEMENT ==================

  // Get data with caching
  async getCachedData(key, fetchFunction, forceRefresh = false) {
    if (!forceRefresh && this._cache.has(key)) {
      const cached = this._cache.get(key);
      if (Date.now() - cached.timestamp < this._cacheTimeout) {
        console.log('📦 Returning cached data for:', key);
        return cached.data;
      }
    }

    try {
      console.log('🔄 Fetching fresh data for:', key);
      const data = await fetchFunction();
      this._cache.set(key, {
        data,
        timestamp: Date.now()
      });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (this._cache.has(key)) {
        console.warn('⚠️ Using expired cache due to error:', error);
        return this._cache.get(key).data;
      }
      throw error;
    }
  }

  // Clear cache
  clearCache(key = null) {
    if (key) {
      console.log('🧹 Clearing cache for:', key);
      this._cache.delete(key);
    } else {
      console.log('🧹 Clearing all cache');
      this._cache.clear();
    }
  }

  // ================== DEVELOPMENT HELPERS ==================

  // Test connection to backend
  async testConnection() {
    try {
      console.log('🧪 Testing connection to backend...');
      const health = await this.healthCheck();
      console.log('✅ Backend connection successful:', health);
      return true;
    } catch (error) {
      console.error('❌ Backend connection failed:', error.message);
      return false;
    }
  }

  // Get API endpoints status
  async getEndpointsStatus() {
    const endpoints = [
      { name: 'Health Check', url: '/api/health' },
      { name: 'Users', url: '/api/users' },
      { name: 'Dashboard Stats', url: '/api/dashboard/stats' },
      { name: 'Feedback Sessions', url: '/api/feedback-sessions' }
    ];

    console.log('🧪 Testing all API endpoints...');

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        try {
          console.log(`🧪 Testing endpoint: ${endpoint.name}`);
          const response = await this.fetchWithTimeout(`${this.baseURL}${endpoint.url}`);
          return {
            ...endpoint,
            status: response.ok ? 'OK' : `Error ${response.status}`,
            working: response.ok
          };
        } catch (error) {
          return {
            ...endpoint,
            status: `Failed: ${error.message}`,
            working: false
          };
        }
      })
    );

    const endpointResults = results.map(result => 
      result.status === 'fulfilled' ? result.value : {
        name: 'Unknown',
        status: 'Error',
        working: false
      }
    );

    console.log('🧪 Endpoint test results:', endpointResults);
    return endpointResults;
  }
}

// Create singleton instance
const apiService = new ApiService();

// Development helper - test connection on load in development
if (process.env.NODE_ENV === 'development') {
  apiService.testConnection().then(success => {
    if (success) {
      console.log('🚀 VoiceAI API Service initialized successfully');
    } else {
      console.warn('⚠️ VoiceAI API Service could not connect to backend');
      console.log('💡 Make sure the Flask backend is running on port 8000');
      console.log('💡 Check the API base URL:', apiService.baseURL);
    }
  });
}

export default apiService;