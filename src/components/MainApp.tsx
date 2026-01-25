import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import AuthModal from './AuthModal';
import PostGigModal from './PostGigModal';
import MainAppContent from './MainAppContent';
import { User, Plus, Search, Menu, MessageCircle, Bell, Settings } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  urgency: string;
  status: string;
  created_at: string;
  poster_id: string;
  poster_name?: string;
  poster_rating?: number;
  latitude?: number;
  longitude?: number;
}

const MainApp: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [postGigModalOpen, setPostGigModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    checkUser();
    fetchGigs();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    filterGigs();
  }, [gigs, searchTerm, selectedCategory, statusFilter]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGigs = async () => {
    try {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      const gigsWithMockData = (data || []).map(gig => ({
        ...gig,
        poster_name: gig.poster_name || 'John Doe',
        poster_rating: gig.poster_rating || 4.5,
        latitude: gig.latitude || -6.7924 + (Math.random() - 0.5) * 0.1,
        longitude: gig.longitude || 39.2083 + (Math.random() - 0.5) * 0.1
      }));
      setGigs(gigsWithMockData);
    } catch (error: any) {
      console.error('Error loading gigs:', error);
      toast({ title: 'Error loading gigs', description: 'Please try again later', variant: 'destructive' });
    }
  };

  const filterGigs = () => {
    let filtered = gigs;
    
    if (searchTerm) {
      filtered = filtered.filter(gig => 
        gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(gig => gig.category === selectedCategory);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(gig => gig.status === statusFilter);
    }
    
    setFilteredGigs(filtered);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const handleApplyGig = (gig: Gig) => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      toast({ title: 'Application sent!', description: 'The poster will be notified.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Linka...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50">
      {/* Status Bar */}
      <div className="bg-gray-900 text-white px-4 py-1 text-xs flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span>Tanzania</span>
          <span>TZS</span>
          <span>{formatTime(currentTime)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Kenya</span>
          <span>(KES)</span>
          <span>Emergency: 999</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-primary">Linka</h1>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600">Live</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>127 Active Gigs</div>
                <div>1.5K Online</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                Messages
                <Badge className="ml-1 bg-red-500 text-white text-xs">2</Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-1" />
                Notifications
                <Badge className="ml-1 bg-red-500 text-white text-xs">3</Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-1" />
                Profile
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* User Stats */}
      <div className="bg-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold">Completed Gigs</div>
              <div className="text-2xl font-bold text-primary">127</div>
            </div>
            <div>
              <div className="font-semibold">Total Earnings</div>
              <div className="text-2xl font-bold text-primary">2.45M TSH</div>
            </div>
            <div>
              <div className="font-semibold">Response Rate</div>
              <div className="text-2xl font-bold text-primary">98%</div>
            </div>
            <div>
              <div className="font-semibold">Live Status</div>
              <div className="text-green-600 font-medium">Online & Visible</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-primary mb-2">Linka v2.0</h2>
            <p className="text-gray-600">East Africa Gig Platform</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gigs by title, location, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => setPostGigModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Post Gig
            </Button>
            <Button variant="outline">
              Find Gigs
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">130</div>
              <div className="text-sm text-gray-600">Active Gigs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">1,467</div>
              <div className="text-sm text-gray-600">Online Users</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">109</div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">99.8%</div>
              <div className="text-sm text-gray-600">AI Protected</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button variant="default" size="sm">Dashboard</Button>
          <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>Live Gigs</Button>
          <Button variant="outline" size="sm">All Gigs</Button>
          <Button variant="outline" size="sm">Voice</Button>
          <Button variant="outline" size="sm">Match</Button>
          <Button variant="outline" size="sm">Security</Button>
          <Button variant="outline" size="sm">AI</Button>
          <Button variant="outline" size="sm">Filter</Button>
        </div>

        {/* Main Content */}
        <MainAppContent
          filteredGigs={filteredGigs}
          showMap={showMap}
          selectedGig={selectedGig}
          setSelectedGig={setSelectedGig}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onApplyGig={handleApplyGig}
        />
      </main>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => setUser(user)}
      />
      
      <PostGigModal 
        isOpen={postGigModalOpen}
        onClose={() => {
          setPostGigModalOpen(false);
          fetchGigs();
        }}
        userId={user?.id}
      />
    </div>
  );
};

export default MainApp;