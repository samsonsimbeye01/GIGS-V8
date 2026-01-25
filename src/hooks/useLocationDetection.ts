import { useState, useEffect } from 'react';
import { AFRICAN_COUNTRIES, detectCountryFromCoords, CountryData } from '@/utils/africaLocalization';

interface LocationData {
  country: CountryData;
  coordinates: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
}

export const useLocationDetection = (): LocationData => {
  const [locationData, setLocationData] = useState<LocationData>({
    country: AFRICAN_COUNTRIES['TZ'], // Default to Tanzania
    coordinates: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // First try to get user's current position
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const countryCode = detectCountryFromCoords(latitude, longitude);
              
              setLocationData({
                country: AFRICAN_COUNTRIES[countryCode] || AFRICAN_COUNTRIES['TZ'],
                coordinates: { lat: latitude, lng: longitude },
                loading: false,
                error: null
              });
            },
            async (error) => {
              console.warn('Geolocation failed:', error);
              // Fallback to IP-based detection
              try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                const countryCode = data.country_code;
                
                if (AFRICAN_COUNTRIES[countryCode]) {
                  setLocationData({
                    country: AFRICAN_COUNTRIES[countryCode],
                    coordinates: { lat: data.latitude, lng: data.longitude },
                    loading: false,
                    error: null
                  });
                } else {
                  // Not in Africa, default to Tanzania
                  setLocationData({
                    country: AFRICAN_COUNTRIES['TZ'],
                    coordinates: null,
                    loading: false,
                    error: 'Location not supported. Defaulting to Tanzania.'
                  });
                }
              } catch (ipError) {
                console.error('IP detection failed:', ipError);
                setLocationData({
                  country: AFRICAN_COUNTRIES['TZ'],
                  coordinates: null,
                  loading: false,
                  error: 'Unable to detect location. Defaulting to Tanzania.'
                });
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            }
          );
        } else {
          // Geolocation not supported, fallback to IP
          try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const countryCode = data.country_code;
            
            if (AFRICAN_COUNTRIES[countryCode]) {
              setLocationData({
                country: AFRICAN_COUNTRIES[countryCode],
                coordinates: { lat: data.latitude, lng: data.longitude },
                loading: false,
                error: null
              });
            } else {
              setLocationData({
                country: AFRICAN_COUNTRIES['TZ'],
                coordinates: null,
                loading: false,
                error: 'Location not supported. Defaulting to Tanzania.'
              });
            }
          } catch (error) {
            console.error('Location detection failed:', error);
            setLocationData({
              country: AFRICAN_COUNTRIES['TZ'],
              coordinates: null,
              loading: false,
              error: 'Unable to detect location. Defaulting to Tanzania.'
            });
          }
        }
      } catch (error) {
        console.error('Location detection error:', error);
        setLocationData({
          country: AFRICAN_COUNTRIES['TZ'],
          coordinates: null,
          loading: false,
          error: 'Location detection failed. Defaulting to Tanzania.'
        });
      }
    };

    detectLocation();
  }, []);

  return locationData;
};