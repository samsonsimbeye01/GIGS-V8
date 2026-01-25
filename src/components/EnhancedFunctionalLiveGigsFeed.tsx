import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Plus, Zap, Clock, MapPin } from 'lucide-react';
import DynamicGigCard from './DynamicGigCard';
import FunctionalPostGigModal from './FunctionalPostGigModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  status: string;
  created_at: string;
  user_id: string;
  client_name?: string;
  urgency?: 'low' | 'medium' | 'high';
  views?: number;
  applicants?: number;
}

interface EnhancedFunctionalLiveGigsFeedProps {
  user: any;
  gigs: Gig[];
  loading: boolean;
  onApplyToGig: (gigId: string) => Promise<void>;
  onCreateGig: (gig: Partial<Gig>) => Promise<void>;
  showAuth: () => void;
}

const EnhancedFunctionalLiveGigsFeed: React.FC<EnhancedFunctionalLiveGigsFeedProps> = ({
  user,
  gigs,
  loading,
  onApplyToGig,
  onCreateGig,
  showAuth
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showPostModal, setShowPostModal] = useState(false);
  const [filteredGigs, setFilteredGigs] = useState<Gig[]>([]);
  const [liveGigs, setLiveGigs] = useState<Gig[]>([]);
  const isMobile = useIsMobile();

  const categories = ['all', 'Design', 'Development', 'Writing', 'Marketing', 'Translation', 'Data Entry'];
  const locations = ['all', 'Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Mbeya', 'Tanga'];

  useEffect(() => {
    let filtered = [...gigs];

    if (searchTerm) {
      filtered = filtered.filter(gig => 
        gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(gig => gig.category === selectedCategory);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(gig => gig.location === selectedLocation);
    }

    // Sort gigs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    setFilteredGigs(filtered);
  }, [gigs, searchTerm, selectedCategory, selectedLocation, sortBy]);

  useEffect(() => {
    // Simulate live gig updates
    const interval = setInterval(() => {
      const newGigs = [
        {
          id: `live-${Date.now()}`,
          title: 'Urgent: Logo Design Needed',
          description: 'Need a professional logo for startup company. Quick turnaround required.',
          price: 250000,
          location: 'Dar es Salaam',
          category: 'Design',
          status: 'open',
          created_at: new Date().toISOString(),
          user_id: 'live-user',
          client_name: 'StartupCo',
          urgency: 'high' as const,
          views: 1,
          applicants: 0
        }
      ];
      
      if (Math.random() > 0.7) {
        setLiveGigs(prev => [...newGigs, ...prev.slice(0, 2)]);
        toast({ title: 'New gig posted!', description: newGigs[0].title });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleApply = async (gigId: string) => {
    if (!user) {
      showAuth();
      return;
    }
    await onApplyToGig(gigId);
  };

  const handleCreateGig = async (gigData: Partial<Gig>) => {
    await onCreateGig(gigData);
    setShowPostModal(false);
  };

  const allGigs = [...liveGigs, ...filteredGigs];

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Gigs Feed</h2>
          <p className="text-muted-foreground">{allGigs.length} active gigs available</p>
        </div>
        <Button onClick={() => setShowPostModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Post Gig
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-5'}`}>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search gigs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Updates Banner */}
      {liveGigs.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Zap className="w-5 h-5" />
              Live Updates - {liveGigs.length} New Gigs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {liveGigs.slice(0, 2).map((gig) => (
                <DynamicGigCard 
                  key={gig.id} 
                  gig={gig} 
                  onApply={handleApply}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gigs Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Gigs ({allGigs.length})</TabsTrigger>
          <TabsTrigger value="urgent">Urgent ({allGigs.filter(g => g.urgency === 'high').length})</TabsTrigger>
          <TabsTrigger value="recent">Recent ({allGigs.filter(g => {
            const hours = (Date.now() - new Date(g.created_at).getTime()) / (1000 * 60 * 60);
            return hours < 24;
          }).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading gigs...</div>
          ) : allGigs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No gigs found matching your criteria.</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
              {allGigs.map((gig) => (
                <DynamicGigCard 
                  key={gig.id} 
                  gig={gig} 
                  onApply={handleApply}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="urgent" className="space-y-4">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
            {allGigs.filter(g => g.urgency === 'high').map((gig) => (
              <DynamicGigCard 
                key={gig.id} 
                gig={gig} 
                onApply={handleApply}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
            {allGigs.filter(g => {
              const hours = (Date.now() - new Date(g.created_at).getTime()) / (1000 * 60 * 60);
              return hours < 24;
            }).map((gig) => (
              <DynamicGigCard 
                key={gig.id} 
                gig={gig} 
                onApply={handleApply}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Post Gig Modal */}
      <FunctionalPostGigModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handleCreateGig}
        user={user}
        showAuth={showAuth}
      />
    </div>
  );
};

export default EnhancedFunctionalLiveGigsFeed;