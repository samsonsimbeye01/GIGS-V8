import React, { useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPin, Filter, Clock } from 'lucide-react';
import CurrencyDisplay from './CurrencyDisplay';
import { jobCategories } from '@/utils/jobCategories';

interface LocalGigFilterProps {
  onFilterChange: (filters: GigFilters) => void;
  className?: string;
}

interface GigFilters {
  radius: number;
  minPrice: number;
  maxPrice: number;
  urgent: boolean;
  category: string;
}

const LocalGigFilter: React.FC<LocalGigFilterProps> = ({ onFilterChange, className = '' }) => {
  const { country, coordinates } = useLocation();
  const [filters, setFilters] = useState<GigFilters>({
    radius: 10,
    minPrice: 0,
    maxPrice: 10000,
    urgent: false,
    category: 'all'
  });

  const categories = [
    { key: 'all', name: 'All Categories', emoji: '🔍' },
    ...Object.entries(jobCategories).map(([key, category]) => ({
      key,
      name: category.name,
      emoji: category.emoji
    }))
  ];

  const updateFilter = (key: keyof GigFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getCurrencyRange = () => {
    const ranges: Record<string, { min: number; max: number; step: number }> = {
      'NGN': { min: 0, max: 50000, step: 1000 },
      'KES': { min: 0, max: 10000, step: 500 },
      'TZS': { min: 0, max: 50000, step: 1000 },
      'UGX': { min: 0, max: 100000, step: 5000 },
      'GHS': { min: 0, max: 1000, step: 50 },
      'ZAR': { min: 0, max: 2000, step: 100 },
      'EGP': { min: 0, max: 5000, step: 250 },
      'MAD': { min: 0, max: 2000, step: 100 },
      'ETB': { min: 0, max: 5000, step: 250 },
      'RWF': { min: 0, max: 50000, step: 1000 }
    };
    return ranges[country.currency] || ranges['KES'];
  };

  const currencyRange = getCurrencyRange();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Local Gig Filters
          <Badge variant="outline">{country.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {coordinates && (
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Search Radius: {filters.radius} km
            </label>
            <Slider
              value={[filters.radius]}
              onValueChange={([value]) => updateFilter('radius', value)}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        )}
        
        <div>
          <label className="text-sm font-medium mb-2 block">Price Range</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Min:</span>
              <CurrencyDisplay amount={filters.minPrice} showIcon={false} />
            </div>
            <Slider
              value={[filters.minPrice]}
              onValueChange={([value]) => updateFilter('minPrice', value)}
              max={currencyRange.max}
              min={currencyRange.min}
              step={currencyRange.step}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm">Max:</span>
              <CurrencyDisplay amount={filters.maxPrice} showIcon={false} />
            </div>
            <Slider
              value={[filters.maxPrice]}
              onValueChange={([value]) => updateFilter('maxPrice', value)}
              max={currencyRange.max}
              min={currencyRange.min}
              step={currencyRange.step}
              className="w-full"
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {categories.map(cat => (
              <Button
                key={cat.key}
                variant={filters.category === cat.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateFilter('category', cat.key)}
                className="text-xs justify-start"
              >
                <span className="mr-2">{cat.emoji}</span>
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={filters.urgent ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilter('urgent', !filters.urgent)}
            className="flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            Urgent Only
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalGigFilter;