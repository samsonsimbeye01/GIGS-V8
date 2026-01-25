import React, { useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CountrySelector from './CountrySelector';
import { AFRICAN_COUNTRIES } from '@/utils/africaLocalization';
import { MapPin, Clock, Phone } from 'lucide-react';

interface LocationAwareHeaderProps {
  className?: string;
}

const LocationAwareHeader: React.FC<LocationAwareHeaderProps> = ({ className = '' }) => {
  const { country, coordinates, getCurrentTime } = useLocation();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [selectedCountry, setSelectedCountry] = useState(country.code);
  const [overrideCountry, setOverrideCountry] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [getCurrentTime]);

  useEffect(() => {
    // Save country preference to localStorage
    if (overrideCountry) {
      localStorage.setItem('linka_country_override', overrideCountry);
    }
  }, [overrideCountry]);

  useEffect(() => {
    // Load country preference from localStorage
    const saved = localStorage.getItem('linka_country_override');
    if (saved && AFRICAN_COUNTRIES[saved]) {
      setOverrideCountry(saved);
      setSelectedCountry(saved);
    }
  }, []);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setOverrideCountry(countryCode);
  };

  const displayCountry = overrideCountry ? AFRICAN_COUNTRIES[overrideCountry] : country;

  return (
    <div className={`flex items-center justify-between p-4 bg-card border-b ${className}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-medium">{displayCountry.name}</span>
          <Badge variant="secondary">{displayCountry.currency}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{currentTime}</span>
        </div>
        
        {coordinates && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Emergency: {displayCountry.emergencyNumbers.police}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <CountrySelector 
          currentCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          className="w-[200px]"
        />
        {overrideCountry && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setOverrideCountry(null);
              setSelectedCountry(country.code);
              localStorage.removeItem('linka_country_override');
            }}
          >
            Auto-detect
          </Button>
        )}
      </div>
    </div>
  );
};

export default LocationAwareHeader;