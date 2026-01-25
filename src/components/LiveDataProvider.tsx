import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, AuthUser } from '@/services/authService';
import { gigService, Gig } from '@/services/gigService';
import { locationService, LocationData } from '@/services/locationService';
import { supabase } from '@/lib/supabase';

interface LiveDataContextType {
  user: AuthUser | null;
  gigs: Gig[];
  location: LocationData | null;
  loading: boolean;
  onlineUsers: number;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  createGig: (gigData: Partial<Gig>) => Promise<{ error: any }>;
  applyToGig: (gigId: string, message: string, budget: number) => Promise<{ error: any }>;
  refreshGigs: () => Promise<void>;
}

const LiveDataContext = createContext<LiveDataContextType | null>(null);

export const useLiveData = () => {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error('useLiveData must be used within LiveDataProvider');
  }
  return context;
};

interface LiveDataProviderProps {
  children: ReactNode;
}

export const LiveDataProvider: React.FC<LiveDataProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const presenceRef = React.useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    initializeData();
    setupRealtimeSubscriptions();
  }, []);

  const initializeData = async () => {
    try {
      // Get current user
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      // Detect location
      const locationData = await locationService.detectLocation();
      setLocation(locationData);

      // Load gigs for user's country
      await refreshGigs(locationData.countryCode);
      setupPresence(currentUser?.id || `guest_${Math.random().toString(36).slice(2)}`);
    } catch (error) {
      console.error('Failed to initialize data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to gig changes
    const gigsSubscription = supabase
      .channel('gigs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gigs' }, () => {
        refreshGigs();
      })
      .subscribe();

    return () => {
      gigsSubscription.unsubscribe();
    };
  };

  const setupPresence = (key: string) => {
    try {
      if (presenceRef.current) {
        supabase.removeChannel(presenceRef.current);
        presenceRef.current = null;
      }
      const channel = supabase.channel('presence_global', { config: { presence: { key } } });
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState() as Record<string, any[]>;
        const count = Object.values(state).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
        setOnlineUsers(count);
      });
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.track({ online_at: new Date().toISOString() });
        }
      });
      presenceRef.current = channel;
    } catch {}
  };

  const refreshGigs = async (countryCode?: string) => {
    const country = countryCode || location?.country;
    const { gigs: freshGigs } = await gigService.getGigs({ country });
    setGigs(freshGigs);
  };

  const signIn = async (email: string, password: string) => {
    const { user: authUser, error } = await authService.signIn(email, password);
    if (authUser) {
      setUser(authUser);
    }
    return { error };
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const locationData = location || await locationService.detectLocation();
    const { user: authUser, error } = await authService.signUp(email, password, {
      ...userData,
      country: locationData.country
    });
    if (authUser) {
      setUser(authUser);
    }
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const createGig = async (gigData: Partial<Gig>) => {
    if (!user || !location) {
      return { error: 'User not authenticated or location not detected' };
    }

    const { error } = await gigService.createGig({
      ...gigData,
      client_id: user.id,
      country: location.country,
      currency: location.currency
    });

    if (!error) {
      await refreshGigs();
    }

    return { error };
  };

  const applyToGig = async (gigId: string, message: string, budget: number) => {
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const { error } = await gigService.applyToGig(gigId, user.id, message, budget);
    return { error };
  };

  const value: LiveDataContextType = {
    user,
    gigs,
    location,
    loading,
    onlineUsers,
    signIn,
    signUp,
    signOut,
    createGig,
    applyToGig,
    refreshGigs
  };

  return (
    <LiveDataContext.Provider value={value}>
      {children}
    </LiveDataContext.Provider>
  );
};
