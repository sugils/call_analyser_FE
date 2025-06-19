// httpUtils.js - Utility functions for HTTP requests

/**
 * HTTP request wrapper with error handling and timeout
 */
export class HttpClient {
  constructor(baseURL = '', timeout = 300000) { // 5 minutes default timeout
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Create an AbortController with timeout
   */
  createTimeoutController(timeoutMs = this.timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    // Return controller and cleanup function
    return {
      controller,
      cleanup: () => clearTimeout(timeoutId)
    };
  }

  /**
   * Make a GET request
   */
  async get(url, options = {}) {
    const { controller, cleanup } = this.createTimeoutController(options.timeout);
    
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        signal: controller.signal,
        ...options
      });

      cleanup();
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      cleanup();
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Make a POST request with JSON data
   */
  async post(url, data = {}, options = {}) {
    const { controller, cleanup } = this.createTimeoutController(options.timeout);
    
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options
      });

      cleanup();
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      cleanup();
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Upload a file using FormData
   */
  async uploadFile(url, file, options = {}) {
    const { controller, cleanup } = this.createTimeoutController(options.timeout || 300000); // 5 minutes for file upload
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add any additional form fields
      if (options.additionalFields) {
        Object.entries(options.additionalFields).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Don't set Content-Type header - let browser set it with boundary
        headers: options.headers || {}
      });

      cleanup();
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      cleanup();
      if (error.name === 'AbortError') {
        throw new Error('Upload timeout - file may be too large or connection is slow');
      }
      throw error;
    }
  }
}

/**
 * Retry logic for failed requests
 */
export async function retryRequest(requestFn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.message.includes('400') || 
          error.message.includes('401') || 
          error.message.includes('403') ||
          error.message.includes('413') || // Payload too large
          error.message.includes('Unsupported') ||
          error.message.includes('Invalid')) {
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.log(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
    }
  }
  
  throw lastError;
}

/**
 * Check if a URL is reachable
 */
export async function checkEndpointHealth(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      // Don't follow redirects for health checks
      redirect: 'manual'
    });
    
    clearTimeout(timeoutId);
    
    // Consider 2xx and 3xx as healthy
    return response.status >= 200 && response.status < 400;
  } catch (error) {
    clearTimeout(timeoutId);
    return false;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate file before upload
 */
export function validateAudioFile(file, options = {}) {
  const {
    maxSize = 100 * 1024 * 1024, // 100MB default
    allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg', 'audio/aac', 'audio/flac'],
    allowedExtensions = ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac']
  } = options;

  // Check file size
  if (file.size > maxSize) {
    throw new Error(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`);
  }

  // Check file type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const isValidType = allowedTypes.includes(file.type);
  const isValidExtension = allowedExtensions.includes(fileExtension);

  if (!isValidType && !isValidExtension) {
    throw new Error(`Unsupported file format. Allowed formats: ${allowedExtensions.join(', ').toUpperCase()}`);
  }

  // Check if file is empty
  if (file.size === 0) {
    throw new Error('File is empty');
  }

  return true;
}

/**
 * Create a progress tracking function
 */
export function createProgressTracker(onProgress) {
  return {
    updateProgress: (stage, progress, message = '') => {
      if (typeof onProgress === 'function') {
        onProgress({
          stage,
          progress: Math.min(100, Math.max(0, progress)),
          message,
          timestamp: new Date().toISOString()
        });
      }
    }
  };
}

/**
 * Default error messages for common HTTP status codes
 */
export const HTTP_ERROR_MESSAGES = {
  400: 'Bad Request - Invalid data provided',
  401: 'Unauthorized - Authentication required',
  403: 'Forbidden - Access denied',
  404: 'Not Found - Service endpoint not available',
  408: 'Request Timeout - Server took too long to respond',
  413: 'Payload Too Large - File size exceeds server limits',
  429: 'Too Many Requests - Please wait before trying again',
  500: 'Internal Server Error - Server encountered an error',
  502: 'Bad Gateway - Server is temporarily unavailable',
  503: 'Service Unavailable - Server is temporarily down',
  504: 'Gateway Timeout - Server response timeout'
};

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  const message = error.message || 'An unknown error occurred';
  
  // Check for network errors
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  // Check for timeout errors
  if (message.includes('timeout') || message.includes('AbortError')) {
    return 'Request timed out. The server may be busy or the file may be too large.';
  }
  
  // Check for HTTP status codes
  const statusMatch = message.match(/HTTP (\d+)/);
  if (statusMatch) {
    const status = parseInt(statusMatch[1]);
    return HTTP_ERROR_MESSAGES[status] || message;
  }
  
  return message;
}