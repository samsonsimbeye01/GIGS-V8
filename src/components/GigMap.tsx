import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  category: string;
  budget: number;
  location: string;
  distance: string;
  timePosted: string;
  urgency: string;
}

interface GigMapProps {
  gigs: Gig[];
  onGigSelect: (gig: Gig) => void;
}

const GigMap: React.FC<GigMapProps> = ({ gigs, onGigSelect }) => {
  return (
    <div className="space-y-4">
      {/* Map Placeholder */}
      <Card className="h-96 bg-gradient-to-br from-blue-50 to-green-50">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">
              Interactive Map View
            </h3>
            <p className="text-muted-foreground">
              See gigs near you on the map
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Gigs List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Gigs Near You</h3>
        {gigs.map((gig) => (
          <Card key={gig.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onGigSelect(gig)}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-primary">{gig.title}</h4>
                <Badge variant={gig.urgency === 'urgent' ? 'destructive' : 'secondary'}>
                  {gig.urgency}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${gig.budget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{gig.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{gig.timePosted}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline">{gig.category}</Badge>
                <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GigMap;