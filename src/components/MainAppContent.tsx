import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GigSummaryStrip from './GigSummaryStrip';
import LiveMap from './LiveMap';
import { MapPin, DollarSign, Clock, Star, Filter } from 'lucide-react';

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

interface MainAppContentProps {
  filteredGigs: Gig[];
  showMap: boolean;
  selectedGig: Gig | null;
  setSelectedGig: (gig: Gig | null) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onApplyGig: (gig: Gig) => void;
}

const MainAppContent: React.FC<MainAppContentProps> = ({
  filteredGigs,
  showMap,
  selectedGig,
  setSelectedGig,
  statusFilter,
  setStatusFilter,
  selectedCategory,
  setSelectedCategory,
  onApplyGig
}) => {
  const categories = ['all', 'cleaning', 'delivery', 'tutoring', 'handyman', 'event', 'other'];
  const statusOptions = ['all', 'open', 'pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'disputed'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-600';
      case 'expired': return 'bg-gray-500';
      case 'disputed': return 'bg-red-500';
      default: return 'bg-green-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <>
      {/* Filter Controls */}
      <div className="flex gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <span>Status Filter</span>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(status => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <span>Category</span>
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gig Summary Strip */}
      <GigSummaryStrip gigs={filteredGigs} onGigClick={setSelectedGig} />

      {/* Map or Gig List */}
      {showMap ? (
        <LiveMap gigs={filteredGigs} onGigClick={setSelectedGig} />
      ) : (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Local Gigs</h3>
          <div className="grid gap-4">
            {filteredGigs.map((gig) => (
              <Card key={gig.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={gig.urgency === 'urgent' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}>
                          {gig.urgency}
                        </Badge>
                        <span className="text-sm text-gray-600">{gig.location}</span>
                        <span className="text-sm text-gray-600">(2.3 km)</span>
                      </div>
                      <h3 className="text-lg font-semibold text-primary mb-1">{gig.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{gig.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{gig.poster_name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{gig.poster_rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>TSh {gig.budget.toLocaleString()}</span>
                          <span className="text-xs">TZS</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="outline">{gig.category}</Badge>
                        <span>Posted {formatTimeAgo(gig.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedGig(gig)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => onApplyGig(gig)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <Badge className={`${getStatusColor(gig.status)} text-white`}>
                      {gig.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Need someone to deliver packages across the city</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Selected Gig Detail Modal */}
      {selectedGig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedGig(null)}>
          <Card className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedGig.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedGig(null)}>×</Button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedGig.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Budget:</span>
                    <span className="ml-2">TSh {selectedGig.budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span>
                    <span className="ml-2">{selectedGig.location}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Category:</span>
                    <span className="ml-2">{selectedGig.category}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>
                    <Badge className={`ml-2 ${getStatusColor(selectedGig.status)} text-white`}>
                      {selectedGig.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedGig(null)}>Close</Button>
                  <Button onClick={() => onApplyGig(selectedGig)}>Apply Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default MainAppContent;