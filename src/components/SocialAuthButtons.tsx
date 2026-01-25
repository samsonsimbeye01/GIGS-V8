import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Chrome, Facebook, Mail, Github } from 'lucide-react';
import { AuthUser } from '@/services/authService';

interface SocialAuthButtonsProps {
  onSuccess?: (user: AuthUser) => void;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'github') => {
    setLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
      
      // Success will be handled by the auth state change listener
      toast({ 
        title: 'Redirecting...', 
        description: `Signing in with ${provider}` 
      });
    } catch (error: unknown) {
      console.error(`${provider} auth error:`, error);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : `Failed to sign in with ${provider}`, 
        variant: 'destructive' 
      });
    } finally {
      setLoading(null);
    }
  };

  const handleEmailMagicLink = async () => {
    const email = prompt('Enter your email address:');
    if (!email) return;
    
    setLoading('email');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      
      toast({ 
        title: 'Magic Link Sent!', 
        description: `Check your email (${email}) for the login link` 
      });
    } catch (error: unknown) {
      console.error('Magic link error:', error);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to send magic link', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <Button 
        onClick={() => handleSocialAuth('google')} 
        variant="outline" 
        className="w-full flex items-center gap-2 hover:bg-red-50"
        disabled={loading !== null}
      >
        <Chrome className="h-4 w-4 text-red-500" />
        {loading === 'google' ? 'Connecting...' : 'Continue with Google'}
      </Button>
      
      <Button 
        onClick={() => handleSocialAuth('facebook')} 
        variant="outline" 
        className="w-full flex items-center gap-2 hover:bg-blue-50"
        disabled={loading !== null}
      >
        <Facebook className="h-4 w-4 text-blue-600" />
        {loading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
      </Button>
      
      <Button 
        onClick={() => handleSocialAuth('github')} 
        variant="outline" 
        className="w-full flex items-center gap-2 hover:bg-gray-50"
        disabled={loading !== null}
      >
        <Github className="h-4 w-4 text-gray-700" />
        {loading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
      </Button>
      
      <Button 
        onClick={handleEmailMagicLink} 
        variant="outline" 
        className="w-full flex items-center gap-2 hover:bg-purple-50"
        disabled={loading !== null}
      >
        <Mail className="h-4 w-4 text-purple-600" />
        {loading === 'email' ? 'Sending...' : 'Email Magic Link'}
      </Button>
    </div>
  );
};

export default SocialAuthButtons;
