import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

interface LocationTrackerProps {
  gigId?: string;
  trackingEnabled?: boolean;
  onLocationUpdate?: (location: Location) => void;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({ 
  gigId, 
  trackingEnabled = false, 
  onLocationUpdate 
}) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isTracking, setIsTracking] = useState(trackingEnabled);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [nearbyGigs, setNearbyGigs] = useState<any[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (isTracking && permissionStatus === 'granted') {
      startTracking();
    } else {
      stopTracking();
    }

    return () => stopTracking();
  }, [isTracking, permissionStatus]);

  useEffect(() => {
    if (currentLocation) {
      findNearbyGigs();
      onLocationUpdate?.(currentLocation);
    }
  }, [currentLocation, onLocationUpdate]);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Location Not Supported',
        description: 'Your browser does not support location services.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(permission.state);
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPermissionStatus('granted');
        updateLocation(position);
        toast({
          title: 'Location Access Granted',
          description: 'You can now see nearby gigs and track your location.'
        });
      },
      (error) => {
        setPermissionStatus('denied');
        toast({
          title: 'Location Access Denied',
          description: 'Please enable location access to find nearby gigs.',
          variant: 'destructive'
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const startTracking = () => {
    if (!navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      updateLocation,
      (error) => {
        console.error('Location tracking error:', error);
        toast({
          title: 'Location Tracking Error',
          description: 'Unable to track your location. Please check your settings.',
          variant: 'destructive'
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  const updateLocation = async (position: GeolocationPosition) => {
    const location: Location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date()
    };

    setCurrentLocation(location);

    // Update location in database if tracking a gig
    if (gigId) {
      try {
        await supabase
          .from('gig_locations')
          .upsert({
            gig_id: gigId,
            user_id: '1', // Mock user ID
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error updating location:', error);
      }
    }
  };

  const findNearbyGigs = async () => {
    if (!currentLocation) return;

    try {
      // In a real app, this would use PostGIS or similar for geo queries
      const { data: gigs, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('status', 'open');

      if (error) throw error;

      // Mock distance calculation (in real app, use proper geo calculations)
      const gigsWithDistance = gigs?.map(gig => ({
        ...gig,
        distance: Math.random() * 5 // Mock distance in km
      })).filter(gig => gig.distance <= 5) || [];

      setNearbyGigs(gigsWithDistance);
    } catch (error) {
      console.error('Error finding nearby gigs:', error);
    }
  };

  const toggleTracking = () => {
    if (permissionStatus === 'granted') {
      setIsTracking(!isTracking);
    } else {
      requestLocationPermission();
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy <= 10) return 'bg-green-500';
    if (accuracy <= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAccuracyText = (accuracy: number) => {
    if (accuracy <= 10) return 'High';
    if (accuracy <= 50) return 'Medium';
    return 'Low';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {permissionStatus === 'denied' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Location access is required to find nearby gigs. Please enable location permissions.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-medium">
              {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
            </span>
          </div>
          <Button
            onClick={toggleTracking}
            variant={isTracking ? 'destructive' : 'default'}
            size="sm"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
        </div>

        {currentLocation && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Location:</span>
              <Badge variant="outline" className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getAccuracyColor(currentLocation.accuracy)}`} />
                {getAccuracyText(currentLocation.accuracy)} Accuracy
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Lat: {currentLocation.latitude.toFixed(6)}, 
              Lng: {currentLocation.longitude.toFixed(6)}
            </div>
            <div className="text-xs text-muted-foreground">
              Updated: {currentLocation.timestamp.toLocaleTimeString()}
            </div>
          </div>
        )}

        {nearbyGigs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Nearby Gigs ({nearbyGigs.length})
            </h4>
            <div className="space-y-1">
              {nearbyGigs.slice(0, 3).map((gig) => (
                <div key={gig.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <p className="text-sm font-medium">{gig.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {gig.distance.toFixed(1)}km away
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {gig.budget} TSH
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationTracker;