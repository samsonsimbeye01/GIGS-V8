import React, { useEffect, useState } from 'react';
import { Bell, MapPin, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  type: 'new_gig' | 'gig_update' | 'payment' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  gigId?: string;
  distance?: number;
  amount?: number;
}

const RealTimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    // Subscribe to real-time gig updates
    const gigsSubscription = supabase
      .channel('gigs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'gigs'
      }, (payload) => {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: 'new_gig',
          title: 'New Gig Available!',
          message: `${payload.new.title} - ${payload.new.budget} TSH`,
          timestamp: new Date(),
          read: false,
          gigId: payload.new.id,
          distance: Math.floor(Math.random() * 5) + 1,
          amount: payload.new.budget
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        toast({
          title: 'New Gig Nearby!',
          description: `${payload.new.title} - ${payload.new.budget} TSH`,
        });
      })
      .subscribe();

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const types = ['new_gig', 'gig_update', 'payment', 'message'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type,
          title: getNotificationTitle(type),
          message: getNotificationMessage(type),
          timestamp: new Date(),
          read: false,
          distance: Math.floor(Math.random() * 5) + 1,
          amount: Math.floor(Math.random() * 50000) + 10000
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
        setUnreadCount(prev => prev + 1);
      }
    }, 15000);

    return () => {
      gigsSubscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const getNotificationTitle = (type: Notification['type']) => {
    switch (type) {
      case 'new_gig': return 'New Gig Available!';
      case 'gig_update': return 'Gig Status Update';
      case 'payment': return 'Payment Received';
      case 'message': return 'New Message';
    }
  };

  const getNotificationMessage = (type: Notification['type']) => {
    switch (type) {
      case 'new_gig': return 'House cleaning job within 2km';
      case 'gig_update': return 'Your application was accepted';
      case 'payment': return 'Payment of 25,000 TSH received';
      case 'message': return 'You have a new message from client';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_gig': return <MapPin className="w-4 h-4" />;
      case 'gig_update': return <Clock className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'message': return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPanel(!showPanel)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {showPanel && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Real-Time Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                          {notification.distance && (
                            <span className="text-xs text-blue-600">
                              {notification.distance}km away
                            </span>
                          )}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeNotifications;