import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import GigFeed from './GigFeed';
import DashboardStats from './DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase,
  DollarSign,
  Star,
  Clock,
  MapPin,
  Users,
  Filter,
  MessageSquare
} from 'lucide-react';

const recentActivity = [
  { id: 1, action: 'Applied to', gig: 'House Cleaning Service', time: '2 hours ago', status: 'pending' },
  { id: 2, action: 'Completed', gig: 'Document Delivery', time: '1 day ago', status: 'completed' },
  { id: 3, action: 'Posted', gig: 'Garden Maintenance', time: '2 days ago', status: 'active' },
  { id: 4, action: 'Received payment', gig: 'Tutoring Session', time: '3 days ago', status: 'completed' }
];

const filterChips = ['Cleaning', 'Delivery', 'Gardening', 'Construction', 'Tutoring'];

const Dashboard: React.FC = () => {
  const [responseRate, setResponseRate] = useState(87);
  const [trustScore, setTrustScore] = useState(4.8);
  const [aiAnalysis, setAiAnalysis] = useState({
    reliability: 92,
    communication: 88,
    skillLevel: 85,
    punctuality: 94
  });
  const [earnings, setEarnings] = useState({
    thisMonth: 450000,
    lastMonth: 390000,
    pending: 75000,
    available: 375000
  });
  const [accountingData, setAccountingData] = useState({
    totalEarnings: 2450000,
    totalGigs: 156,
    avgRating: 4.8,
    expenses: 180000,
    netIncome: 2270000
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setResponseRate(prev => Math.min(100, prev + Math.random() * 2 - 1));
      setTrustScore(prev => Math.min(5, Math.max(1, prev + (Math.random() * 0.2 - 0.1))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="empowered-gradient text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
        <p className="text-white/90">You have 3 new gig opportunities near you</p>
        <div className="flex items-center gap-2 mt-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">Dar es Salaam, Tanzania</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Gigs"
          value="12"
          change="+2 from last week"
          icon={Briefcase}
          trend="up"
        />
        <StatsCard
          title="Earnings This Month"
          value={`TSH ${earnings.thisMonth.toLocaleString()}`}
          change={`+${Math.round(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100)}% from last month`}
          icon={DollarSign}
          trend="up"
        />
        <StatsCard
          title="Trust Score"
          value={trustScore.toFixed(1)}
          change="AI-powered rating"
          icon={Star}
          trend="up"
        />
        <StatsCard
          title="Response Rate"
          value={`${Math.round(responseRate)}%`}
          change="Within 2 hours"
          icon={MessageSquare}
          trend="up"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Your Stats</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="accounting">Accounting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.action} <span className="text-primary">{activity.gig}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className={
                      activity.status === 'completed' ? 'bg-green-500' : 
                      activity.status === 'pending' ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Users className="h-5 w-5" />
                    Available Gigs Near You
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-4">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <div className="flex gap-2 flex-wrap">
                      {filterChips.map(chip => (
                        <Badge key={chip} variant="outline" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                          {chip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <GigFeed />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardStats
              responseRate={responseRate}
              trustScore={trustScore}
              aiAnalysis={aiAnalysis}
              earnings={earnings}
              accountingData={accountingData}
            />
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardStats
              responseRate={responseRate}
              trustScore={trustScore}
              aiAnalysis={aiAnalysis}
              earnings={earnings}
              accountingData={accountingData}
            />
          </div>
        </TabsContent>

        <TabsContent value="accounting" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardStats
              responseRate={responseRate}
              trustScore={trustScore}
              aiAnalysis={aiAnalysis}
              earnings={earnings}
              accountingData={accountingData}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;