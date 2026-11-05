import axios from 'axios';
import { handleMockRequest } from './mockApi.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// ─── Real axios instance ─────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every real request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// 401 → clear token and redirect to /login
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Avoid redirect loop on the login page itself
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Mock adapter ────────────────────────────────────────────────────────────
// Wraps handleMockRequest so it looks exactly like an axios response.
// It injects the Authorization header from localStorage automatically.

function buildMockAdapter() {
  const call = async (method, url, dataOrParams, extraConfig = {}) => {
    const token = localStorage.getItem('token');
    const config = {
      method,
      url,
      headers: { Authorization: token ? `Bearer ${token}` : '' },
      ...extraConfig,
    };

    // axios.get/delete use params; axios.post/put use data
    if (method === 'get' || method === 'delete') {
      config.params = dataOrParams || {};
    } else {
      config.data = dataOrParams || {};
    }

    try {
      const response = await handleMockRequest(config);
      // Mirror a 401 redirect in mock mode too
      return response;
    } catch (err) {
      if (err?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
      throw err;
    }
  };

  return {
    get:    (url, config = {})       => call('get',    url, config.params, config),
    post:   (url, data, config = {}) => call('post',   url, data,          config),
    put:    (url, data, config = {}) => call('put',    url, data,          config),
    delete: (url, config = {})       => call('delete', url, config.params, config),
  };
}

// ─── Export ──────────────────────────────────────────────────────────────────

const api = USE_MOCK ? buildMockAdapter() : axiosInstance;

export default api;
