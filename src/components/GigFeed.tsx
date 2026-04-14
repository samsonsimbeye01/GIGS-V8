import React, { useMemo, useState } from 'react';
import GigCard from './GigCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, BarChart3, Wallet, Shield } from 'lucide-react';

const mockGigs = [
  {
    id: '1',
    title: 'House Cleaning Service',
    description: 'Need someone to clean a 3-bedroom house. Must bring own supplies.',
    location: 'Kariakoo, Dar es Salaam',
    budget: 25000,
    feePercent: 10,
    timeAgo: '2 hours ago',
    category: 'Cleaning',
    distance: '1.2 km',
    poster: 'Amina K.',
    urgency: 'medium' as const,
    trustLevel: 4 as const,
    rating: 4.8,
    completionRate: 96,
    responseTime: '12 min',
    disputeRate: 1.4,
    sentimentScore: 91,
    views: 32,
    highDemand: true,
    suspiciousAccount: false,
    featured: true,
    expectedImpressions: 1800
  },
  {
    id: '2',
    title: 'Delivery Driver Needed',
    description: 'Urgent delivery of documents to Msimbazi area. Must have motorcycle.',
    location: 'City Centre, Dar es Salaam',
    budget: 15000,
    feePercent: 12,
    timeAgo: '30 minutes ago',
    category: 'Delivery',
    distance: '0.8 km',
    poster: 'John M.',
    urgency: 'high' as const,
    trustLevel: 2 as const,
    rating: 4.1,
    completionRate: 82,
    responseTime: '5 min',
    disputeRate: 3.9,
    sentimentScore: 76,
    views: 47,
    highDemand: true,
    suspiciousAccount: true,
    featured: false,
    expectedImpressions: 1200
  },
  {
    id: '3',
    title: 'Garden Maintenance',
    description: 'Weekly garden maintenance including watering and weeding.',
    location: 'Masaki, Dar es Salaam',
    budget: 35000,
    feePercent: 8,
    timeAgo: '1 day ago',
    category: 'Gardening',
    distance: '2.1 km',
    poster: 'Sarah L.',
    urgency: 'low' as const,
    trustLevel: 5 as const,
    rating: 4.9,
    completionRate: 98,
    responseTime: '20 min',
    disputeRate: 0.6,
    sentimentScore: 95,
    views: 21,
    highDemand: false,
    suspiciousAccount: false,
    featured: false,
    expectedImpressions: 950
  }
];

const categories = ['All', 'Cleaning', 'Delivery', 'Gardening', 'Construction', 'Tutoring'];

const GigFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [plan, setPlan] = useState<'basic' | 'pro' | 'elite'>('basic');
  const [gigs] = useState(mockGigs);

  const filteredGigs = useMemo(
    () =>
      gigs.filter((gig) => {
        const matchesSearch =
          gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gig.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [gigs, searchTerm, selectedCategory]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius)] border border-[rgb(var(--border))] bg-card p-4 space-y-4">
        <div className="grid gap-2 md:grid-cols-3">
          <div className="rounded-xl bg-[rgb(var(--muted))] p-3 text-small">
            <p className="text-[rgb(var(--muted-foreground))] flex items-center gap-1"><BarChart3 className="h-4 w-4" /> ROI signal</p>
            <p className="font-semibold text-[rgb(var(--foreground))]">Pro users earn 32% more on average</p>
          </div>
          <div className="rounded-xl bg-[rgb(var(--muted))] p-3 text-small">
            <p className="text-[rgb(var(--muted-foreground))] flex items-center gap-1"><Wallet className="h-4 w-4" /> Wallet & escrow</p>
            <p className="font-semibold text-[rgb(var(--foreground))]">Escrow-backed release with dispute window</p>
          </div>
          <div className="rounded-xl bg-[rgb(var(--muted))] p-3 text-small">
            <p className="text-[rgb(var(--muted-foreground))] flex items-center gap-1"><Shield className="h-4 w-4" /> Trust economy</p>
            <p className="font-semibold text-[rgb(var(--foreground))]">Weighted reputation + verification levels</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-small text-[rgb(var(--muted-foreground))]">Plan:</span>
          <Button size="sm" variant={plan === 'basic' ? 'default' : 'outline'} onClick={() => setPlan('basic')}>Basic</Button>
          <Button size="sm" variant={plan === 'pro' ? 'default' : 'outline'} onClick={() => setPlan('pro')}>Pro</Button>
          <Button size="sm" variant={plan === 'elite' ? 'default' : 'outline'} onClick={() => setPlan('elite')}>Elite</Button>
          <span className="text-caption text-[rgb(var(--muted-foreground))]">Upgrade flow target: 2 taps max</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[rgb(var(--muted-foreground))]" />
            <Input
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 border-[rgb(var(--border))]">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="flex items-center gap-2 border-[rgb(var(--border))]">
            <MapPin className="h-4 w-4" />
            Near Me
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredGigs.map((gig) => (
          <GigCard key={gig.id} {...gig} />
        ))}
      </div>
    </div>
  );
};

export default GigFeed;
