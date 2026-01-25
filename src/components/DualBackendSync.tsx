import React, { useEffect, useState } from 'react';
import { FirebaseService } from '@/services/firebaseService';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface SyncStatus {
  firebase: 'connected' | 'disconnected' | 'syncing';
  supabase: 'connected' | 'disconnected' | 'syncing';
  lastSync: Date | null;
}

export const DualBackendSync: React.FC = () => {
  const [status, setStatus] = useState<SyncStatus>({
    firebase: 'disconnected',
    supabase: 'disconnected',
    lastSync: null
  });

  useEffect(() => {
    // Check Firebase connection
    const unsubFirebase = FirebaseService.subscribeToGigs((gigs) => {
      setStatus(prev => ({ ...prev, firebase: 'connected', lastSync: new Date() }));
    });

    // Check Supabase connection
    const channel = supabase
      .channel('gigs-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gigs' }, () => {
        setStatus(prev => ({ ...prev, supabase: 'connected', lastSync: new Date() }));
      })
      .subscribe();

    return () => {
      unsubFirebase();
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-card p-3 rounded-lg shadow-lg text-xs">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${status.firebase === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>Firebase</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <div className={`w-2 h-2 rounded-full ${status.supabase === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>Supabase</span>
      </div>
    </div>
  );
};
