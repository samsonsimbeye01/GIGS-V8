import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import FunctionalPostGigModal from './FunctionalPostGigModal';

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

interface FunctionalLiveGigsFeedProps {
  user: SupabaseUser | null;
  gigs: Gig[];
  loading: boolean;
  onApplyToGig: (gigId: string) => Promise<void>;
  onCreateGig: (gig: Partial<Gig>) => Promise<void>;
  showAuth: () => void;
}

const FunctionalLiveGigsFeed: React.FC<FunctionalLiveGigsFeedProps> = ({
  user,
  gigs,
  loading,
  onApplyToGig,
  onCreateGig,
  showAuth
}) => {
  const [showPostModal, setShowPostModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'assigned': return 'bg-blue-500';
      case 'in_progress': return 'bg-purple-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const handleApply = (gigId: string) => {
    if (!user) {
      showAuth();
      return;
    }
    onApplyToGig(gigId);
  };

  const handlePostGig = () => {
    if (!user) {
      showAuth();
      return;
    }
    setShowPostModal(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Live Gigs</h2>
        <Button onClick={handlePostGig}>Post New Gig</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gigs.map((gig) => (
          <Card key={gig.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{gig.title}</CardTitle>
                <Badge className={`${getStatusColor(gig.status)} text-white`}>
                  {gig.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {gig.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{gig.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">
                  {gig.price.toLocaleString()} TSH
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{new Date(gig.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{gig.category}</span>
              </div>
              
              {gig.status === 'open' && (
                <Button 
                  onClick={() => handleApply(gig.id)}
                  className="w-full"
                  size="sm"
                >
                  Apply Now
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {gigs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No gigs available at the moment.</p>
          <Button onClick={handlePostGig} className="mt-4">
            Post the First Gig
          </Button>
        </div>
      )}

      <FunctionalPostGigModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={onCreateGig}
      />
    </div>
  );
};

export default FunctionalLiveGigsFeed;