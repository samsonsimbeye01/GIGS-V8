import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Briefcase, DollarSign, Star, Clock, MapPin, Users, TrendingUp,
  MessageSquare, CheckCircle, AlertCircle, Calendar, BarChart3
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface FunctionalDashboardProps {
  hideWelcomeHero?: boolean;
}

const FunctionalDashboard: React.FC<FunctionalDashboardProps> = ({ hideWelcomeHero = false }) => {
  const [dashboardData, setDashboardData] = useState({
    activeGigs: 8,
    completedGigs: 156,
    earnings: {
      thisMonth: 450000,
      lastMonth: 390000,
      pending: 75000,
      available: 375000
    },
    stats: {
      responseRate: 92,
      trustScore: 4.8,
      completionRate: 98,
      avgRating: 4.7
    }
  });

  const [recentActivity] = useState([
    { id: 1, type: 'completed', title: 'House Cleaning', amount: 50000, time: '2 hours ago' },
    { id: 2, type: 'applied', title: 'Document Delivery', amount: 15000, time: '4 hours ago' },
    { id: 3, type: 'posted', title: 'Garden Maintenance', amount: 80000, time: '1 day ago' },
    { id: 4, type: 'payment', title: 'Tutoring Session', amount: 25000, time: '2 days ago' }
  ]);

  const [upcomingGigs] = useState([
    { id: 1, title: 'Office Cleaning', client: 'ABC Corp', time: 'Tomorrow 9:00 AM', location: 'Upanga' },
    { id: 2, title: 'Data Entry', client: 'Tech Solutions', time: 'Friday 2:00 PM', location: 'Remote' },
    { id: 3, title: 'Photography', client: 'Event Co.', time: 'Saturday 10:00 AM', location: 'Msimbazi' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        activeGigs: prev.activeGigs + (Math.random() > 0.8 ? 1 : 0),
        stats: {
          ...prev.stats,
          responseRate: Math.min(100, prev.stats.responseRate + (Math.random() * 2 - 1))
        }
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} Action`,
      description: `${action} functionality activated`
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'applied': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'posted': return <Briefcase className="h-4 w-4 text-purple-500" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-green-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {!hideWelcomeHero && (
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-white/90">You have {dashboardData.activeGigs} active gigs and {recentActivity.length} recent activities</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleQuickAction('Post Gig')}>
                Post New Gig
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Find Gigs
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Gigs</p>
                <p className="text-2xl font-bold">{dashboardData.activeGigs}</p>
                <p className="text-xs text-green-600">+2 this week</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">TSH {dashboardData.earnings.thisMonth.toLocaleString()}</p>
                <p className="text-xs text-green-600">+15% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trust Score</p>
                <p className="text-2xl font-bold">{dashboardData.stats.trustScore}</p>
                <p className="text-xs text-blue-600">AI-powered rating</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">{Math.round(dashboardData.stats.responseRate)}%</p>
                <p className="text-xs text-purple-600">Within 2 hours</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">TSH {activity.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Gigs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Gigs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingGigs.map(gig => (
            <div key={gig.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{gig.client.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">{gig.title}</p>
                <p className="text-xs text-gray-500">{gig.client} • {gig.location}</p>
                <p className="text-xs text-blue-600">{gig.time}</p>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FunctionalDashboard;
