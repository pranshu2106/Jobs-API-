import axios from 'axios';
import { getToken, removeToken, isTokenValid } from './authHelpers';
import toast from 'react-hot-toast';

// API Base URL - must be set via environment variable for production
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Warn in development if env var is not explicitly set
if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.DEV) {
    console.warn('⚠️ VITE_API_BASE_URL not set. Using fallback: http://localhost:5000/api/v1');
}

const axiosClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach JWT token
axiosClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token && isTokenValid()) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response) {
            const { status, data } = response;

            // Handle authentication errors
            if (status === 401 || status === 403) {
                removeToken();
                // Only redirect if we're not already on auth pages
                if (!window.location.pathname.includes('/login') &&
                    !window.location.pathname.includes('/register')) {
                    toast.error('Session expired. Please login again.');
                    window.location.href = '/login';
                }
            }

            // Handle validation errors
            if (status === 400) {
                const message = data?.msg || 'Invalid request';
                // Don't show toast here, let the component handle it
                return Promise.reject(error);
            }

            // Handle not found
            if (status === 404) {
                const message = data?.msg || 'Resource not found';
                return Promise.reject(error);
            }

            // Handle server errors
            if (status >= 500) {
                toast.error('Server error. Please try again later.');
            }
        } else {
            // Network error
            toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
