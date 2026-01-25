import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Crosshair, Filter } from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import GigDetailModal from './GigDetailModal';

interface GigLocation {
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
}

interface EnhancedGigMapProps {
  gigs: GigLocation[];
  userLocation?: [number, number];
}

const EnhancedGigMap: React.FC<EnhancedGigMapProps> = ({ 
  gigs, 
  userLocation = [-6.7924, 39.2083] // Default to Dar es Salaam
}) => {
  const [selectedGig, setSelectedGig] = useState<GigLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(userLocation);
  const [filteredGigs, setFilteredGigs] = useState<GigLocation[]>(gigs);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredGigs(gigs);
    } else {
      setFilteredGigs(gigs.filter(gig => gig.category === selectedCategory));
    }
  }, [selectedCategory, gigs]);

  const handleGigSelect = (gig: GigLocation) => {
    setSelectedGig(gig);
    setIsModalOpen(true);
  };

  const handleCenterOnUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setMapCenter(newCenter);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const categories = ['all', ...Array.from(new Set(gigs.map(gig => gig.category)))];

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Live Gig Map
              <Badge variant="outline" className="ml-2">
                {filteredGigs.length} gigs nearby
              </Badge>
            </CardTitle>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCenterOnUser}
                className="hover:bg-blue-50"
              >
                <Crosshair className="h-4 w-4 mr-1" />
                My Location
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by category:</span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Interactive Map */}
          <InteractiveMap
            gigs={filteredGigs}
            center={mapCenter}
            onGigSelect={handleGigSelect}
            className="h-96 w-full rounded-lg overflow-hidden shadow-lg border"
          />
          
          {/* Map Legend */}
          <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Navigation className="h-4 w-4" />
              <span>Click markers for details & directions</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Gig Detail Modal */}
      <GigDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gig={selectedGig}
      />
    </div>
  );
};

export default EnhancedGigMap;