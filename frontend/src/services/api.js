import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Domains API
export const domainsAPI = {
  getAll: () => api.get('/domains'),
  getById: (id) => api.get(`/domains/${id}`),
  create: (data) => api.post('/domains', data),
  update: (id, data) => api.put(`/domains/${id}`, data),
  delete: (id) => api.delete(`/domains/${id}`),
  verify: (id) => api.post(`/domains/${id}/verify`),
};

// Tests API
export const testsAPI = {
  runSPF: (data) => api.post('/tests/spf', data),
  runDKIM: (data) => api.post('/tests/dkim', data),
  runDMARC: (data) => api.post('/tests/dmarc', data),
  runSMTP: (data) => api.post('/tests/smtp', data),
  runBlacklist: (data) => api.post('/tests/blacklist', data),
  getResults: (params) => api.get('/tests/results', { params }),
  getById: (id) => api.get(`/tests/results/${id}`),
};

export default api;
