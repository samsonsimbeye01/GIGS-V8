import React, { useState } from 'react';
import GigCard from './GigCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin } from 'lucide-react';

const mockGigs = [
  {
    id: '1',
    title: 'House Cleaning Service',
    description: 'Need someone to clean a 3-bedroom house. Must bring own supplies.',
    location: 'Kariakoo, Dar es Salaam',
    price: 25000,
    timeAgo: '2 hours ago',
    category: 'Cleaning',
    distance: '1.2 km',
    poster: 'Amina K.',
    urgency: 'medium' as const
  },
  {
    id: '2',
    title: 'Delivery Driver Needed',
    description: 'Urgent delivery of documents to Msimbazi area. Must have motorcycle.',
    location: 'City Centre, Dar es Salaam',
    price: 15000,
    timeAgo: '30 minutes ago',
    category: 'Delivery',
    distance: '0.8 km',
    poster: 'John M.',
    urgency: 'high' as const
  },
  {
    id: '3',
    title: 'Garden Maintenance',
    description: 'Weekly garden maintenance including watering and weeding.',
    location: 'Masaki, Dar es Salaam',
    price: 35000,
    timeAgo: '1 day ago',
    category: 'Gardening',
    distance: '2.1 km',
    poster: 'Sarah L.',
    urgency: 'low' as const
  }
];

const categories = ['All', 'Cleaning', 'Delivery', 'Gardening', 'Construction', 'Tutoring'];

const GigFeed: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [gigs] = useState(mockGigs);

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Near Me
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredGigs.map(gig => (
          <GigCard key={gig.id} {...gig} />
        ))}
      </div>
    </div>
  );
};

export default GigFeed;