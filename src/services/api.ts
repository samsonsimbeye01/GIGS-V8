// src/services/api.ts

const BASE_URL = 'https://api.example.com'; // Replace with actual API base URL

// API Client Service using Fetch

const apiClient = async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
};

// Gigs API
export const fetchGigs = () => apiClient('/gigs');

// Auctions API
export const fetchAuctions = () => apiClient('/auctions');

// Wallet API
export const fetchWallet = () => apiClient('/wallet');

// User API
export const fetchUser = (userId) => apiClient(`/user/${userId}`);