import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter } from 'lucide-react';

interface QuickActionsBarProps {
  onFilterChange?: (filters: any) => void;
  onSearch?: (query: string) => void;
}

const QuickActionsBar: React.FC<QuickActionsBarProps> = ({ onFilterChange, onSearch }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <div className="flex items-center gap-2 mb-4 p-2 bg-white rounded-lg border">
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search gigs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      <Button variant="outline" size="sm" onClick={() => onFilterChange && onFilterChange([])}>
        <Filter className="h-4 w-4 mr-1" />
        Filter
      </Button>
      
      <Button size="sm">
        <Plus className="h-4 w-4 mr-1" />
        Post
      </Button>
    </div>
  );
};

export default QuickActionsBar;