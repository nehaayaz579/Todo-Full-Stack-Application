// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Create base API instance
let api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Try multiple ways to get the token in case Better Auth stores it differently
    let token = localStorage.getItem('authToken');
    
    // If not found in our custom storage, try to get from Better Auth cookies
    if (!token) {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name.startsWith('better-auth.') && name.includes('jwt')) {
          token = value;
          break;
        }
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If token has expired and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          });

          if (response.data.access_token) {
            localStorage.setItem('authToken', response.data.access_token);
            
            // Update the header for the original request
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
            
            // Retry the original request
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const taskApi = {
  // Get all tasks with optional filtering, searching, and sorting
  getAllTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.completed !== undefined && filters.completed !== null) params.append('completed', filters.completed);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.due_status) params.append('due_status', filters.due_status); // New filter for due status
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.order) params.append('order', filters.order);

      const queryString = params.toString();
      const url = queryString ? `/tasks?${queryString}` : '/tasks';

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Create a new task with scheduling information
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get a specific task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Update a task with scheduling information
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Toggle task completion status
  toggleTaskCompletion: async (id) => {
    try {
      const response = await api.patch(`/tasks/${id}/toggle-complete`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export const scheduledReminderApi = {
  // Get all scheduled reminders
  getAllScheduledReminders: async () => {
    try {
      const response = await api.get('/scheduled-reminders');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Get a specific scheduled reminder by ID
  getScheduledReminderById: async (id) => {
    try {
      const response = await api.get(`/scheduled-reminders/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Cancel/delete a scheduled reminder
  cancelScheduledReminder: async (id) => {
    try {
      const response = await api.delete(`/scheduled-reminders/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export const tagApi = {
  // Get all tags
  getAllTags: async () => {
    try {
      const response = await api.get('/tags');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Create a new tag
  createTag: async (tagData) => {
    try {
      const response = await api.post('/tags', tagData);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // Delete a tag
  deleteTag: async (id) => {
    try {
      const response = await api.delete(`/tags/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// Helper function to handle errors
function handleError(error) {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      success: false,
      status,
      message: data.detail || 'An error occurred',
      ...(data.details && { details: data.details })
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: 'Network error: Unable to reach the server'
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'An unexpected error occurred'
    };
  }
}

export default api;