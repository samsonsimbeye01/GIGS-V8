import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Clock, DollarSign, User, Star, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DynamicGig {
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
  urgency?: 'low' | 'medium' | 'high';
  views?: number;
  applicants?: number;
}

interface DynamicGigCardProps {
  gig: DynamicGig;
  onApply?: (gigId: string) => void;
  onView?: (gigId: string) => void;
  showActions?: boolean;
}

const DynamicGigCard: React.FC<DynamicGigCardProps> = ({ 
  gig, 
  onApply, 
  onView, 
  showActions = true 
}) => {
  const [views, setViews] = useState(gig.views || Math.floor(Math.random() * 50) + 10);
  const [applicants, setApplicants] = useState(gig.applicants || Math.floor(Math.random() * 8));
  const [isViewed, setIsViewed] = useState(false);

  useEffect(() => {
    // Simulate real-time view updates
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setViews(prev => prev + 1);
      }
      if (Math.random() > 0.9) {
        setApplicants(prev => prev + 1);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleView = () => {
    if (!isViewed) {
      setViews(prev => prev + 1);
      setIsViewed(true);
    }
    if (onView) {
      onView(gig.id);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(gig.id);
      setApplicants(prev => prev + 1);
      toast({ title: 'Application submitted!', description: 'You have applied for this gig.' });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Just posted';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleView}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">{gig.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {gig.client_name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{gig.client_name || 'Client'}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={getStatusColor(gig.status)}>
              {gig.status}
            </Badge>
            {gig.urgency && (
              <Badge className={getUrgencyColor(gig.urgency)}>
                {gig.urgency}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{gig.description}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{gig.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">TZS {gig.price?.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatTime(gig.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{applicants} applicants</span>
            </div>
          </div>
          
          {showActions && gig.status === 'open' && (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleApply();
              }}
              className="ml-2"
            >
              Apply Now
            </Button>
          )}
        </div>

        <Badge variant="outline" className="w-fit">
          {gig.category}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default DynamicGigCard;