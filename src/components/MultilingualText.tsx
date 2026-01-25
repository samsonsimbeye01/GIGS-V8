import React, { useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { Button } from '@/components/ui/button';
import { Languages, Loader2 } from 'lucide-react';

interface MultilingualTextProps {
  text: string;
  className?: string;
  showToggle?: boolean;
}

const MultilingualText: React.FC<MultilingualTextProps> = ({ 
  text, 
  className = '', 
  showToggle = true 
}) => {
  const { country } = useLocation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);
  const [currentLang, setCurrentLang] = useState('en');

  const translateText = async (targetLang: string) => {
    if (targetLang === 'en' || !text) {
      setTranslatedText(text);
      return;
    }

    setIsTranslating(true);
    try {
      // Simulate translation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock translations for demo
      const mockTranslations: Record<string, Record<string, string>> = {
        'sw': {
          'Find Gigs': 'Tafuta Kazi',
          'Post Gig': 'Chapisha Kazi',
          'Messages': 'Ujumbe',
          'Profile': 'Wasifu',
          'Settings': 'Mipangilio'
        },
        'fr': {
          'Find Gigs': 'Trouver des Concerts',
          'Post Gig': 'Publier un Concert',
          'Messages': 'Messages',
          'Profile': 'Profil',
          'Settings': 'Paramètres'
        },
        'ar': {
          'Find Gigs': 'العثور على الوظائف',
          'Post Gig': 'نشر وظيفة',
          'Messages': 'الرسائل',
          'Profile': 'الملف الشخصي',
          'Settings': 'الإعدادات'
        }
      };
      
      const translated = mockTranslations[targetLang]?.[text] || text;
      setTranslatedText(translated);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText(text);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    setShowOriginal(lang === 'en');
    translateText(lang);
  };

  useEffect(() => {
    // Auto-translate based on country's primary language
    const primaryLang = country.languages[0];
    if (primaryLang !== 'en' && showOriginal) {
      handleLanguageChange(primaryLang);
    }
  }, [country, text]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={isTranslating ? 'opacity-50' : ''}>
        {isTranslating ? (
          <div className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-sm">Translating...</span>
          </div>
        ) : (
          showOriginal ? text : translatedText
        )}
      </span>
      
      {showToggle && country.languages.length > 1 && (
        <div className="flex items-center gap-1">
          <Languages className="w-3 h-3 text-muted-foreground" />
          <select 
            value={currentLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="text-xs bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="en">EN</option>
            {country.languages.filter(lang => lang !== 'en').map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default MultilingualText;