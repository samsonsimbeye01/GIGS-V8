import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  trustScore: number;
  completionRate: number;
  totalEarnings: number;
  activeGigs: number;
}

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  user: User | null;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  notifications: number;
}

const defaultUser: User = {
  id: '1',
  name: 'John Mwangi',
  email: 'john@example.com',
  location: 'Dar es Salaam, Tanzania',
  trustScore: 85,
  completionRate: 95,
  totalEarnings: 450000,
  activeGigs: 12
};

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  user: null,
  currentLanguage: 'en',
  setLanguage: () => {},
  notifications: 0
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(defaultUser);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [notifications, setNotifications] = useState(3);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    toast({
      title: 'Language Changed',
      description: `Language switched to ${lang === 'en' ? 'English' : lang === 'sw' ? 'Swahili' : 'French'}`
    });
  };

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setNotifications(prev => prev + 1);
        toast({
          title: 'New Gig Available!',
          description: 'A new gig matching your skills is available nearby.'
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        user,
        currentLanguage,
        setLanguage,
        notifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};