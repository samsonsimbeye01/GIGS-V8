import React from 'react';
import { useLocation } from '@/contexts/LocationContext';

interface SwahiliTextProps {
  english: string;
  swahili: string;
  className?: string;
}

export const SwahiliText: React.FC<SwahiliTextProps> = ({ english, swahili, className }) => {
  const { country } = useLocation();
  const isSwahiliPrimary = country.languages[0] === 'sw';
  
  return (
    <span className={className}>
      {isSwahiliPrimary ? swahili : english}
    </span>
  );
};

// Common translations
export const translations = {
  // Navigation
  home: { en: 'Home', sw: 'Nyumbani' },
  messages: { en: 'Messages', sw: 'Ujumbe' },
  notifications: { en: 'Notifications', sw: 'Arifa' },
  profile: { en: 'Profile', sw: 'Wasifu' },
  settings: { en: 'Settings', sw: 'Mipangilio' },
  
  // Gig related
  postGig: { en: 'Post Gig', sw: 'Chapisha Kazi' },
  findGigs: { en: 'Find Gigs', sw: 'Tafuta Kazi' },
  myGigs: { en: 'My Gigs', sw: 'Kazi Zangu' },
  gigDetails: { en: 'Gig Details', sw: 'Maelezo ya Kazi' },
  
  // Common actions
  save: { en: 'Save', sw: 'Hifadhi' },
  cancel: { en: 'Cancel', sw: 'Ghairi' },
  submit: { en: 'Submit', sw: 'Wasilisha' },
  edit: { en: 'Edit', sw: 'Hariri' },
  delete: { en: 'Delete', sw: 'Futa' },
  
  // Status
  active: { en: 'Active', sw: 'Amilifu' },
  pending: { en: 'Pending', sw: 'Inasubiri' },
  completed: { en: 'Completed', sw: 'Imekamilika' },
  
  // Forms
  title: { en: 'Title', sw: 'Kichwa' },
  description: { en: 'Description', sw: 'Maelezo' },
  location: { en: 'Location', sw: 'Mahali' },
  price: { en: 'Price', sw: 'Bei' },
  category: { en: 'Category', sw: 'Jamii' },
  
  // Time
  today: { en: 'Today', sw: 'Leo' },
  yesterday: { en: 'Yesterday', sw: 'Jana' },
  tomorrow: { en: 'Tomorrow', sw: 'Kesho' },
  
  // Dashboard
  dashboard: { en: 'Work', sw: 'Kazi' },
  totalGigs: { en: 'Total Gigs', sw: 'Jumla ya Kazi' },
  earnings: { en: 'Earnings', sw: 'Mapato' },
  rating: { en: 'Rating', sw: 'Kiwango' }
};

export const useTranslation = () => {
  const { country } = useLocation();
  const isSwahiliPrimary = country.languages[0] === 'sw';
  
  const t = (key: keyof typeof translations) => {
    const translation = translations[key];
    return isSwahiliPrimary ? translation.sw : translation.en;
  };
  
  return { t, isSwahiliPrimary };
};
