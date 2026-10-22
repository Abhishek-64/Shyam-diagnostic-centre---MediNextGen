import axios from 'axios';

/**
 * Single, shared Axios instance.
 *
 * Base URL is read from VITE_API_BASE_URL at build time.
 * This value is public — never put backend secrets here.
 *
 * During local development, Vite's dev-server proxy forwards /api/*
 * to the backend, so the VITE_API_BASE_URL is used for production builds.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false, // Set true only when session/cookie auth is added
});

// ---------------------------------------------------------------------------
// Request interceptor
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    // Add auth header here when an auth strategy is selected, e.g.:
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — normalise errors
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      // Request was intentionally cancelled — surface as-is
      return Promise.reject(error);
    }

    let message = 'An unexpected error occurred. Please try again.';

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message = 'The request timed out. Please check your connection and try again.';
    } else if (!error.response) {
      // Network error — backend is unreachable
      message =
        'Unable to reach the server. Please check your internet connection or try again later.';
    } else {
      // HTTP error — use the server's safe message when available
      const serverMessage = error.response?.data?.message;
      if (serverMessage && typeof serverMessage === 'string') {
        message = serverMessage;
      } else {
        // Generic fallback by status code
        const status = error.response?.status;
        if (status === 400) message = 'Invalid request. Please review your input.';
        else if (status === 401) message = 'You are not authenticated. Please log in.';
        else if (status === 403) message = 'You do not have permission to do this.';
        else if (status === 404) message = 'The requested resource was not found.';
        else if (status === 422) message = 'Validation failed. Please check your input.';
        else if (status === 429) message = 'Too many requests. Please slow down.';
        else if (status >= 500) message = 'A server error occurred. Please try again later.';
      }
    }

    // Attach normalised message so callers can use error.message directly
    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default apiClient;
