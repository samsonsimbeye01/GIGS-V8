import React, { createContext, useContext, ReactNode } from 'react';
import { useLocationDetection } from '@/hooks/useLocationDetection';
import { CountryData } from '@/utils/africaLocalization';

interface LocationContextType {
  country: CountryData;
  coordinates: { lat: number; lng: number } | null;
  loading: boolean;
  error: string | null;
  formatPhoneNumber: (phone: string) => string;
  validateNationalId: (id: string) => boolean;
  getCurrentTime: () => string;
  getEmergencyNumbers: () => { police: string; ambulance: string; fire: string };
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { country, coordinates, loading, error } = useLocationDetection();

  const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    const format = country.phoneFormat;
    let formatted = format;
    
    let digitIndex = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (formatted[i] === 'X' && digitIndex < digits.length) {
        formatted = formatted.substring(0, i) + digits[digitIndex] + formatted.substring(i + 1);
        digitIndex++;
      }
    }
    
    return formatted;
  };

  const validateNationalId = (id: string): boolean => {
    const format = country.nationalIdFormat;
    const cleanId = id.replace(/[^A-Za-z0-9]/g, '');
    const formatLength = format.replace(/[^X]/g, '').length;
    
    return cleanId.length === formatLength;
  };

  const getCurrentTime = (): string => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: country.timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());
  };

  const getEmergencyNumbers = () => country.emergencyNumbers;

  const value: LocationContextType = {
    country,
    coordinates,
    loading,
    error,
    formatPhoneNumber,
    validateNationalId,
    getCurrentTime,
    getEmergencyNumbers
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export { LocationContext };