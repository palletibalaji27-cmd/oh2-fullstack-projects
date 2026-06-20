const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Task services
export const getTasks = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (taskId, updateData) => {
  const response = await api.put(`/tasks/${taskId}`, updateData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const getTaskStats = async () => {
  const response = await api.get('/tasks/stats');
  return response.data;
};

export default api;
