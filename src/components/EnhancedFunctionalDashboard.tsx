import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Shield, 
  Clock, 
  MapPin, 
  DollarSign,
  Activity,
  Target,
  Star
} from 'lucide-react';
import RealTimeGigUpdates from './RealTimeGigUpdates';
import LiveUserActivity from './LiveUserActivity';
import DynamicGigCard from './DynamicGigCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardStats {
  totalGigs: number;
  activeGigs: number;
  completedGigs: number;
  totalEarnings: number;
  successRate: number;
  onlineUsers: number;
  newUsersToday: number;
  avgResponseTime: number;
}

const EnhancedFunctionalDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalGigs: 1247,
    activeGigs: 89,
    completedGigs: 1158,
    totalEarnings: 45680000,
    successRate: 94.2,
    onlineUsers: 1543,
    newUsersToday: 67,
    avgResponseTime: 2.4
  });
  
  const [recentGigs, setRecentGigs] = useState([
    {
      id: '1',
      title: 'Mobile App UI/UX Design',
      description: 'Need a modern, user-friendly mobile app design for a delivery service.',
      price: 850000,
      location: 'Dar es Salaam',
      category: 'Design',
      status: 'open',
      created_at: new Date().toISOString(),
      user_id: 'user1',
      client_name: 'TechCorp Ltd',
      urgency: 'high' as const,
      views: 24,
      applicants: 7
    },
    {
      id: '2',
      title: 'Content Writing for Blog',
      description: 'Looking for experienced content writer for technology blog posts.',
      price: 120000,
      location: 'Arusha',
      category: 'Writing',
      status: 'open',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user_id: 'user2',
      client_name: 'Digital Agency',
      urgency: 'medium' as const,
      views: 18,
      applicants: 3
    }
  ]);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onlineUsers: Math.max(1000, prev.onlineUsers + Math.floor(Math.random() * 20) - 10),
        activeGigs: Math.max(50, prev.activeGigs + Math.floor(Math.random() * 6) - 3),
        totalEarnings: prev.totalEarnings + Math.floor(Math.random() * 50000)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Key Stats Grid */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'}`}>
        <StatCard 
          title="Total Gigs" 
          value={stats.totalGigs.toLocaleString()} 
          icon={Zap} 
          color="text-yellow-500"
          subtitle="All time"
        />
        <StatCard 
          title="Active Now" 
          value={stats.activeGigs} 
          icon={Activity} 
          color="text-green-500"
          subtitle="Live gigs"
        />
        <StatCard 
          title="Online Users" 
          value={stats.onlineUsers.toLocaleString()} 
          icon={Users} 
          color="text-blue-500"
          subtitle="Right now"
        />
        <StatCard 
          title="Success Rate" 
          value={`${stats.successRate}%`} 
          icon={Target} 
          color="text-purple-500"
          subtitle="Completion rate"
        />
      </div>

      {/* Performance Metrics */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Platform Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Gig Completion Rate</span>
                <span className="text-sm text-muted-foreground">{stats.successRate}%</span>
              </div>
              <Progress value={stats.successRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">User Satisfaction</span>
                <span className="text-sm text-muted-foreground">96.8%</span>
              </div>
              <Progress value={96.8} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Response Time</span>
                <span className="text-sm text-muted-foreground">{stats.avgResponseTime}h avg</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Platform Earnings</span>
                <span className="text-lg font-bold text-green-600">
                  TZS {stats.totalEarnings.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Today's Transactions</span>
                <span className="text-lg font-bold">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Gig Value</span>
                <span className="text-lg font-bold">TZS 185,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Components */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        <RealTimeGigUpdates />
        <LiveUserActivity />
      </div>

      {/* Recent Gigs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Gigs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {recentGigs.map((gig) => (
              <DynamicGigCard 
                key={gig.id} 
                gig={gig} 
                showActions={false}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedFunctionalDashboard;