import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, User } from 'lucide-react';

interface GigCardProps {
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
}

const GigCard: React.FC<GigCardProps> = ({
  title,
  description,
  location,
  price,
  timeAgo,
  category,
  distance,
  poster,
  urgency
}) => {
  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          <Badge className={urgencyColors[urgency]}>{urgency}</Badge>
        </div>
        <Badge variant="secondary" className="w-fit">{category}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm">{description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{location} • {distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeAgo}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <User className="h-4 w-4" />
          <span>Posted by {poster}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1 text-lg font-bold text-green-600">
            <DollarSign className="h-5 w-5" />
            <span>{price} TSH</span>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Apply Now</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GigCard;