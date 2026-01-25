import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  urgency: string;
  status: string;
  created_at: string;
  poster_name?: string;
  poster_rating?: number;
}

interface GigSummaryStripProps {
  gigs: Gig[];
  onGigClick: (gig: Gig) => void;
}

const GigSummaryStrip: React.FC<GigSummaryStripProps> = ({ gigs, onGigClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-600';
      case 'expired': return 'bg-gray-500';
      case 'disputed': return 'bg-red-500';
      default: return 'bg-green-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Recent Gigs</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {gigs.slice(0, 10).map((gig) => (
          <Card 
            key={gig.id} 
            className="min-w-[300px] cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onGigClick(gig)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm truncate">{gig.title}</h4>
                <Badge className={`${getStatusColor(gig.status)} text-white text-xs`}>
                  {gig.status}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3" />
                  <span>TSh {gig.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 mb-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{gig.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(gig.created_at)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {gig.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{gig.poster_rating || 4.5}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GigSummaryStrip;