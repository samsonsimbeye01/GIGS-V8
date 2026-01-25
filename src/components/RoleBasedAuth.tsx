import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, User as UserIcon, Briefcase, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  role: 'worker' | 'employer' | 'admin';
  full_name: string;
  phone: string;
  location: string;
  skills: string[];
  verified: boolean;
  created_at: string;
}

interface RoleBasedAuthProps {
  user: User;
  children: (profile: UserProfile | null, hasAccess: (requiredRole: string) => boolean) => React.ReactNode;
}

const RoleBasedAuth: React.FC<RoleBasedAuthProps> = ({ user, children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'worker' | 'employer' | 'admin'>('worker');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        setShowRoleSelection(true);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to load profile';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          role: selectedRole,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          phone: '',
          location: '',
          skills: [],
          verified: false
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      setShowRoleSelection(false);
      toast({ title: 'Profile Created', description: `Welcome as ${selectedRole}!` });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to create profile';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = (requiredRole: string) => {
    if (!profile) return false;
    
    const roleHierarchy = { admin: 3, employer: 2, worker: 1 };
    const userLevel = roleHierarchy[profile.role];
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy];
    
    return userLevel >= requiredLevel;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (showRoleSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Choose Your Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedRole === 'worker' ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => setSelectedRole('worker')}
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">Worker</h3>
                    <p className="text-sm text-muted-foreground">Find and apply for gigs</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedRole === 'employer' ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => setSelectedRole('employer')}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">Employer</h3>
                    <p className="text-sm text-muted-foreground">Post gigs and hire workers</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedRole === 'admin' ? 'border-primary bg-primary/10' : 'border-border'
                }`}
                onClick={() => setSelectedRole('admin')}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium">Admin</h3>
                    <p className="text-sm text-muted-foreground">Manage platform and users</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button onClick={createProfile} className="w-full" disabled={loading}>
              Continue as {selectedRole}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children(profile, hasAccess)}</>;
};

export default RoleBasedAuth;
