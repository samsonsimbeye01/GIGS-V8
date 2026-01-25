import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, DollarSign, Star, Users, Zap, Navigation } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useLiveData } from './LiveDataProvider';
import { gigService } from '@/services/gigService';
import GigStatusManager from './GigStatusManager';
import type { GigStatus } from './GigStatusManager';
import GigDetailModal from './GigDetailModal';
import RealTimeMessaging from './RealTimeMessaging';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const statusColors: Record<GigStatus, string> = {
  open: 'bg-blue-500',
  assigned: 'bg-indigo-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  disputed: 'bg-orange-500',
  under_review: 'bg-purple-500'
};

const LiveGigsFeed: React.FC = () => {
  const { user, gigs, refreshGigs, location, loading } = useLiveData();
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalGig, setModalGig] = useState<{
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    timeAgo: string;
    category: string;
    distance: string;
    poster: string;
    urgency: 'low' | 'medium' | 'high';
    lat: number;
    lng: number;
    phone?: string;
    requirements?: string[];
  } | null>(null);
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [clientAvatars, setClientAvatars] = useState<Record<string, string | undefined>>({});
  const [showMessaging, setShowMessaging] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<{ id: string; name: string; avatar?: string } | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [filterRadius, setFilterRadius] = useState<number | null>(null);
  const [paymentStatuses, setPaymentStatuses] = useState<Record<string, string>>({});

  const [newGigCount, setNewGigCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setNewGigCount(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    (async () => {
      if (user?.role === 'client') {
        const ids = gigs.map((g) => g.id);
        const { counts } = await gigService.getApplicationsCountForGigs(ids);
        setApplicationCounts(counts);
      } else {
        setApplicationCounts({});
      }
    })();
  }, [user?.role, gigs]);

  useEffect(() => {
    (async () => {
      const clientIds = Array.from(new Set(gigs.map((g) => g.client_id).filter(Boolean)));
      if (clientIds.length > 0) {
        const { profiles } = await gigService.getUserBasicProfiles(clientIds);
        const names: Record<string, string> = {};
        const avatars: Record<string, string | undefined> = {};
        Object.entries(profiles).forEach(([id, p]) => {
          names[id] = p.name;
          avatars[id] = p.avatar;
        });
        setClientNames(names);
        setClientAvatars(avatars);
      } else {
        setClientNames({});
        setClientAvatars({});
      }
    })();
  }, [gigs]);

  useEffect(() => {
    (async () => {
      const completedIds = gigs.filter((g) => g.status === 'completed').map((g) => g.id);
      if (completedIds.length > 0) {
        const { payments } = await gigService.getPaymentsForJobs(completedIds);
        setPaymentStatuses(payments);
      } else {
        setPaymentStatuses({});
      }
    })();
  }, [gigs]);

  useEffect(() => {
    if (gigs.length === 0) return;
    const ids = gigs.map((g) => g.id);
    const channel = supabase.channel('payments-feed');
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, (payload: any) => {
      const jobId = (payload?.new && (payload.new as any).jobId) || (payload?.old && (payload.old as any).jobId);
      const status = (payload?.new && (payload.new as any).status) || (payload?.old && (payload.old as any).status);
      if (jobId && ids.includes(jobId) && status) {
        setPaymentStatuses((prev) => ({ ...prev, [jobId]: status }));
      }
    });
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gigs]);

  const distanceKm = (lat1?: number, lon1?: number, lat2?: number, lon2?: number) => {
    if (
      typeof lat1 !== 'number' ||
      typeof lon1 !== 'number' ||
      typeof lat2 !== 'number' ||
      typeof lon2 !== 'number'
    ) return null;
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const mappedRole: 'worker' | 'employer' | 'admin' | null = useMemo(() => {
    if (!user?.role) return null;
    if (user.role === 'client') return 'employer';
    return user.role;
  }, [user?.role]);

  const displayGigs = useMemo(() => {
    let list = gigs;
    if (filterRadius && location) {
      list = list.filter((g) => {
        const d = distanceKm(location.latitude, location.longitude, g.latitude ?? undefined, g.longitude ?? undefined);
        return typeof d === 'number' ? d <= filterRadius : false;
      });
    }
    if (sortByDistance && location) {
      const withDistance = list.map((g) => {
        const d = distanceKm(location.latitude, location.longitude, g.latitude ?? undefined, g.longitude ?? undefined);
        return { gig: g, dist: typeof d === 'number' ? d : Number.POSITIVE_INFINITY };
      });
      return withDistance.sort((a, b) => a.dist - b.dist).map((x) => x.gig);
    }
    return list;
  }, [sortByDistance, filterRadius, location, gigs]);

  const handleApply = async (gigId: string, budget: number) => {
    if (!user) {
      toast({ title: 'Sign In Required', description: 'Please sign in to apply.', variant: 'destructive' });
      return;
    }
    const { error } = await gigService.applyToGig(gigId, user.id, 'Interested and available', budget);
    if (error) {
      toast({ title: 'Error', description: typeof error === 'string' ? error : error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Application Sent!', description: 'Your application has been submitted successfully.' });
      if (user.role === 'client') {
        const { applications } = await gigService.getApplications(gigId);
        setApplicationCounts((prev) => ({ ...prev, [gigId]: applications.length }));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Live Gigs
        </h2>
        {newGigCount > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            {newGigCount} new
          </Badge>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant={sortByDistance ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortByDistance((v) => !v)}
            disabled={!location}
          >
            Sort by distance
          </Button>
          <Select onValueChange={(v) => setFilterRadius(v ? Number(v) : null)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All distances</SelectItem>
              <SelectItem value="5">Within 5 km</SelectItem>
              <SelectItem value="10">Within 10 km</SelectItem>
              <SelectItem value="20">Within 20 km</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-md p-4 space-y-3">
              <div className="h-5 w-40 bg-muted animate-pulse rounded" />
              <div className="h-3 w-full bg-muted animate-pulse rounded" />
              <div className="h-3 w-3/4 bg-muted animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
        {displayGigs.map(gig => (
          <Card key={gig.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{gig.title}</CardTitle>
                    <Badge variant="secondary" className={`${statusColors[gig.status as GigStatus]} text-white text-xs`}>
                      {gig.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{gig.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {gig.location}
                      {location && typeof gig.latitude === 'number' && typeof gig.longitude === 'number' && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          • {distanceKm(location.latitude, location.longitude, gig.latitude, gig.longitude)?.toFixed(1)} km away
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDateTime(gig.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {typeof applicationCounts[gig.id] === 'number' ? `${applicationCounts[gig.id]} applications` : ' '}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-primary">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(gig.budget, gig.currency)}
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    {gig.category}
                  </Badge>
                  {gig.status === 'completed' && (
                    <div className="mt-1">
                      <Badge variant="outline">
                        {paymentStatuses[gig.id] ? `Payment: ${paymentStatuses[gig.id]}` : 'Payment: none'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={clientAvatars[gig.client_id] || '/placeholder.svg'} />
                    <AvatarFallback>{(clientNames[gig.client_id] || 'C').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{clientNames[gig.client_id] || 'Client'}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-500">4.8</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10"
                    size="sm"
                    onClick={() => {
                      const created = new Date(gig.created_at).getTime();
                      const minutes = Math.max(0, Math.floor((Date.now() - created) / 60000));
                      const timeAgo = minutes < 1 ? 'Just now' : `${minutes} minutes ago`;
                      const urgency: 'low' | 'medium' | 'high' = gig.status === 'open' ? 'high' : 'low';
                      const dist = location && distanceKm(location.latitude, location.longitude, gig.latitude ?? undefined, gig.longitude ?? undefined);
                      setModalGig({
                        id: gig.id,
                        title: gig.title,
                        description: gig.description,
                        location: gig.location,
                        price: gig.budget,
                        currency: gig.currency,
                        timeAgo,
                        category: gig.category,
                        distance: dist ? `${dist.toFixed(1)} km` : 'N/A',
                        poster: clientNames[gig.client_id] || 'Client',
                        posterAvatar: clientAvatars[gig.client_id],
                        urgency,
                        lat: gig.latitude ?? 0,
                        lng: gig.longitude ?? 0
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                  {typeof gig.latitude === 'number' && typeof gig.longitude === 'number' && (
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                      size="sm"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${gig.latitude},${gig.longitude}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Open in Maps
                    </Button>
                  )}
                  {gig.status === 'open' && mappedRole === 'worker' && (
                    <Button 
                      onClick={() => handleApply(gig.id, gig.budget)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                    >
                      Apply Now
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                    size="sm"
                    onClick={async () => {
                      try {
                        if (!user) {
                          toast({ title: 'Sign In Required', description: 'Please sign in to message.', variant: 'destructive' });
                          return;
                        }
                        let recipientId: string | undefined;
                        let recipientName = 'User';
                        let recipientAvatar: string | undefined;
                        if (mappedRole === 'worker') {
                          recipientId = gig.client_id;
                          recipientName = clientNames[gig.client_id] || 'Client';
                          recipientAvatar = clientAvatars[gig.client_id];
                        } else if (mappedRole === 'employer' && gig.worker_id) {
                          recipientId = gig.worker_id;
                          const { profiles } = await gigService.getUserBasicProfiles([gig.worker_id]);
                          recipientName = profiles[gig.worker_id]?.name || 'Worker';
                          recipientAvatar = profiles[gig.worker_id]?.avatar;
                        }
                        if (!recipientId) {
                          toast({ title: 'No Recipient', description: 'Messaging available after assignment.', variant: 'destructive' });
                          return;
                        }
                        setMessageRecipient({ id: recipientId, name: recipientName, avatar: recipientAvatar });
                        setShowMessaging(true);
                      } catch (err: any) {
                        toast({ title: 'Error', description: err.message || 'Could not open messaging', variant: 'destructive' });
                      }
                    }}
                  >
                    Message
                  </Button>
                </div>
              </div>
              {mappedRole && (
                <div className="mt-3">
                  <GigStatusManager
                    gigId={gig.id}
                    currentStatus={gig.status as GigStatus}
                    userRole={mappedRole}
                    onStatusChange={async () => {
                      await refreshGigs();
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      )}
      <Dialog open={showMessaging} onOpenChange={setShowMessaging}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Conversation</DialogTitle>
          </DialogHeader>
          {user && messageRecipient && (
            <RealTimeMessaging
              userId={user.id}
              recipientId={messageRecipient.id}
              recipientName={messageRecipient.name}
              recipientAvatar={messageRecipient.avatar}
            />
          )}
        </DialogContent>
      </Dialog>
      <GigDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gig={modalGig}
      />
    </div>
  );
};

export default LiveGigsFeed;
