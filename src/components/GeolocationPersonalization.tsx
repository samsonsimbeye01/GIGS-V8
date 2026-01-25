import React, { useEffect, useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface PersonalizationData {
  language: string;
  currency: string;
  paymentMethods: string[];
  featuredGigs: any[];
  regulatoryTerms: string;
}

const GeolocationPersonalization: React.FC = () => {
  const { country, coordinates } = useLocation();
  const [personalization, setPersonalization] = useState<PersonalizationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const personalizeContent = async () => {
      if (!country || !coordinates) return;

      try {
        // Call AI personalization function
        const { data, error } = await supabase.functions.invoke('ai-geolocation-personalization', {
          body: {
            country: country.code,
            coordinates,
            timezone: country.timezone,
            currency: country.currency
          }
        });

        if (error) throw error;

        setPersonalization(data);
        
        // Apply personalization to app state
        localStorage.setItem('userPersonalization', JSON.stringify(data));
        
        toast({
          title: 'Content Personalized',
          description: `Customized for ${country.name}`,
        });
      } catch (error) {
        console.error('Personalization error:', error);
      } finally {
        setLoading(false);
      }
    };

    personalizeContent();
  }, [country, coordinates]);

  if (loading || !personalization) return null;

  return (
    <div className="hidden">
      {/* This component works in background - no UI changes */}
    </div>
  );
};

export default GeolocationPersonalization;