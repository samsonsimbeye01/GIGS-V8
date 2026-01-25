import React, { useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CurrencyDisplay from './CurrencyDisplay';
import MultilingualText from './MultilingualText';
import { MapPin, Clock, User, Star } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  urgent: boolean;
  postedBy: string;
  rating: number;
  distance: number;
}

const EnhancedGigFeed: React.FC = () => {
  const { country, coordinates } = useLocation();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading localized gigs
    const mockGigs: Gig[] = [
      {
        id: '1',
        title: 'Delivery Service',
        description: 'Need someone to deliver packages across the city',
        price: country.code === 'NG' ? 5000 : country.code === 'KE' ? 500 : 10000,
        location: country.code === 'NG' ? 'Lagos' : country.code === 'KE' ? 'Nairobi' : 'Dar es Salaam',
        category: 'delivery',
        urgent: true,
        postedBy: 'John Doe',
        rating: 4.5,
        distance: 2.3
      },
      {
        id: '2',
        title: 'House Cleaning',
        description: 'Professional cleaning service needed',
        price: country.code === 'NG' ? 8000 : country.code === 'KE' ? 800 : 15000,
        location: country.code === 'NG' ? 'Abuja' : country.code === 'KE' ? 'Mombasa' : 'Arusha',
        category: 'cleaning',
        urgent: false,
        postedBy: 'Jane Smith',
        rating: 4.8,
        distance: 5.1
      },
      {
        id: '3',
        title: 'Tech Support',
        description: 'Computer repair and maintenance',
        price: country.code === 'NG' ? 12000 : country.code === 'KE' ? 1200 : 20000,
        location: country.code === 'NG' ? 'Lagos' : country.code === 'KE' ? 'Nairobi' : 'Dar es Salaam',
        category: 'tech',
        urgent: false,
        postedBy: 'Tech Pro',
        rating: 4.9,
        distance: 1.8
      }
    ];

    setTimeout(() => {
      setGigs(mockGigs);
      setLoading(false);
    }, 1000);
  }, [country]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          <MultilingualText text="Local Gigs" /> - {country.name}
        </h2>
        <Badge variant="outline">{gigs.length} available</Badge>
      </div>
      
      {gigs.map(gig => (
        <Card key={gig.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">
                  <MultilingualText text={gig.title} showToggle={false} />
                  {gig.urgent && <Badge className="ml-2 bg-red-500">Urgent</Badge>}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {gig.location}
                    {coordinates && <span>({gig.distance} km)</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {gig.postedBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {gig.rating}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <CurrencyDisplay amount={gig.price} />
                <Badge variant="secondary" className="mt-1">
                  {gig.category}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              <MultilingualText text={gig.description} showToggle={false} />
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Posted 2 hours ago
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <MultilingualText text="View Details" showToggle={false} />
                </Button>
                <Button size="sm">
                  <MultilingualText text="Apply" showToggle={false} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedGigFeed;