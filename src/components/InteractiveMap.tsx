import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Clock, Navigation } from 'lucide-react';

// Fix for default markers in React-Leaflet
const createCustomIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

interface GigLocation {
  id: string;
  title: string;
  lat: number;
  lng: number;
  price: number;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  timeAgo: string;
  distance: string;
}

interface InteractiveMapProps {
  gigs: GigLocation[];
  center: [number, number];
  onGigSelect?: (gig: GigLocation) => void;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  gigs, 
  center, 
  onGigSelect,
  className = "h-96 w-full rounded-lg overflow-hidden shadow-lg"
}) => {
  const getMarkerColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const handleMarkerClick = (gig: GigLocation) => {
    if (onGigSelect) {
      onGigSelect(gig);
    }
  };

  return (
    <div className={className}>
      <MapContainer 
        center={center} 
        zoom={13} 
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {gigs.map((gig) => (
          <Marker
            key={gig.id}
            position={[gig.lat, gig.lng]}
            icon={createCustomIcon(getMarkerColor(gig.urgency))}
            eventHandlers={{
              click: () => handleMarkerClick(gig)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-64">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{gig.title}</h3>
                  <Badge 
                    variant={gig.urgency === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {gig.urgency}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium text-green-600">{gig.price} TSH</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{gig.distance}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{gig.timeAgo}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {gig.category}
                  </Badge>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-xs"
                  onClick={() => handleMarkerClick(gig)}
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;