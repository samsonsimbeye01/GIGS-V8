import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, DollarSign, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface RealTimeGig {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  status: string;
  created_at: string;
  user_id: string;
  client_name?: string;
}

interface RealTimeGigUpdatesProps {
  onGigUpdate?: (gig: RealTimeGig) => void;
}

const RealTimeGigUpdates: React.FC<RealTimeGigUpdatesProps> = ({ onGigUpdate }) => {
  const [recentGigs, setRecentGigs] = useState<RealTimeGig[]>([]);
  const [liveStats, setLiveStats] = useState({
    totalActive: 0,
    newToday: 0,
    completedToday: 0
  });

  useEffect(() => {
    const fetchRecentGigs = async () => {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) {
        setRecentGigs(data);
        setLiveStats({
          totalActive: data.filter(g => g.status === 'open').length,
          newToday: data.filter(g => {
            const today = new Date().toDateString();
            return new Date(g.created_at).toDateString() === today;
          }).length,
          completedToday: data.filter(g => g.status === 'completed').length
        });
      }
    };

    fetchRecentGigs();

    const channel = supabase
      .channel('gigs-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'gigs' },
        (payload) => {
          console.log('Real-time gig update:', payload);
          if (payload.eventType === 'INSERT') {
            toast({ title: 'New gig posted!', description: payload.new.title });
            setRecentGigs(prev => [payload.new as RealTimeGig, ...prev.slice(0, 4)]);
          }
          if (onGigUpdate) {
            onGigUpdate(payload.new as RealTimeGig);
          }
          fetchRecentGigs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onGigUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Live Gig Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{liveStats.totalActive}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{liveStats.newToday}</p>
            <p className="text-sm text-muted-foreground">New Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{liveStats.completedToday}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {recentGigs.map((gig) => (
            <div key={gig.id} className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex-1">
                <p className="font-medium text-sm">{gig.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{gig.location}</span>
                  <DollarSign className="w-3 h-3" />
                  <span>TZS {gig.price?.toLocaleString()}</span>
                </div>
              </div>
              <Badge variant={gig.status === 'open' ? 'default' : 'secondary'}>
                {gig.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeGigUpdates;