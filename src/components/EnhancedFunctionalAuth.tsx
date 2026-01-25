import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import QuickAuthModal from './QuickAuthModal';
import { toast } from '@/hooks/use-toast';

interface EnhancedFunctionalAuthProps {
  children: (user: User | null, showAuth: () => void) => React.ReactNode;
}

const EnhancedFunctionalAuth: React.FC<EnhancedFunctionalAuthProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setShowAuth(false);
      
      // Handle OAuth success
      if (event === 'SIGNED_IN' && session?.user) {
        // Create or update user profile
        const { error } = await supabase
          .from('users')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
            phone: session.user.phone || session.user.user_metadata?.phone,
            avatar_url: session.user.user_metadata?.avatar_url,
            provider: session.user.app_metadata?.provider || 'email'
          }, {
            onConflict: 'id'
          });
        
        if (error) {
          console.error('Profile creation error:', error);
        }
        
        toast({ 
          title: 'Welcome to KaziLink!', 
          description: 'You have successfully signed in.' 
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = async (user: User) => {
    setUser(user);
    setShowAuth(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {children(user, () => setShowAuth(true))}
      <QuickAuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default EnhancedFunctionalAuth;