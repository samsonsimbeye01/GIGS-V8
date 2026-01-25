import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Clock } from 'lucide-react';

interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
  user_name?: string;
  details?: string;
}

const LiveUserActivity: React.FC = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [activeNow, setActiveNow] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      // Simulate real user activities
      const mockActivities: UserActivity[] = [
        {
          id: '1',
          user_id: 'user1',
          action: 'posted_gig',
          timestamp: new Date().toISOString(),
          user_name: 'John M.',
          details: 'Web Development Project'
        },
        {
          id: '2',
          user_id: 'user2',
          action: 'applied_gig',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          user_name: 'Sarah K.',
          details: 'Mobile App Design'
        },
        {
          id: '3',
          user_id: 'user3',
          action: 'completed_gig',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          user_name: 'David L.',
          details: 'Logo Design'
        }
      ];
      setActivities(mockActivities);
    };

    fetchActivities();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setOnlineUsers(prev => Math.max(100, prev + Math.floor(Math.random() * 10) - 5));
      setActiveNow(prev => Math.max(10, prev + Math.floor(Math.random() * 5) - 2));
      
      // Add new activity occasionally
      if (Math.random() > 0.7) {
        const actions = ['posted_gig', 'applied_gig', 'completed_gig', 'joined_platform'];
        const names = ['Alice T.', 'Bob R.', 'Carol S.', 'Daniel W.', 'Emma J.'];
        const details = ['Data Entry', 'Graphic Design', 'Content Writing', 'Translation', 'Photography'];
        
        const newActivity: UserActivity = {
          id: Date.now().toString(),
          user_id: `user${Date.now()}`,
          action: actions[Math.floor(Math.random() * actions.length)],
          timestamp: new Date().toISOString(),
          user_name: names[Math.floor(Math.random() * names.length)],
          details: details[Math.floor(Math.random() * details.length)]
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'posted_gig': return <Badge className="bg-green-100 text-green-800">Posted</Badge>;
      case 'applied_gig': return <Badge className="bg-blue-100 text-blue-800">Applied</Badge>;
      case 'completed_gig': return <Badge className="bg-purple-100 text-purple-800">Completed</Badge>;
      case 'joined_platform': return <Badge className="bg-orange-100 text-orange-800">Joined</Badge>;
      default: return <Badge variant="secondary">{action}</Badge>;
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Live User Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{onlineUsers}</p>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Users className="w-3 h-3" />
              Online Now
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{activeNow}</p>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Activity className="w-3 h-3" />
              Active Now
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-2 bg-muted rounded">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">
                  {activity.user_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{activity.user_name}</span>
                  {getActionBadge(activity.action)}
                </div>
                <p className="text-xs text-muted-foreground">{activity.details}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(activity.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveUserActivity;