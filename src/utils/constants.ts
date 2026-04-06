// Application Constants

// API Endpoints
const API_ENDPOINTS = {
    USER_LOGIN: '/api/v1/login',
    USER_REGISTER: '/api/v1/register',
    GET_USER_PROFILE: '/api/v1/user/profile',
    UPDATE_USER_PROFILE: '/api/v1/user/update',
    DELETE_USER: '/api/v1/user/delete',
};

// Error Messages
const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid username or password.',
    USER_NOT_FOUND: 'User does not exist.',
    SERVER_ERROR: 'Internal server error, please try again later.',
    VALIDATION_ERROR: 'Input validation failed.',
};

// Validation Rules
const VALIDATION_RULES = {
    USERNAME: { min: 3, max: 20, required: true },
    PASSWORD: { min: 6, required: true },
    EMAIL: { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, required: true },
};

// Configuration Values
const CONFIG = {
    APP_NAME: 'GIGS V8',
    APP_VERSION: '1.0.0',
    API_BASE_URL: 'https://api.gigs.com',
};

export { API_ENDPOINTS, ERROR_MESSAGES, VALIDATION_RULES, CONFIG };