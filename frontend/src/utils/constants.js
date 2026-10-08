// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  USERS: '/users',
  ADMIN: '/admin',
  NOT_FOUND: '/404'
};

// Authentication
export const AUTH_STORAGE_KEY = 'auth_token';

// Pagination
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  totalPages: 0,
  totalItems: 0
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: AUTH_STORAGE_KEY,
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Theme Configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users',
    DELETE: '/users'
  }
};

// Form Validation
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50
};

// Application Configuration
export const APP_CONFIG = {
  NAME: 'Application',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr'],
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  API_TIMEOUT: 10000 // 10 seconds
};