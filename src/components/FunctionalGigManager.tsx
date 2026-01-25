import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  status: 'open' | 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  created_at: string;
  user_id: string;
  client_name?: string;
}

interface FunctionalGigManagerProps {
  user: User | null;
  children: (props: {
    gigs: Gig[];
    loading: boolean;
    createGig: (gig: Partial<Gig>) => Promise<void>;
    applyToGig: (gigId: string) => Promise<void>;
    updateGigStatus: (gigId: string, status: Gig['status']) => Promise<void>;
    refreshGigs: () => Promise<void>;
  }) => React.ReactNode;
}

const FunctionalGigManager: React.FC<FunctionalGigManagerProps> = ({ user, children }) => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGigs = async () => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setGigs(data || []);
    } catch (error: any) {
      toast({ title: 'Error fetching gigs', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const createGig = async (gigData: Partial<Gig>) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('gigs')
        .insert([{
          ...gigData,
          user_id: user.id,
          status: 'open'
        }]);
      
      if (error) throw error;
      toast({ title: 'Gig created successfully' });
      await fetchGigs();
    } catch (error: any) {
      toast({ title: 'Error creating gig', description: error.message, variant: 'destructive' });
    }
  };

  const applyToGig = async (gigId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('gigs')
        .update({ status: 'pending' })
        .eq('id', gigId);
      
      if (error) throw error;
      toast({ title: 'Applied to gig successfully' });
      await fetchGigs();
    } catch (error: any) {
      toast({ title: 'Error applying to gig', description: error.message, variant: 'destructive' });
    }
  };

  const updateGigStatus = async (gigId: string, status: Gig['status']) => {
    try {
      const { error } = await supabase
        .from('gigs')
        .update({ status })
        .eq('id', gigId);
      
      if (error) throw error;
      toast({ title: 'Gig status updated' });
      await fetchGigs();
    } catch (error: any) {
      toast({ title: 'Error updating gig', description: error.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  return (
    <>
      {children({
        gigs,
        loading,
        createGig,
        applyToGig,
        updateGigStatus,
        refreshGigs: fetchGigs
      })}
    </>
  );
};

export default FunctionalGigManager;