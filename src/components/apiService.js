// apiService.js - Service for communicating with the Flask backend

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.timeout = 3000000; // 5 minutes timeout for audio processing
  }

  // Helper method to handle fetch with timeout
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - audio processing took too long');
      }
      throw error;
    }
  }

  // Health check endpoint
  async healthCheck() {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error(`Backend service unavailable: ${error.message}`);
    }
  }

  // Main speech analysis endpoint
  async analyzeSpeech(audioFile, onProgress = null) {
    try {
      // Validate file
      if (!audioFile) {
        throw new Error('No audio file provided');
      }

      // Check file size (100MB limit as per backend)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (audioFile.size > maxSize) {
        throw new Error('File size exceeds 100MB limit');
      }

      // Check file type
      const supportedTypes = [
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 
        'audio/ogg', 'audio/aac', 'audio/flac'
      ];
      
      const fileExtension = audioFile.name.split('.').pop().toLowerCase();
      const supportedExtensions = ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac'];
      
      if (!supportedExtensions.includes(fileExtension) && 
          !supportedTypes.includes(audioFile.type)) {
        throw new Error(`Unsupported file format. Supported formats: ${supportedExtensions.join(', ')}`);
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', audioFile);

      // Report progress
      if (onProgress) {
        onProgress({ stage: 'uploading', progress: 0 });
      }

      // Make request
      const response = await this.fetchWithTimeout(`${this.baseURL}/analyze-speech`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
      });

      if (onProgress) {
        onProgress({ stage: 'processing', progress: 50 });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();

      if (onProgress) {
        onProgress({ stage: 'complete', progress: 100 });
      }

      // Validate response structure
      if (!result.transcript) {
        throw new Error('Invalid response: missing transcript');
      }

      return result;

    } catch (error) {
      console.error('Speech analysis failed:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to speech analysis service. Please check if the backend server is running.');
      } else if (error.message.includes('timeout')) {
        throw new Error('Audio processing is taking too long. Please try with a shorter audio file.');
      } else {
        throw error;
      }
    }
  }

  // Convert backend response to frontend format
  formatAnalysisForFrontend(backendResponse, audioFile) {
    const {
      transcript,
      scores,
      analysis,
      detailed_analysis,
      structured_insights,
      system_status,
      warning
    } = backendResponse;

    // Calculate duration from audio file or use backend data
    const duration = analysis?.speech_rate?.duration_seconds || 
                    this.estimateDuration(transcript) || 
                    180; // fallback

    // Format duration as MM:SS
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Extract issues and strengths from structured insights
    const issues = [];
    const strengths = [];

    // Parse structured insights for issues and strengths
    if (structured_insights?.structured_format) {
      const content = structured_insights.structured_format;
      
      // Extract issues from ⚠️ sections
      const issueMatches = content.match(/⚠️[^💡]*/g) || [];
      issueMatches.forEach(section => {
        const lines = section.split('\n').filter(line => line.trim().startsWith('*'));
        lines.forEach(line => {
          const issue = line.replace(/^\*\s*/, '').trim();
          if (issue && !issue.includes('Example:')) {
            issues.push(issue);
          }
        });
      });

      // Extract strengths from ✅ sections
      const strengthMatches = content.match(/✅[^⚠️]*/g) || [];
      strengthMatches.forEach(section => {
        const lines = section.split('\n').filter(line => line.trim().startsWith('*'));
        lines.forEach(line => {
          const strength = line.replace(/^\*\s*/, '').trim();
          if (strength) {
            strengths.push(strength);
          }
        });
      });
    }

    // Fallback issues and strengths if parsing fails
    if (issues.length === 0) {
      if (analysis?.filler_words?.length > 5) {
        issues.push('Frequent use of filler words detected');
      }
      if (analysis?.speech_rate?.wpm < 120) {
        issues.push('Speaking pace could be faster');
      }
      if (analysis?.speech_rate?.wpm > 160) {
        issues.push('Speaking pace could be slower');
      }
      if (analysis?.grammar_issues?.length > 3) {
        issues.push('Multiple grammar issues detected');
      }
    }

    if (strengths.length === 0) {
      if (analysis?.speech_rate?.wpm >= 120 && analysis?.speech_rate?.wpm <= 160) {
        strengths.push('Good speaking pace maintained');
      }
      if (analysis?.filler_words?.length <= 3) {
        strengths.push('Minimal use of filler words');
      }
      if (analysis?.grammar_issues?.length <= 2) {
        strengths.push('Good grammatical accuracy');
      }
      strengths.push('Clear articulation and professional tone');
    }

    // Determine sentiment based on overall score
    let sentiment = 'Neutral';
    const overallScore = scores?.overall || 50;
    if (overallScore >= 80) sentiment = 'Very Positive';
    else if (overallScore >= 65) sentiment = 'Positive';
    else if (overallScore >= 50) sentiment = 'Neutral';
    else sentiment = 'Negative';

    return {
      id: `CALL_${Date.now()}`,
      user: 'Current User',
      date: new Date().toISOString().split('T')[0],
      duration: formatDuration(duration),
      rating: Math.round((overallScore / 20) * 10) / 10, // Convert 0-100 to 0-5 rating
      fileName: audioFile.name,
      transcript: transcript,
      issues: issues.slice(0, 5), // Limit to 5 most important issues
      strengths: strengths.slice(0, 5), // Limit to 5 key strengths
      sentiment: sentiment,
      // Additional data for detailed analysis
      rawAnalysis: backendResponse,
      scores: scores,
      systemStatus: system_status,
      warning: warning
    };
  }

  // Estimate duration from transcript (fallback method)
  estimateDuration(transcript) {
    if (!transcript) return null;
    const wordCount = transcript.split(' ').length;
    const averageWPM = 150; // Average speaking rate
    return Math.round((wordCount / averageWPM) * 60);
  }

  // Get system status
  async getSystemStatus() {
    try {
      const health = await this.healthCheck();
      return {
        online: true,
        components: health.components,
        version: health.version
      };
    } catch (error) {
      return {
        online: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;