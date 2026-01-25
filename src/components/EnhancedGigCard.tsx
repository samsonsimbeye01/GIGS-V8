import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, User, Navigation, Eye } from 'lucide-react';
import GigDetailModal from './GigDetailModal';
import { jobCategories } from '@/utils/jobCategories';
import { gigService } from '@/services/gigService';
import { useLiveData } from './LiveDataProvider';

interface EnhancedGigCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  timeAgo: string;
  category: string;
  job_type?: string;
  distance: string;
  poster: string;
  urgency: 'low' | 'medium' | 'high';
  lat: number;
  lng: number;
  phone?: string;
  requirements?: string[];
}

const EnhancedGigCard: React.FC<EnhancedGigCardProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationCount, setApplicationCount] = useState<number | null>(null);
  const { user } = useLiveData();
  
  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  // Find category emoji
  const getCategoryEmoji = () => {
    const categoryEntry = Object.entries(jobCategories).find(([_, cat]) => 
      cat.name === props.category
    );
    return categoryEntry ? categoryEntry[1].emoji : '💼';
  };

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${props.lat},${props.lng}`;
    window.open(url, '_blank');
  };
  
  useEffect(() => {
    (async () => {
      if (user?.role === 'client') {
        const { applications } = await gigService.getApplications(props.id);
        setApplicationCount(applications.length);
      } else {
        setApplicationCount(null);
      }
    })();
  }, [props.id, user?.role]);

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {props.title}
            </CardTitle>
            <div className="flex gap-2">
              <Badge className={urgencyColors[props.urgency]}>{props.urgency}</Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                <span className="font-medium">{props.distance}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="secondary" className="w-fit">
              <span className="mr-1">{getCategoryEmoji()}</span>
              {props.category}
            </Badge>
            {applicationCount !== null && (
              <Badge variant="outline" className="w-fit text-xs">
                {applicationCount} applications
              </Badge>
            )}
            {props.job_type && (
              <Badge variant="outline" className="w-fit text-xs">
                {props.job_type}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-gray-600 text-sm line-clamp-2">{props.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{props.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{props.timeAgo}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>Posted by {props.poster}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-1 text-lg font-bold text-green-600">
              <DollarSign className="h-5 w-5" />
              <span>{props.price} TSH</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGetDirections}
                className="hover:bg-blue-50"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Directions
              </Button>
              
              <Button 
                size="sm"
                onClick={handleViewDetails}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <GigDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gig={props}
      />
    </>
  );
};

export default EnhancedGigCard;
