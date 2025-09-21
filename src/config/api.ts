// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};

// Environment
export const ENV = {
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  IS_DEVELOPMENT: import.meta.env.VITE_NODE_ENV === 'development',
  IS_PRODUCTION: import.meta.env.VITE_NODE_ENV === 'production',
};
