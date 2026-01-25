import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface LiveStats {
  activeGigs: number;
  onlineUsers: number;
  completedToday: number;
  aiProtected: number;
}

interface RealTimeUpdatesProps {
  onGigUpdate: () => void;
  onStatsUpdate: (stats: LiveStats) => void;
}

const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = ({ onGigUpdate, onStatsUpdate }) => {
  useEffect(() => {
    // Subscribe to gig changes
    const gigsSubscription = supabase
      .channel('gigs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gigs' }, (payload) => {
        console.log('Gig change received:', payload);
        onGigUpdate();
        
        if (payload.eventType === 'INSERT') {
          toast({ title: 'New gig posted!', description: 'Check out the latest opportunities' });
        }
      })
      .subscribe();

    // Simulate real-time stats updates
    const statsInterval = setInterval(() => {
      const mockStats: LiveStats = {
        activeGigs: 130 + Math.floor(Math.random() * 10),
        onlineUsers: 1467 + Math.floor(Math.random() * 100),
        completedToday: 109 + Math.floor(Math.random() * 20),
        aiProtected: 99.8
      };
      onStatsUpdate(mockStats);
    }, 30000); // Update every 30 seconds

    return () => {
      gigsSubscription.unsubscribe();
      clearInterval(statsInterval);
    };
  }, [onGigUpdate, onStatsUpdate]);

  return null;
};

export default RealTimeUpdates;
