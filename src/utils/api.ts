// src/utils/api.ts

import axios from 'axios';

const API_URL = 'https://your-api-url.com';
const TOKEN = 'YOUR_AUTH_TOKEN'; // Add your auth token here

// Create an axios instance with authentication headers
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
    },
});

// Function to handle API calls
export const fetchData = async (endpoint) => {
    try {
        const response = await apiClient.get(endpoint);
        return response.data; // Assuming the response data is in the required format
    } catch (error) {
        console.error('API call failed:', error);
        // Error handling
        throw error;
    }
};

// Function for POST requests
export const postData = async (endpoint, data) => {
    try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Failed to post data:', error);
        throw error;
    }
};

// Add more helper functions as needed
