import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AFRICAN_COUNTRIES } from '@/utils/africaLocalization';
import { Globe } from 'lucide-react';

interface CountrySelectorProps {
  currentCountry: string;
  onCountryChange: (countryCode: string) => void;
  className?: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  currentCountry,
  onCountryChange,
  className = ''
}) => {
  return (
    <Select value={currentCountry} onValueChange={onCountryChange}>
      <SelectTrigger className={`w-[180px] ${className}`}>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <SelectValue placeholder="Select country" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(AFRICAN_COUNTRIES).map(([code, country]) => (
          <SelectItem key={code} value={code}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{country.name}</span>
              <span className="text-sm text-muted-foreground">({country.currency})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelector;