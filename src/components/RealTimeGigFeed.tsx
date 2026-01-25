import React, { useState, useEffect } from 'react';
import { Clock, MapPin, DollarSign, Users, Zap, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import RealTimeNotifications from './RealTimeNotifications';
import AIMatchingEngine from './AIMatchingEngine';
import LocationTracker from './LocationTracker';

interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  postedAt: Date;
  deadline: string;
  applicants: number;
  distance?: number;
  isNew?: boolean;
  trustRequired: number;
}

const RealTimeGigFeed: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'nearby' | 'urgent' | 'new'>('all');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    loadGigs();
    setupRealTimeSubscription();
    simulateLiveActivity();
  }, []);

  const simulateLiveActivity = () => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
      
      if (Math.random() > 0.7) {
        const newGig: Gig = {
          id: `sim-${Date.now()}`,
          title: ['House Cleaning', 'Delivery Service', 'Garden Work', 'Painting Job'][Math.floor(Math.random() * 4)],
          description: 'Live simulated gig for real-time demonstration',
          budget: Math.floor(Math.random() * 50000) + 10000,
          location: ['Dodoma', 'Arusha', 'Mbeya', 'Dar es Salaam'][Math.floor(Math.random() * 4)],
          category: ['cleaning', 'delivery', 'handyman', 'other'][Math.floor(Math.random() * 4)],
          urgency: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as Gig['urgency'],
          postedAt: new Date(),
          deadline: '2024-12-31',
          applicants: Math.floor(Math.random() * 5),
          distance: Math.random() * 5,
          isNew: true,
          trustRequired: Math.floor(Math.random() * 30) + 70
        };
        
        setGigs(prev => [newGig, ...prev.slice(0, 19)]);
        
        toast({
          title: '🚀 New Live Gig!',
          description: `${newGig.title} - ${newGig.budget.toLocaleString()} TSH`,
        });
      }
    }, 8000);

    return () => clearInterval(interval);
  };

  const loadGigs = async () => {
    try {
      const sampleGigs: Gig[] = [
        {
          id: '1',
          title: 'House Cleaning Service',
          description: 'Need someone to clean a 3-bedroom house in Dodoma. Must be reliable and thorough.',
          budget: 25000,
          location: 'Dodoma',
          category: 'cleaning',
          urgency: 'medium',
          postedAt: new Date(Date.now() - 300000),
          deadline: '2024-12-31',
          applicants: 3,
          distance: 1.2,
          trustRequired: 80
        },
        {
          id: '2',
          title: 'Urgent Delivery Needed',
          description: 'Deliver documents from Arusha to Moshi. Time sensitive delivery required.',
          budget: 15000,
          location: 'Arusha',
          category: 'delivery',
          urgency: 'urgent',
          postedAt: new Date(Date.now() - 120000),
          deadline: '2024-12-31',
          applicants: 1,
          distance: 0.8,
          trustRequired: 90
        }
      ];
      setGigs(sampleGigs);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscription = () => {
    const subscription = supabase
      .channel('gigs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'gigs'
      }, (payload) => {
        const newGig: Gig = {
          id: payload.new.id,
          title: payload.new.title,
          description: payload.new.description,
          budget: payload.new.budget,
          location: payload.new.location,
          category: payload.new.category,
          urgency: payload.new.urgency || 'medium',
          postedAt: new Date(payload.new.created_at),
          deadline: payload.new.deadline,
          applicants: 0,
          distance: Math.random() * 5,
          isNew: true,
          trustRequired: payload.new.trust_required || 70
        };

        setGigs(prev => [newGig, ...prev]);
        
        toast({
          title: 'New Gig Available!',
          description: `${newGig.title} - ${newGig.budget.toLocaleString()} TSH`
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const getUrgencyColor = (urgency: Gig['urgency']) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleLocationUpdate = (location: { latitude: number; longitude: number }) => {
    setUserLocation({ lat: location.latitude, lng: location.longitude });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          <h2 className="text-xl font-bold">Live Gig Feed</h2>
          <Badge variant="outline" className="animate-pulse bg-green-50 text-green-700">
            LIVE • {liveCount} updates
          </Badge>
        </div>
        <RealTimeNotifications />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'nearby', 'urgent', 'new'].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(filterType as 'all' | 'nearby' | 'urgent' | 'new')}
            className="whitespace-nowrap"
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {gigs.map((gig) => (
            <Card key={gig.id} className={`transition-all hover:shadow-lg ${
              gig.isNew ? 'ring-2 ring-blue-500 ring-opacity-50 animate-pulse' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {gig.title}
                      {gig.isNew && (
                        <Badge variant="default" className="text-xs animate-pulse bg-green-500">
                          LIVE
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTimeAgo(gig.postedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {gig.distance ? `${gig.distance.toFixed(1)}km` : gig.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {gig.applicants} applicants
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${getUrgencyColor(gig.urgency)} text-white`}>
                      {gig.urgency.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {gig.budget.toLocaleString()} TSH
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {gig.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{gig.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Trust: {gig.trustRequired}%+
                    </span>
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <LocationTracker onLocationUpdate={handleLocationUpdate} />
          <AIMatchingEngine 
            userId="1" 
            userLocation={userLocation || undefined}
            userSkills={['cleaning', 'delivery', 'handyman']}
          />
        </div>
      </div>
    </div>
  );
};

export default RealTimeGigFeed;
