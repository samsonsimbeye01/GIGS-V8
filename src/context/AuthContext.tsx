import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the shape of user data
interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provide the context to children
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Method to login user
    const login = async (email: string, password: string) => {
        // Implement your login logic here (API call)
        // For demonstration, we will mock a user
        const mockUser = { id: '1', name: 'John Doe', email };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
    };

    // Method to register new user
    const register = async (name: string, email: string, password: string) => {
        // Implement your registration logic here (API call)
        const mockUser = { id: '2', name, email };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
    };

    // Method to logout user
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Method to update user
    const updateUser = (userData: Partial<User>) => {
        setUser(prev => (prev ? { ...prev, ...userData } : null));
        if (user) {
            localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
        }
    };

    // Load user from localStorage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
