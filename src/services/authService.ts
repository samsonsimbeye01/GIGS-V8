import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
  country?: string;
  role?: 'worker' | 'client' | 'admin';
  accepted_legal_version?: string;
  accepted_legal_at?: string;
}

export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  country?: string;
  role?: 'worker' | 'client' | 'admin';
  accepted_legal_version?: string;
  accepted_legal_at?: string;
}

class AuthService {
  async signUp(email: string, password: string, userData?: UserMetadata): Promise<{ user: AuthUser | null; error: unknown }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) return { user: null, error };
      
      // Create user profile
      if (data.user) {
        await this.createUserProfile(data.user, userData);
      }

      return { user: this.transformUser(data.user), error: null };
    } catch (error: unknown) {
      return { user: null, error };
    }
  }

  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: unknown }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return { user: null, error };
      return { user: this.transformUser(data.user), error: null };
    } catch (error: unknown) {
      return { user: null, error };
    }
  }

  async signOut(): Promise<{ error: unknown }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return this.transformUser(user);
  }

  private async createUserProfile(user: User, userData?: UserMetadata) {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: userData?.full_name || '',
        country: userData?.country || '',
        role: userData?.role || 'worker',
        created_at: new Date().toISOString()
      });
    
    if (error) console.error('Profile creation error:', error);
  }

  private transformUser(user: User | null): AuthUser | null {
    if (!user) return null;
    
    const meta = user.user_metadata as UserMetadata;
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      full_name: meta?.full_name || '',
      avatar_url: meta?.avatar_url,
      country: meta?.country,
      role: meta?.role || 'worker',
      accepted_legal_version: meta?.accepted_legal_version,
      accepted_legal_at: meta?.accepted_legal_at
    };
  }
}

export const authService = new AuthService();
