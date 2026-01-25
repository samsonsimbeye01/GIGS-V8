import React, { useState, useEffect } from 'react';
import { Globe, Volume2, Mic, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface Translation {
  [key: string]: {
    [languageCode: string]: string;
  };
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
];

const translations: Translation = {
  'welcome': {
    en: 'Welcome to KaziLink',
    sw: 'Karibu KaziLink',
    fr: 'Bienvenue à KaziLink',
    ar: 'مرحبا بكم في KaziLink'
  },
  'find_gigs': {
    en: 'Find Gigs',
    sw: 'Tafuta Kazi',
    fr: 'Trouver des Concerts',
    ar: 'العثور على الوظائف'
  },
  'post_gig': {
    en: 'Post a Gig',
    sw: 'Chapisha Kazi',
    fr: 'Publier un Concert',
    ar: 'نشر وظيفة'
  },
  'my_profile': {
    en: 'My Profile',
    sw: 'Wasifu Wangu',
    fr: 'Mon Profil',
    ar: 'ملفي الشخصي'
  },
  'earnings': {
    en: 'Earnings',
    sw: 'Mapato',
    fr: 'Gains',
    ar: 'الأرباح'
  },
  'trust_score': {
    en: 'Trust Score',
    sw: 'Kiwango cha Kuaminika',
    fr: 'Score de Confiance',
    ar: 'نقاط الثقة'
  },
  'location': {
    en: 'Location',
    sw: 'Mahali',
    fr: 'Emplacement',
    ar: 'الموقع'
  },
  'budget': {
    en: 'Budget',
    sw: 'Bajeti',
    fr: 'Budget',
    ar: 'الميزانية'
  },
  'description': {
    en: 'Description',
    sw: 'Maelezo',
    fr: 'Description',
    ar: 'الوصف'
  },
  'apply_now': {
    en: 'Apply Now',
    sw: 'Omba Sasa',
    fr: 'Postuler Maintenant',
    ar: 'قدم الآن'
  }
};

interface MultilingualSupportProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const MultilingualSupport: React.FC<MultilingualSupportProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = getLanguageCode(currentLanguage);
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [currentLanguage]);

  const getLanguageCode = (langCode: string) => {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'sw': 'sw-TZ',
      'fr': 'fr-FR',
      'ar': 'ar-SA'
    };
    return langMap[langCode] || 'en-US';
  };

  const translate = (key: string, targetLang?: string): string => {
    const lang = targetLang || currentLanguage;
    return translations[key]?.[lang] || translations[key]?.['en'] || key;
  };

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    setIsTranslating(true);
    
    try {
      // Simulate translation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would call a translation service like Google Translate
      const mockTranslations: { [key: string]: { [key: string]: string } } = {
        'Hello, how are you?': {
          sw: 'Hujambo, habari yako?',
          fr: 'Bonjour, comment allez-vous?',
          ar: 'مرحبا، كيف حالك؟'
        },
        'I need help with cleaning': {
          sw: 'Ninahitaji msaada wa kusafisha',
          fr: 'J\'ai besoin d\'aide pour le nettoyage',
          ar: 'أحتاج مساعدة في التنظيف'
        }
      };
      
      return mockTranslations[text]?.[targetLang] || `[${targetLang.toUpperCase()}] ${text}`;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text: string, lang: string = currentLanguage) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(lang);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceRecognition = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      toast({
        title: 'Voice Recognition Not Available',
        description: 'Your browser does not support voice recognition.',
        variant: 'destructive'
      });
    }
  };

  const handleVoiceInput = (transcript: string) => {
    toast({
      title: 'Voice Input Received',
      description: `You said: "${transcript}"`,
    });
    
    // Process voice commands
    const lowerTranscript = transcript.toLowerCase();
    if (lowerTranscript.includes('find gig') || lowerTranscript.includes('tafuta kazi')) {
      // Navigate to gig search
      console.log('Voice command: Find gigs');
    } else if (lowerTranscript.includes('post gig') || lowerTranscript.includes('chapisha kazi')) {
      // Navigate to post gig
      console.log('Voice command: Post gig');
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange(newLanguage);
    
    if (recognition) {
      recognition.lang = getLanguageCode(newLanguage);
    }
    
    toast({
      title: translate('language_changed', 'en'),
      description: `${translate('language_changed_to', 'en')} ${languages.find(l => l.code === newLanguage)?.name}`,
    });
  };

  const getCurrentLanguage = () => {
    return languages.find(l => l.code === currentLanguage) || languages[0];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Multilingual Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Language:</label>
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue>
                <div className="flex items-center gap-2">
                  <span>{getCurrentLanguage().flag}</span>
                  <span>{getCurrentLanguage().nativeName}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    <span className="text-muted-foreground">({lang.name})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Voice Features:</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => speakText(translate('welcome'))}
              className="flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Text to Speech
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={startVoiceRecognition}
              disabled={isListening}
              className="flex items-center gap-2"
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-red-500' : ''}`} />
              {isListening ? 'Listening...' : 'Voice Input'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Translations:</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(translations).slice(0, 6).map((key) => (
              <div key={key} className="p-2 bg-muted rounded text-sm">
                <div className="font-medium">{translate(key)}</div>
                <div className="text-xs text-muted-foreground">
                  {translations[key]['en']}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Supported Languages:</label>
          <div className="flex flex-wrap gap-1">
            {languages.map((lang) => (
              <Badge
                key={lang.code}
                variant={lang.code === currentLanguage ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.flag} {lang.nativeName}
              </Badge>
            ))}
          </div>
        </div>

        {isTranslating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Languages className="w-4 h-4 animate-spin" />
            Translating...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { MultilingualSupport, translations };
export type { Language, Translation };