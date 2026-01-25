import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, User, Navigation, Phone, MessageCircle } from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import { useLiveData } from '@/components/LiveDataProvider';
import { toast } from '@/components/ui/use-toast';
import { gigService, GigApplication } from '@/services/gigService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';

interface GigDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    currency?: string;
    timeAgo: string;
    category: string;
    distance: string;
    poster: string;
    posterAvatar?: string;
    urgency: 'low' | 'medium' | 'high';
    lat: number;
    lng: number;
    phone?: string;
    requirements?: string[];
  } | null;
}

const GigDetailModal: React.FC<GigDetailModalProps> = ({ isOpen, onClose, gig }) => {
  if (!gig) return null;
  const { applyToGig, user } = useLiveData();
  const [applying, setApplying] = useState(false);
  const [applications, setApplications] = useState<GigApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const isClient = user?.role === 'client';

  const loadApplications = async () => {
    if (!isClient) return;
    setLoadingApps(true);
    try {
      const { applications, error } = await gigService.getApplications(gig.id);
      if (error) throw error;
      setApplications(applications);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingApps(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      loadApplications();
    }
  }, [isOpen, isClient]);

  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const gigLocation = {
    id: gig.id,
    title: gig.title,
    lat: gig.lat,
    lng: gig.lng,
    price: gig.price,
    category: gig.category,
    urgency: gig.urgency,
    timeAgo: gig.timeAgo,
    distance: gig.distance
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold">{gig.title}</span>
            <Badge className={urgencyColors[gig.urgency]}>{gig.urgency}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Details */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={gig.posterAvatar} />
                    <AvatarFallback>{gig.poster.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-medium">{gig.poster}</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Job Details</h3>
                <p className="text-gray-600 text-sm mb-4">{gig.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">{formatCurrency(gig.price, gig.currency || 'TZS')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{gig.location} • {gig.distance}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Posted {gig.timeAgo}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Posted by {gig.poster}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline">{gig.category}</Badge>
                </div>
              </CardContent>
            </Card>
            
            {gig.requirements && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {gig.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={applying}
                onClick={async () => {
                  try {
                    setApplying(true);
                    const { error } = await applyToGig(gig.id, 'Interested in this job', gig.price);
                    if (error) {
                      throw error;
                    }
                    toast({ title: 'Applied', description: 'Your application has been submitted.' });
                  } catch (error: any) {
                    toast({ title: 'Error', description: error.message || 'Failed to apply', variant: 'destructive' });
                  } finally {
                    setApplying(false);
                  }
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {applying ? 'Applying...' : 'Apply Now'}
              </Button>
              {gig.phone && (
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              )}
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${gig.lat},${gig.lng}`;
                  window.open(url, '_blank');
                }}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
            </div>
          </div>
          
          {/* Right Column - Map */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Job Location</h3>
                <InteractiveMap
                  gigs={[gigLocation]}
                  center={[gig.lat, gig.lng]}
                  className="h-80 w-full rounded-lg overflow-hidden"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Location Info</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Address:</strong> {gig.location}</p>
                  <p><strong>Distance:</strong> {gig.distance} from you</p>
                  <p><strong>Coordinates:</strong> {gig.lat.toFixed(4)}, {gig.lng.toFixed(4)}</p>
                </div>
              </CardContent>
            </Card>

            {isClient && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Applications</h3>
                    <Button variant="outline" size="sm" onClick={loadApplications} disabled={loadingApps}>
                      {loadingApps ? 'Loading...' : 'Refresh'}
                    </Button>
                  </div>
                  {applications.length === 0 && !loadingApps && (
                    <div className="text-sm text-muted-foreground">No applications yet.</div>
                  )}
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="border rounded-md p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">Worker: {app.worker_id}</p>
                          <p className="text-sm text-muted-foreground">{app.message}</p>
                          <p className="text-sm">Proposed Budget: {formatCurrency(app.proposed_budget, gig.currency || 'TZS')}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                const { error } = await gigService.acceptApplication(app.id);
                                if (error) throw error;
                                toast({ title: 'Application Accepted', description: 'Gig assigned to worker.' });
                                await loadApplications();
                              } catch (error: any) {
                                toast({ title: 'Error', description: error.message, variant: 'destructive' });
                              }
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                const { error } = await gigService.rejectApplication(app.id);
                                if (error) throw error;
                                toast({ title: 'Application Rejected' });
                                await loadApplications();
                              } catch (error: any) {
                                toast({ title: 'Error', description: error.message, variant: 'destructive' });
                              }
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GigDetailModal;
