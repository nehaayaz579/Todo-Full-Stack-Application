// Service for handling authentication API calls

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

/**
 * Register a new user
 */
export const registerUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login user and get tokens
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Token refresh failed');
    }

    return data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

/**
 * Make authenticated API request
 */
export const authenticatedRequest = async (
  endpoint,
  method = 'GET',
  body,
  token
) => {
  try {
    // Get token from parameter or localStorage
    const authToken = token || localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token available');
    }

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, config);

    // If we get a 401, try to refresh the token and retry the request
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResult = await refreshAccessToken(refreshToken);
          
          // Update the token in localStorage
          localStorage.setItem('authToken', refreshResult.access_token);
          
          // Retry the original request with the new token
          const retryConfig = {
            method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshResult.access_token}`,
            },
          };
          
          if (body) {
            retryConfig.body = JSON.stringify(body);
          }
          
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, retryConfig);
          
          if (!retryResponse.ok) {
            throw new Error(`Request failed after token refresh: ${retryResponse.statusText}`);
          }
          
          return await retryResponse.json();
        } catch (refreshError) {
          // If refresh fails, remove tokens and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Or use router.push('/login')
          throw new Error('Session expired. Please log in again.');
        }
      } else {
        // No refresh token available, redirect to login
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
    }

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Authenticated request error:', error);
    throw error;
  }
};