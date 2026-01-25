import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin, Zap } from 'lucide-react';

interface ManadaEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  currentParticipants: number;
  maxParticipants: number;
  status: 'scheduled' | 'live' | 'ended';
  location: string;
  category: string;
  featuredImage?: string;
}

interface ManadaLiveEventProps {
  event: ManadaEvent;
  onJoin: (eventId: string) => void;
  onReminder: (eventId: string) => void;
}

export const ManadaLiveEvent: React.FC<ManadaLiveEventProps> = ({ event, onJoin, onReminder }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isLive, setIsLive] = useState(event.status === 'live');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const startTime = new Date(event.startTime).getTime();
      const endTime = new Date(event.endTime).getTime();
      
      if (now < startTime) {
        const diff = startTime - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`Starts in ${hours}h ${minutes}m`);
        setIsLive(false);
      } else if (now >= startTime && now < endTime) {
        const diff = endTime - now;
        const minutes = Math.floor(diff / (1000 * 60));
        setTimeLeft(`${minutes}m left`);
        setIsLive(true);
      } else {
        setTimeLeft('Ended');
        setIsLive(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [event.startTime, event.endTime]);

  return (
    <Card className={`relative overflow-hidden ${isLive ? 'ring-2 ring-red-500 animate-pulse' : ''}`}>
      {isLive && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="destructive" className="animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{event.title}</CardTitle>
          <Badge variant="outline">{event.category}</Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {timeLeft}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {event.currentParticipants}/{event.maxParticipants}
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          {event.location}
        </div>

        {isLive ? (
          <Button 
            onClick={() => onJoin(event.id)}
            disabled={event.currentParticipants >= event.maxParticipants}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Join Manada Live
          </Button>
        ) : (
          <Button 
            onClick={() => onReminder(event.id)}
            disabled={timeLeft === 'Ended'}
            className="w-full"
          >
            {timeLeft === 'Ended' ? 'Event Ended' : 'Set Reminder'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
