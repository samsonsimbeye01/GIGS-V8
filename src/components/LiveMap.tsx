import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Clock } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  status: string;
  created_at: string;
  poster_name?: string;
  poster_rating?: number;
  latitude?: number;
  longitude?: number;
}

interface LiveMapProps {
  gigs: Gig[];
  onGigClick: (gig: Gig) => void;
}

const LiveMap: React.FC<LiveMapProps> = ({ gigs, onGigClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#10B981';
      case 'assigned': return '#3B82F6';
      case 'in_progress': return '#F59E0B';
      case 'completed': return '#059669';
      case 'expired': return '#6B7280';
      case 'disputed': return '#EF4444';
      default: return '#10B981';
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
      <h3 className="text-lg font-semibold mb-4">Live Gig Map</h3>
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapRef}
            className="relative w-full h-96 bg-gradient-to-br from-blue-100 to-green-100 overflow-hidden"
          >
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" viewBox="0 0 800 400">
                <path d="M0,200 Q200,100 400,200 T800,200" stroke="#3B82F6" strokeWidth="2" fill="none" />
                <path d="M0,250 Q300,150 600,250 T800,250" stroke="#10B981" strokeWidth="2" fill="none" />
                <circle cx="200" cy="150" r="30" fill="#E5E7EB" opacity="0.5" />
                <circle cx="600" cy="200" r="40" fill="#E5E7EB" opacity="0.5" />
              </svg>
            </div>
            
            {/* Gig Pins */}
            {gigs.map((gig, index) => {
              const x = ((gig.longitude || 39.2083) - 39.0) * 2000 + 100;
              const y = ((-gig.latitude || 6.7924) + 7.0) * 2000 + 50;
              
              return (
                <div
                  key={gig.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${Math.max(50, Math.min(x, 750))}px`, top: `${Math.max(50, Math.min(y, 350))}px` }}
                  onClick={() => onGigClick(gig)}
                >
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"
                    style={{ backgroundColor: getStatusColor(gig.status) }}
                  ></div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-white p-3 rounded-lg shadow-lg border min-w-[200px]">
                      <h4 className="font-semibold text-sm mb-1">{gig.title}</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>TSh {gig.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{gig.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(gig.created_at)}</span>
                        </div>
                      </div>
                      <Badge 
                        className="mt-2 text-xs" 
                        style={{ backgroundColor: getStatusColor(gig.status) }}
                      >
                        {gig.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
              <h4 className="font-semibold text-sm mb-2">Status Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Assigned</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Disputed</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveMap;